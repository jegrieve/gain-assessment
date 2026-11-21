
(() => {
    // ============================================================
    // 1. STATE AND SELECTORS
    // ============================================================
    // Keep everything self-contained for direct DevTools execution.
    const DRAWER_ID = "gain-footer-drawer";
    const WORK_CARD_SELECTOR = ".content-slider .content-card--work";
    const SERVICE_SELECTOR = ".site-navigation__submenu-link-text";

    let initialized = false;
    let readyObserver = null;

    // ============================================================
    // 2. READ EXISTING HOMEPAGE DATA
    // ============================================================
    // Wait until both the Work slider and Solutions menu are populated.
    function sourcesReady() {
        if (!document.body) return false;

        const workCards = document.querySelectorAll(WORK_CARD_SELECTOR);
        const serviceItems = document.querySelectorAll(SERVICE_SELECTOR);
        if (!workCards.length || !serviceItems.length) return false;

        const cardsReady = Array.from(workCards).every(card =>
            card.querySelector(".content-card__title") &&
            card.querySelector(".content-card__link") &&
            card.querySelector(".content-card__image") &&
            card.querySelectorAll(".content-tags li").length >= 2
        );

        const servicesReady = Array.from(serviceItems).some(item =>
            item.querySelector(".site-navigation__submenu-link-title") &&
            item.querySelector(".site-navigation__submenu-link-description")
        );

        return cardsReady && servicesReady;
    }

    // GAIN sometimes uses an SVG placeholder containing the real image URL.
    function getImageUrl(image) {
        let imageUrl = image?.getAttribute("src") || "";

        if (imageUrl.startsWith("data:image/svg+xml;base64,")) {
            const svg = atob(imageUrl.split(",")[1]);
            const svgElement = new DOMParser()
                .parseFromString(svg, "image/svg+xml")
                .documentElement;
            const originalUrl = svgElement.getAttribute("data-u");

            if (originalUrl) imageUrl = decodeURIComponent(originalUrl);
        }

        return imageUrl;
    }

    // All titles, images, tags, links and descriptions come from the page.
    function readCaseStudies() {
        const workCards = document.querySelectorAll(WORK_CARD_SELECTOR);
        const caseStudies = Array.from(workCards, card => {
            const tags = card.querySelectorAll(".content-tags li");

            return {
                title: card.querySelector(".content-card__title")?.textContent.trim(),
                url: card.querySelector(".content-card__link")?.href,
                imageUrl: getImageUrl(card.querySelector(".content-card__image")),
                service: tags[0]?.textContent.trim(),
                industry: tags[1]?.textContent.trim()
            };
        });

        const serviceDescriptions = new Map();
        document.querySelectorAll(SERVICE_SELECTOR).forEach(item => {
            const name = item.querySelector(
                ".site-navigation__submenu-link-title"
            )?.textContent.trim();
            const description = item.querySelector(
                ".site-navigation__submenu-link-description"
            )?.textContent.trim();

            if (name && description) serviceDescriptions.set(name, description);
        });

        caseStudies.forEach(study => {
            study.description = serviceDescriptions.get(study.service) || "";
        });

        return caseStudies;
    }

    // ============================================================
    // 3. CREATE THE DRAWER SHELL
    // ============================================================
    function createDrawerShell() {
        const drawer = document.createElement("div");
        drawer.id = DRAWER_ID;

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

        const overlay = document.createElement("div");
        overlay.id = "gain-drawer-overlay";
        overlay.setAttribute("aria-hidden", "true");
        document.body.append(overlay);

        return {
            drawer,
            overlay,
            content: drawer.querySelector("#gain-drawer-content")
        };
    }

    // ============================================================
    // 4. TOOLTIP BEHAVIOUR
    // ============================================================
    function createTooltipController(drawer) {
        let activeTag = null;
        let activeTooltip = null;

        function hideTooltip() {
            if (!activeTooltip) return;

            activeTooltip.classList.remove("is-visible", "is-below");
            activeTag.setAttribute("aria-expanded", "false");
            activeTag = null;
            activeTooltip = null;
        }

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

            // Keep the tooltip inside the viewport, preferably above its tag.
            const left = Math.max(
                padding,
                Math.min(tagRect.left, window.innerWidth - tooltipWidth - padding)
            );
            const spaceAbove = tagRect.top;
            const spaceBelow = window.innerHeight - tagRect.bottom;
            const showAbove =
                spaceAbove >= tooltipHeight + gap + padding ||
                (spaceBelow < tooltipHeight + gap + padding && spaceAbove >= spaceBelow);

            const desiredTop = showAbove
                ? tagRect.top - tooltipHeight - gap
                : tagRect.bottom + gap;
            const top = Math.max(
                padding,
                Math.min(desiredTop, window.innerHeight - tooltipHeight - padding)
            );

            tooltip.classList.toggle("is-below", !showAbove);
            tooltip.style.left = `${left - drawerRect.left}px`;
            tooltip.style.top = `${top - drawerRect.top}px`;

            // Keep the tooltip triangle pointing towards the industry tag.
            const arrowLeft = Math.max(
                10,
                Math.min(tagRect.left + tagRect.width / 2 - left - 7, tooltipWidth - 24)
            );
            tooltip.style.setProperty("--arrow-left", `${arrowLeft}px`);
        }

        function bindTooltip(tag, tooltip) {
            // Desktop hover.
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

            // Keyboard focus.
            tag.addEventListener("focus", () => {
                if (tag.matches(":focus-visible")) showTooltip(tag, tooltip);
            });
            tag.addEventListener("blur", () => {
                if (activeTag === tag) hideTooltip();
            });

            // Touch tap.
            tag.addEventListener("click", () => {
                if (window.matchMedia("(hover: hover)").matches) return;
                if (activeTag === tag) hideTooltip();
                else showTooltip(tag, tooltip);
            });
        }

        // Dismiss the tooltip when interacting away from a tag or using Escape.
        document.addEventListener("pointerdown", event => {
            if (!event.target.closest("#gain-footer-drawer .gain-drawer-card-tag")) {
                hideTooltip();
            }
        });
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") hideTooltip();
        });

        return { hideTooltip, bindTooltip };
    }

    // ============================================================
    // 5. RENDER CASE-STUDY CARDS
    // ============================================================
    function renderCaseStudies(drawer, content, caseStudies, bindTooltip) {
        caseStudies.forEach((study, index) => {
            const card = document.createElement("article");
            card.className = "gain-drawer-card";

            const image = document.createElement("img");
            image.src = study.imageUrl;
            image.alt = study.title;
            image.loading = "lazy";
            image.draggable = false;

            const imageFrame = document.createElement("div");
            imageFrame.className = "gain-drawer-image-frame";
            imageFrame.append(image);

            const title = document.createElement("h3");
            title.textContent = study.title;

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

            // Keep tooltips outside the scrollable carousel to avoid clipping.
            tagWrapper.append(tag);
            drawer.append(tooltip);
            bindTooltip(tag, tooltip);

            const description = document.createElement("p");
            description.textContent = study.description;

            const link = document.createElement("a");
            link.href = study.url;
            link.textContent = "View case study";

            card.append(imageFrame, title, tagWrapper, description, link);
            content.append(card);
        });
    }

    // ============================================================
    // 6. CAROUSEL: PAGINATION, SCROLLING AND DRAGGING
    // ============================================================
    function initCarousel(drawer, content, caseStudies, hideTooltip) {
        const prevButton = drawer.querySelector(".gain-drawer-prev");
        const nextButton = drawer.querySelector(".gain-drawer-next");
        const pageCounter = drawer.querySelector(".gain-drawer-page");

        let currentPage = 0;
        let isNavigating = false;
        let navigationTimeout = null;

        function getCardsPerPage() {
            if (window.innerWidth <= 639) return 1;
            if (window.innerWidth <= 1023) return 2;
            return 4;
        }

        function getTotalPages() {
            return Math.ceil(caseStudies.length / getCardsPerPage());
        }

        function updateNavigation() {
            const totalPages = getTotalPages();
            pageCounter.textContent = `${currentPage + 1} / ${totalPages}`;
            prevButton.disabled = currentPage === 0;
            nextButton.disabled = currentPage === totalPages - 1;
        }

        function goToPage(page) {
            const totalPages = getTotalPages();
            currentPage = Math.max(0, Math.min(page, totalPages - 1));

            const firstCard = content.querySelector(".gain-drawer-card");
            if (!firstCard) return;

            const gap = parseFloat(getComputedStyle(content).gap) || 0;
            const cardWidth = firstCard.getBoundingClientRect().width;
            const targetLeft = currentPage * getCardsPerPage() * (cardWidth + gap);
            const maxScroll = Math.max(0, content.scrollWidth - content.clientWidth);

            // Ignore intermediate scroll positions while an arrow animates.
            isNavigating = Math.abs(
                content.scrollLeft - Math.min(targetLeft, maxScroll)
            ) > 1;

            content.scrollTo({
                left: targetLeft,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "auto"
                    : "smooth"
            });

            clearTimeout(navigationTimeout);
            if (isNavigating) {
                // Fallback for browsers where scrollend is unavailable.
                navigationTimeout = setTimeout(() => {
                    isNavigating = false;
                }, 1000);
            }
            updateNavigation();
        }

        prevButton.addEventListener("click", () => {
            hideTooltip();
            goToPage(currentPage - 1);
        });
        nextButton.addEventListener("click", () => {
            hideTooltip();
            goToPage(currentPage + 1);
        });

        // Native scrolling/swiping also updates the page counter.
        content.addEventListener("scroll", () => {
            if (isNavigating) return;

            const firstCard = content.querySelector(".gain-drawer-card");
            if (!firstCard) return;

            const gap = parseFloat(getComputedStyle(content).gap) || 0;
            const pageWidth = getCardsPerPage() *
                (firstCard.getBoundingClientRect().width + gap);
            const maxScroll = content.scrollWidth - content.clientWidth;

            if (maxScroll > 0 && content.scrollLeft >= maxScroll - 2) {
                currentPage = getTotalPages() - 1;
            } else {
                currentPage = Math.max(0, Math.min(
                    Math.round(content.scrollLeft / pageWidth),
                    getTotalPages() - 1
                ));
            }
            updateNavigation();
        }, { passive: true });

        content.addEventListener("scrollend", () => {
            clearTimeout(navigationTimeout);
            isNavigating = false;
        });
        content.addEventListener("scroll", hideTooltip, { passive: true });

        // Mouse dragging; touch uses the browser's native swipe behaviour.
        let startX = 0;
        let startScrollLeft = 0;
        let isPointerDown = false;
        let isDragging = false;
        let wasDragged = false;

        content.addEventListener("pointerdown", event => {
            isNavigating = false;
            if (event.pointerType !== "mouse" || event.button !== 0) return;

            isPointerDown = true;
            isDragging = false;
            wasDragged = false;
            startX = event.clientX;
            startScrollLeft = content.scrollLeft;
        });

        content.addEventListener("wheel", () => {
            isNavigating = false;
        }, { passive: true });

        content.addEventListener("pointermove", event => {
            if (!isPointerDown) return;
            const distance = event.clientX - startX;

            if (!isDragging && Math.abs(distance) > 5) {
                isDragging = true;
                wasDragged = true;
                content.classList.add("is-dragging");
                content.setPointerCapture(event.pointerId);
            }
            if (isDragging) content.scrollLeft = startScrollLeft - distance;
        });

        function stopDragging() {
            isPointerDown = false;
            isDragging = false;
            content.classList.remove("is-dragging");
        }

        content.addEventListener("pointerup", stopDragging);
        content.addEventListener("pointercancel", stopDragging);

        // Suppress links clicked accidentally after dragging.
        content.addEventListener("click", event => {
            if (wasDragged) {
                event.preventDefault();
                event.stopPropagation();
                wasDragged = false;
            }
        }, true);

        window.addEventListener("resize", () => {
            hideTooltip();
            isNavigating = false;
            goToPage(0);
        });

        updateNavigation();
    }

    // ============================================================
    // 7. DRAWER OPEN/CLOSE AND ACCESSIBILITY
    // ============================================================
    function initDrawerControls(drawer, overlay, content, hideTooltip) {
        const toggleButtons = drawer.querySelectorAll(".gain-drawer-toggle");
        const chevronButton = drawer.querySelector(".gain-drawer-chevron");
        const navigation = drawer.querySelector(".gain-drawer-navigation");

        // Hidden content and arrow controls must not be keyboard reachable.
        content.inert = true;
        content.setAttribute("aria-hidden", "true");
        navigation.inert = true;

        function setDrawerOpen(isOpen) {
            if (!isOpen) hideTooltip();

            drawer.classList.toggle("is-open", isOpen);
            overlay.classList.toggle("is-visible", isOpen);
            toggleButtons.forEach(button => {
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

        toggleButtons.forEach(button => {
            button.addEventListener("click", () => {
                setDrawerOpen(!drawer.classList.contains("is-open"));
            });
        });
        overlay.addEventListener("click", () => setDrawerOpen(false));

        // Close automatically when the user scrolls to the page bottom.
        window.addEventListener("scroll", () => {
            const isAtBottom =
                window.scrollY + window.innerHeight >=
                document.documentElement.scrollHeight - 5;

            if (isAtBottom && drawer.classList.contains("is-open")) {
                setDrawerOpen(false);
            }
        }, { passive: true });
    }

    // ============================================================
    // 8. INITIALIZATION / MUTATION OBSERVER
    // ============================================================
    function initDrawer() {
        if (document.querySelector(`#${DRAWER_ID}`)) return;

        const caseStudies = readCaseStudies();
        const { drawer, overlay, content } = createDrawerShell();
        const { hideTooltip, bindTooltip } = createTooltipController(drawer);

        renderCaseStudies(drawer, content, caseStudies, bindTooltip);
        initCarousel(drawer, content, caseStudies, hideTooltip);
        initDrawerControls(drawer, overlay, content, hideTooltip);
    }

    function tryInit() {
        if (initialized || document.querySelector(`#${DRAWER_ID}`)) {
            readyObserver?.disconnect();
            return;
        }
        if (!sourcesReady()) return;

        initialized = true;
        readyObserver?.disconnect();
        readyObserver = null;
        initDrawer();
    }

    // Begin checking after DOMContentLoaded so the Work slider isn't
    // read while the homepage is only partially parsed. A script run at
    // document-start still registers this listener safely.
    function watchForSources() {
        tryInit();
        if (initialized || document.querySelector(`#${DRAWER_ID}`)) return;

        // Coalesce frequent DOM changes into one readiness check per frame.
        let checkScheduled = false;
        readyObserver = new MutationObserver(() => {
            if (checkScheduled) return;
            checkScheduled = true;

            requestAnimationFrame(() => {
                checkScheduled = false;
                tryInit();
            });
        });
        readyObserver.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    function start() {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", watchForSources, {
                once: true
            });
        } else {
            watchForSources();
        }
    }

    start();
})();
