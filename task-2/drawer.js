
(() => {
    let initialized = false;
    let observer = null;

    // Wait until the homepage content needed by the drawer is available
    function sourcesReady() {
        if (!document.body) return false;

        const workCards = document.querySelectorAll(
            ".content-slider .content-card--work"
        );

        const serviceItems = document.querySelectorAll(
            ".site-navigation__submenu-link-text"
        );

        if (!workCards.length || !serviceItems.length) return false;

        const cardsReady = Array.from(workCards).every((card) =>
            card.querySelector(".content-card__title") &&
            card.querySelector(".content-card__link") &&
            card.querySelector(".content-card__image") &&
            card.querySelectorAll(".content-tags li").length >= 2
        );

        const servicesReady = Array.from(serviceItems).some((item) =>
            item.querySelector(".site-navigation__submenu-link-title") &&
            item.querySelector(".site-navigation__submenu-link-description")
        );

        return cardsReady && servicesReady;
    }

    function tryInit() {
        if (initialized || document.querySelector("#gain-footer-drawer")) {
            observer?.disconnect();
            return;
        }

        if (!sourcesReady()) return;

        initialized = true;
        observer?.disconnect();
        observer = null;

        initDrawer();
    }

    function start() {
        tryInit();

        if (initialized || document.querySelector("#gain-footer-drawer")) {
            return;
        }

        // Handle elements inserted after the initial HTML is parsed
        observer = new MutationObserver(tryInit);

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // Support execution before or after the DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, {
            once: true
        });
    } else {
        start();
    }

    function initDrawer() {
    // Prevent duplicate drawers
    if (document.querySelector("#gain-footer-drawer")) return;

    // Create the footer drawer
    const drawer = document.createElement("div");
    drawer.id = "gain-footer-drawer";

    // Chevron icons from Lucide: https://lucide.dev (ISC License)
    drawer.innerHTML = `
        <div class="gain-drawer-tab">
            <button
                class="gain-drawer-toggle gain-drawer-label"
                type="button"
                aria-expanded="false"
                aria-controls="gain-drawer-content"
            >
                Explore our work
            </button>

            <div
                class="gain-drawer-navigation"
                role="group"
                aria-label="Case study navigation"
            >
                <button
                    class="gain-drawer-prev"
                    type="button"
                    aria-label="Previous case studies"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path d="m15 18-6-6 6-6"/>
                    </svg>
                </button>

                <span
                    class="gain-drawer-page"
                    aria-live="polite"
                ></span>

                <button
                    class="gain-drawer-next"
                    type="button"
                    aria-label="Next case studies"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path d="m9 18 6-6-6-6"/>
                    </svg>
                </button>
            </div>

            <button
                class="gain-drawer-toggle gain-drawer-chevron"
                type="button"
                aria-label="Open case studies"
                aria-expanded="false"
                aria-controls="gain-drawer-content"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                >
                    <path d="m18 15-6-6-6 6"/>
                </svg>
            </button>
        </div>

        <div id="gain-drawer-content"></div>
    `;

    document.body.append(drawer);

    // Create an overlay behind the open drawer
    const overlay = document.createElement("div");
    overlay.id = "gain-drawer-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.append(overlay);

    // Read case studies directly from the homepage Work slider
    const workCards = document.querySelectorAll(
        ".content-slider .content-card--work"
    );

    const caseStudies = Array.from(workCards, (card) => {
        const image = card.querySelector(".content-card__image");
        const tags = card.querySelectorAll(".content-tags li");

        let imageUrl = image?.getAttribute("src") || "";

        // Extract the original image URL from the site's SVG placeholder
        if (imageUrl.startsWith("data:image/svg+xml;base64,")) {
            const svg = atob(imageUrl.split(",")[1]);

            const svgElement = new DOMParser()
                .parseFromString(svg, "image/svg+xml")
                .documentElement;

            const originalUrl = svgElement.getAttribute("data-u");

            if (originalUrl) {
                imageUrl = decodeURIComponent(originalUrl);
            }
        }

        return {
            title: card.querySelector(".content-card__title")?.textContent.trim(),
            url: card.querySelector(".content-card__link")?.href,
            imageUrl,
            service: tags[0]?.textContent.trim(),
            industry: tags[1]?.textContent.trim()
        };
    });

    // Read service descriptions from the Solutions navigation menu
    const serviceDescriptions = new Map();

    document.querySelectorAll(".site-navigation__submenu-link-text")
        .forEach((item) => {
            const name = item.querySelector(
                ".site-navigation__submenu-link-title"
            )?.textContent.trim();

            const description = item.querySelector(
                ".site-navigation__submenu-link-description"
            )?.textContent.trim();

            if (name && description) {
                serviceDescriptions.set(name, description);
            }
        });

    // Match each case study to its service description
    caseStudies.forEach((study) => {
        study.description = serviceDescriptions.get(study.service) || "";
    });

    // Get drawer elements
    const toggleButtons = drawer.querySelectorAll(".gain-drawer-toggle");
    const chevronButton = drawer.querySelector(".gain-drawer-chevron");
    const content = drawer.querySelector("#gain-drawer-content");

    // Track the currently visible tooltip
    let activeTag = null;
    let activeTooltip = null;

    // Hide the current tooltip
    function hideTooltip() {
        if (!activeTooltip) return;

        activeTooltip.classList.remove("is-visible", "is-below");
        activeTag.setAttribute("aria-expanded", "false");

        activeTag = null;
        activeTooltip = null;
    }

    // Position the tooltip without overflowing the viewport
    function showTooltip(tag, tooltip) {
        hideTooltip();

        activeTag = tag;
        activeTooltip = tooltip;

        tooltip.classList.add("is-visible");
        tag.setAttribute("aria-expanded", "true");

        const tagRect = tag.getBoundingClientRect();
        const drawerRect = drawer.getBoundingClientRect();

        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;

        const padding = 12;
        const gap = 12;

        // Keep the tooltip within horizontal viewport boundaries
        const left = Math.max(
            padding,
            Math.min(
                tagRect.left,
                window.innerWidth - tooltipWidth - padding
            )
        );

        const spaceAbove = tagRect.top;
        const spaceBelow = window.innerHeight - tagRect.bottom;

        // Prefer above unless below has more suitable space
        const showAbove =
            spaceAbove >= tooltipHeight + gap + padding ||
            (
                spaceBelow < tooltipHeight + gap + padding &&
                spaceAbove >= spaceBelow
            );

        const desiredTop = showAbove
            ? tagRect.top - tooltipHeight - gap
            : tagRect.bottom + gap;

        const top = Math.max(
            padding,
            Math.min(
                desiredTop,
                window.innerHeight - tooltipHeight - padding
            )
        );

        tooltip.classList.toggle("is-below", !showAbove);

        // Position relative to the drawer
        tooltip.style.left = `${left - drawerRect.left}px`;
        tooltip.style.top = `${top - drawerRect.top}px`;

        // Keep the triangle pointing toward the industry tag
        const arrowLeft = Math.max(
            10,
            Math.min(
                tagRect.left + tagRect.width / 2 - left - 7,
                tooltipWidth - 24
            )
        );

        tooltip.style.setProperty(
            "--arrow-left",
            `${arrowLeft}px`
        );
    }

    // Render the case studies inside the drawer
    caseStudies.forEach((study, index) => {
        const card = document.createElement("article");
        card.className = "gain-drawer-card";

        const image = document.createElement("img");
        image.src = study.imageUrl;
        image.alt = study.title;
        image.loading = "lazy";
        image.draggable = false;

        // Clip the subtle image zoom within the image frame
        const imageFrame = document.createElement("div");
        imageFrame.className = "gain-drawer-image-frame";
        imageFrame.append(image);

        const title = document.createElement("h3");
        title.textContent = study.title;

        // Create the industry tag and tooltip
        const tagWrapper = document.createElement("div");
        tagWrapper.className = "gain-drawer-tag-wrapper";

        const tag = document.createElement("button");
        tag.type = "button";
        tag.className = "gain-drawer-card-tag";
        tag.textContent = study.industry;
        tag.setAttribute("aria-expanded", "false");

        const tooltip = document.createElement("span");
        tooltip.className = "gain-drawer-tooltip";
        tooltip.id = `gain-drawer-tooltip-${index + 1}`;
        tooltip.setAttribute("role", "tooltip");

        tag.setAttribute("aria-describedby", tooltip.id);

        const serviceText = document.createElement("span");
        serviceText.textContent = `Service: ${study.service}`;

        const industryText = document.createElement("span");
        industryText.textContent = `Industry: ${study.industry}`;

        tooltip.append(serviceText, industryText);

        // Keep the tooltip outside the scrolling carousel
        tagWrapper.append(tag);
        drawer.append(tooltip);

        // Desktop: show on hover and hide when the mouse leaves
        tag.addEventListener("mouseenter", () => {
            if (window.matchMedia("(hover: hover)").matches) {
                showTooltip(tag, tooltip);
            }
        });

        tag.addEventListener("mouseleave", () => {
            if (window.matchMedia("(hover: hover)").matches) {
                if (activeTag === tag) hideTooltip();
            }
        });

        // Keyboard: show on focus and hide on blur
        tag.addEventListener("focus", () => {
            if (tag.matches(":focus-visible")) {
                showTooltip(tag, tooltip);
            }
        });

        tag.addEventListener("blur", () => {
            if (activeTag === tag) hideTooltip();
        });

        // Touch: tap to toggle the tooltip
        tag.addEventListener("click", () => {
            if (window.matchMedia("(hover: hover)").matches) return;

            if (activeTag === tag) {
                hideTooltip();
            } else {
                showTooltip(tag, tooltip);
            }
        });

        const description = document.createElement("p");
        description.textContent = study.description;

        const link = document.createElement("a");
        link.href = study.url;
        link.textContent = "View case study";

        card.append(imageFrame, title, tagWrapper, description, link);
        content.append(card);
    });

    // Get slider navigation elements in the top tab
    const navigation = drawer.querySelector(".gain-drawer-navigation");
    const prevButton = drawer.querySelector(".gain-drawer-prev");
    const nextButton = drawer.querySelector(".gain-drawer-next");
    const pageCounter = drawer.querySelector(".gain-drawer-page");

    let currentPage = 0;

    // Lock pagination during animated arrow navigation
    let isNavigating = false;
    let navigationTimeout = null;

    // Determine how many cards fit on each page
    function getCardsPerPage() {
        if (window.innerWidth <= 639) return 1;
        if (window.innerWidth <= 1023) return 2;
        return 4;
    }

    // Calculate the total number of pages
    function getTotalPages() {
        return Math.ceil(caseStudies.length / getCardsPerPage());
    }

    // Update the page counter and navigation buttons
    function updateNavigation() {
        const totalPages = getTotalPages();

        pageCounter.textContent = `${currentPage + 1} / ${totalPages}`;
        prevButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage === totalPages - 1;
    }

    // Scroll to the requested page
    function goToPage(page) {
        const totalPages = getTotalPages();

        currentPage = Math.max(0, Math.min(page, totalPages - 1));

        const firstCard = content.querySelector(".gain-drawer-card");
        if (!firstCard) return;

        const gap = parseFloat(getComputedStyle(content).gap) || 0;
        const cardWidth = firstCard.getBoundingClientRect().width;

        const targetLeft =
            currentPage * getCardsPerPage() * (cardWidth + gap);

        const maxScroll = Math.max(
            0,
            content.scrollWidth - content.clientWidth
        );

        // Lock the counter while the carousel animates
        isNavigating =
            Math.abs(
                content.scrollLeft - Math.min(targetLeft, maxScroll)
            ) > 1;

        content.scrollTo({
            left: targetLeft,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth"
        });

        // Fallback if scrollend does not fire - Does not fire in certain browsers
        clearTimeout(navigationTimeout);

        if (isNavigating) {
            navigationTimeout = setTimeout(() => {
                isNavigating = false;
            }, 1000);
        }

        updateNavigation();
    }

    // Navigate using arrow buttons
    prevButton.addEventListener("click", () => {
        hideTooltip();
        goToPage(currentPage - 1);
    });

    nextButton.addEventListener("click", () => {
        hideTooltip();
        goToPage(currentPage + 1);
    });

    // Update pagination when scrolling or swiping manually
    content.addEventListener("scroll", () => {
        // Ignore intermediate positions during arrow navigation
        if (isNavigating) return;

        const firstCard = content.querySelector(".gain-drawer-card");
        if (!firstCard) return;

        const gap = parseFloat(getComputedStyle(content).gap) || 0;

        const pageWidth =
            getCardsPerPage() *
            (firstCard.getBoundingClientRect().width + gap);

        const maxScroll = content.scrollWidth - content.clientWidth;

        if (maxScroll > 0 && content.scrollLeft >= maxScroll - 2) {
            currentPage = getTotalPages() - 1;
        } else {
            currentPage = Math.max(
                0,
                Math.min(
                    Math.round(content.scrollLeft / pageWidth),
                    getTotalPages() - 1
                )
            );
        }

        updateNavigation();
    }, { passive: true });

    // Unlock pagination when smooth scrolling finishes
    content.addEventListener("scrollend", () => {
        clearTimeout(navigationTimeout);
        isNavigating = false;
    });

    // Close the tooltip when navigating between cards
    content.addEventListener("scroll", hideTooltip, { passive: true });

    // Allow desktop users to drag the slider with their mouse
    let startX = 0;
    let startScrollLeft = 0;
    let isPointerDown = false;
    let isDragging = false;
    let wasDragged = false;

    content.addEventListener("pointerdown", (event) => {
        // Manual interaction should unlock pagination immediately
        isNavigating = false;

        if (event.pointerType !== "mouse" || event.button !== 0) return;

        isPointerDown = true;
        isDragging = false;
        wasDragged = false;

        startX = event.clientX;
        startScrollLeft = content.scrollLeft;
    });

    // Allow manual trackpad and wheel scrolling to update pagination
    content.addEventListener("wheel", () => {
        isNavigating = false;
    }, { passive: true });

    content.addEventListener("pointermove", (event) => {
        if (!isPointerDown) return;

        const distance = event.clientX - startX;

        // Distinguish dragging from a normal click
        if (!isDragging && Math.abs(distance) > 5) {
            isDragging = true;
            wasDragged = true;

            content.classList.add("is-dragging");
            content.setPointerCapture(event.pointerId);
        }

        if (isDragging) {
            content.scrollLeft = startScrollLeft - distance;
        }
    });

    // Stop dragging when the mouse is released
    function stopDragging() {
        isPointerDown = false;
        isDragging = false;
        content.classList.remove("is-dragging");
    }

    content.addEventListener("pointerup", stopDragging);
    content.addEventListener("pointercancel", stopDragging);

    // Prevent accidentally opening a case study after dragging
    content.addEventListener("click", (event) => {
        if (wasDragged) {
            event.preventDefault();
            event.stopPropagation();
            wasDragged = false;
        }
    }, true);

    // Hide tooltips when interacting elsewhere
    document.addEventListener("pointerdown", (event) => {
        if (!event.target.closest("#gain-footer-drawer .gain-drawer-card-tag")) {
            hideTooltip();
        }
    });

    // Allow keyboard users to dismiss tooltips
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            hideTooltip();
        }
    });

    // Reset pagination when the viewport changes
    window.addEventListener("resize", () => {
        hideTooltip();
        isNavigating = false;
        goToPage(0);
    });

    // Initialize navigation
    updateNavigation();

    // Keep hidden drawer content inaccessible
    content.inert = true;
    content.setAttribute("aria-hidden", "true");
    navigation.inert = true;

    // Update drawer and overlay visibility
    function setDrawerOpen(isOpen) {
        if (!isOpen) hideTooltip();

        drawer.classList.toggle("is-open", isOpen);
        overlay.classList.toggle("is-visible", isOpen);

        // Update both drawer toggle buttons
        toggleButtons.forEach((button) => {
            button.setAttribute("aria-expanded", String(isOpen));
        });

        chevronButton.setAttribute(
            "aria-label",
            isOpen ? "Close case studies" : "Open case studies"
        );

        content.inert = !isOpen;
        content.setAttribute("aria-hidden", String(!isOpen));
        navigation.inert = !isOpen;
    }

    // Toggle drawer using the label or chevron
    toggleButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setDrawerOpen(!drawer.classList.contains("is-open"));
        });
    });

    // Close drawer when clicking the overlay
    overlay.addEventListener("click", () => {
        setDrawerOpen(false);
    });

    // Close the drawer when scrolling to the bottom of the page
    window.addEventListener("scroll", () => {
        const isAtBottom =
            window.scrollY + window.innerHeight >=
            document.documentElement.scrollHeight - 5;

        if (isAtBottom && drawer.classList.contains("is-open")) {
            setDrawerOpen(false);
        }
    }, { passive: true });

    // Inject CSS for console testing
    // TODO: Move CSS into drawer.css before submission
    const style = document.createElement("style");
    style.id = "gain-footer-drawer-styles";

    style.textContent = `
        /* Footer drawer: fixed to the bottom of the viewport */
        #gain-footer-drawer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            z-index: 10001;
            display: flex;
            flex-direction: column;
            align-items: center;
            pointer-events: none;

            transform: translateY(calc(100% - 52px));
            transition: transform 350ms ease;
        }

        /* Open drawer */
        #gain-footer-drawer.is-open {
            transform: translateY(0);
        }

        /* Top tab with toggle buttons and inline pagination */
        #gain-footer-drawer .gain-drawer-tab {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            height: 52px;
            padding: 0 16px;
            box-sizing: border-box;
            flex-shrink: 0;
            background: #fff;
            color: #222;
            border: 1px solid #ddd;
            border-bottom: none;
            border-radius: 12px 12px 0 0;
            font: inherit;
            font-weight: 600;
            pointer-events: auto;
        }

        /* Drawer toggle buttons */
        #gain-footer-drawer .gain-drawer-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            padding: 4px;
            border: none;
            border-radius: 6px;
            background: transparent;
            color: #222;
            font: inherit;
            font-weight: 600;
            cursor: pointer;
        }

        #gain-footer-drawer .gain-drawer-label {
            white-space: nowrap;
        }

        #gain-footer-drawer .gain-drawer-chevron {
            margin-left: 4px;
        }

        /* Hover effect only on the chevron, not the label */
        #gain-footer-drawer .gain-drawer-chevron:hover {
            background: #f3f4f6;
        }

        #gain-footer-drawer .gain-drawer-toggle:focus-visible {
            outline: 2px solid #2b46b7;
            outline-offset: 2px;
        }

        /* Animate the drawer chevron */
        #gain-footer-drawer .gain-drawer-chevron svg {
            transition: transform 350ms ease;
        }

        #gain-footer-drawer.is-open .gain-drawer-chevron svg {
            transform: rotate(180deg);
        }

        /* Inline pagination, visible only when drawer is open */
        #gain-footer-drawer .gain-drawer-navigation {
            display: none;
            align-items: center;
            justify-content: center;
            gap: 6px;
            flex-shrink: 0;
        }

        #gain-footer-drawer.is-open .gain-drawer-navigation {
            display: flex;
        }

        #gain-footer-drawer .gain-drawer-navigation button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            padding: 0;
            border: none;
            border-radius: 6px;
            background: transparent;
            color: #222;
            cursor: pointer;
        }

        #gain-footer-drawer .gain-drawer-navigation button:hover:not(:disabled) {
            background: #f3f4f6;
        }

        #gain-footer-drawer .gain-drawer-navigation button:focus-visible {
            outline: 2px solid #2b46b7;
            outline-offset: 2px;
        }

        #gain-footer-drawer .gain-drawer-navigation button:disabled {
            opacity: 0.35;
            cursor: not-allowed;
        }

        #gain-footer-drawer .gain-drawer-page {
            color: #222;
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
        }

        /* Horizontally scrollable case-study container */
        #gain-drawer-content {
            display: flex;
            align-items: stretch;
            justify-content: flex-start;
            gap: 16px;
            width: 100%;
            height: min(430px, 70vh);
            padding: 20px 24px;
            box-sizing: border-box;
            background: #fff;
            border-top: none;
            overflow-x: auto;
            overflow-y: hidden;
            pointer-events: auto;
            scroll-padding-inline: 24px;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            overscroll-behavior-x: contain;
            cursor: grab;
        }

        /* Disable snapping and smooth scrolling while dragging */
        #gain-drawer-content.is-dragging {
            cursor: grabbing;
            scroll-behavior: auto;
            scroll-snap-type: none;
            user-select: none;
        }

        /* Individual case-study cards */
        #gain-footer-drawer .gain-drawer-card {
            display: flex;
            flex-direction: column;
            gap: 10px;
            flex: 0 0 calc((100% - 48px) / 4);
            min-width: 0;
            padding: 12px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 8px;
            scroll-snap-align: start;
            transition: transform 220ms ease,
                        box-shadow 220ms ease,
                        border-color 220ms ease;
        }

        /* Keep the image zoom inside the original image bounds */
        #gain-footer-drawer .gain-drawer-image-frame {
            width: 100%;
            height: 120px;
            border-radius: 4px;
            overflow: hidden;
            flex-shrink: 0;
        }

        #gain-footer-drawer .gain-drawer-card img {
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-radius: 4px;
            transition: transform 250ms ease;
        }

        /* Subtle interaction feedback, without affecting touch swipe */
        @media (hover: hover) {
            #gain-drawer-content:not(.is-dragging) .gain-drawer-card:hover {
                transform: translateY(-3px);
                border-color: #cbd4e0;
                box-shadow: 0 7px 18px rgba(0, 0, 0, 0.12);
            }

            #gain-drawer-content:not(.is-dragging) .gain-drawer-card:hover img {
                transform: scale(1.045);
            }
        }

        #gain-footer-drawer .gain-drawer-card h3 {
            margin: 0;
            font-size: 16px;
            line-height: 1.3;
        }

        /* Keep card titles aligned across desktop sizes */
        @media (min-width: 1024px) {
            #gain-footer-drawer .gain-drawer-card h3 {
                min-height: 3.9em;
            }
        }

        @media (min-width: 1400px) {
            #gain-footer-drawer .gain-drawer-card h3 {
                min-height: 2.6em;
            }
        }

        /* Container for the industry tag */
        #gain-footer-drawer .gain-drawer-tag-wrapper {
            position: relative;
            align-self: stretch;
        }

        /* Interactive industry tag */
        #gain-footer-drawer .gain-drawer-card-tag {
            padding: 4px 8px;
            background: #f0f0f0;
            border: none;
            border-radius: 4px;
            color: #222;
            cursor: help;
            font: inherit;
            font-size: 12px;
        }

        /* Floating tooltip outside the scrolling carousel */
        #gain-footer-drawer .gain-drawer-tooltip {
            position: absolute;
            z-index: 10;
            display: flex;
            flex-direction: column;
            gap: 4px;
            width: min(220px, calc(100vw - 24px));
            padding: 12px;
            box-sizing: border-box;
            border-radius: 6px;
            background: #222;
            color: #fff;
            font-size: 12px;
            line-height: 1.5;
            overflow-wrap: anywhere;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: translateY(4px);
            transition: opacity 150ms ease,
                        visibility 150ms ease,
                        transform 150ms ease;
        }

        /* Triangle pointing down toward the tag */
        #gain-footer-drawer .gain-drawer-tooltip::after {
            content: "";
            position: absolute;
            top: 100%;
            left: var(--arrow-left, 20px);
            border-left: 7px solid transparent;
            border-right: 7px solid transparent;
            border-top: 7px solid #222;
        }

        /* Flip the triangle when the tooltip appears below */
        #gain-footer-drawer .gain-drawer-tooltip.is-below::after {
            top: auto;
            bottom: 100%;
            border-top: none;
            border-bottom: 7px solid #222;
        }

        /* Show the positioned tooltip */
        #gain-footer-drawer .gain-drawer-tooltip.is-below {
            transform: translateY(-4px);
        }

        #gain-footer-drawer .gain-drawer-tooltip.is-visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        #gain-footer-drawer .gain-drawer-card p {
            margin: 0;
            font-size: 13px;
            line-height: 1.4;
        }

        /* Case-study link styled as a button */
        #gain-footer-drawer .gain-drawer-card a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            align-self: flex-start;
            margin-top: auto;
            min-height: 42px;
            padding: 10px 18px;
            box-sizing: border-box;
            border-radius: 8px;
            background: #2b46b7;
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            line-height: 1.3;
            text-decoration: none;
            cursor: pointer;
            transition: background-color 200ms ease,
                        transform 200ms ease,
                        box-shadow 200ms ease;
        }

        /* Hover effect */
        #gain-footer-drawer .gain-drawer-card a:hover {
            background: #1c318a;
            color: #fff;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        /* Pressed effect */
        #gain-footer-drawer .gain-drawer-card a:active {
            background: #15266e;
            transform: translateY(0);
            box-shadow: none;
        }

        /* Keyboard focus */
        #gain-footer-drawer .gain-drawer-card a:focus-visible {
            outline: 3px solid #2b46b7;
            outline-offset: 3px;
        }

        /* Background overlay behind the drawer */
        #gain-drawer-overlay {
            position: fixed;
            inset: 0;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 350ms ease,
                        visibility 350ms ease;
        }

        /* Show overlay when drawer opens */
        #gain-drawer-overlay.is-visible {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        /* Tablet: two cards per view */
        @media (max-width: 1023px) {
            #gain-footer-drawer .gain-drawer-card {
                flex-basis: calc((100% - 16px) / 2);
            }
        }

        /* Mobile: one card per view */
        @media (max-width: 639px) {
            #gain-footer-drawer .gain-drawer-card {
                flex-basis: 100%;
            }
        }

        /* Respect users who prefer less motion */
        @media (prefers-reduced-motion: reduce) {
            #gain-footer-drawer,
            #gain-footer-drawer .gain-drawer-chevron svg,
            #gain-footer-drawer .gain-drawer-card,
            #gain-footer-drawer .gain-drawer-card img,
            #gain-footer-drawer .gain-drawer-card a,
            #gain-footer-drawer .gain-drawer-tooltip,
            #gain-drawer-overlay {
                transition: none;
            }

            #gain-drawer-content {
                scroll-behavior: auto;
            }

            #gain-drawer-content:not(.is-dragging) .gain-drawer-card:hover,
            #gain-drawer-content:not(.is-dragging) .gain-drawer-card:hover img,
            #gain-footer-drawer .gain-drawer-tooltip {
                transform: none;
            }
        }
    `;

    document.head.append(style);
    }
})();
