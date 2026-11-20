
(() => {
    // Prevent duplicate drawers
    if (document.querySelector("#gain-footer-drawer")) return;

    // Create the footer drawer
    const drawer = document.createElement("div");
    drawer.id = "gain-footer-drawer";

    // Chevron icon from Lucide: https://lucide.dev (ISC License)
    drawer.innerHTML = `
        <button
            class="gain-drawer-tab"
            type="button"
            aria-expanded="false"
            aria-controls="gain-drawer-content"
        >
            <span>Explore our work</span>

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

        <div id="gain-drawer-content">
            <p>Case studies will appear here.</p>
        </div>
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
    const tab = drawer.querySelector(".gain-drawer-tab");
    const content = drawer.querySelector("#gain-drawer-content");

    // Render the case studies inside the drawer
    content.replaceChildren();

    caseStudies.forEach((study) => {
        const card = document.createElement("article");
        card.className = "gain-drawer-card";

        const image = document.createElement("img");
        image.src = study.imageUrl;
        image.alt = study.title;
        image.loading = "lazy";

        const title = document.createElement("h3");
        title.textContent = study.title;

        const tag = document.createElement("span");
        tag.className = "gain-drawer-card-tag";
        tag.textContent = study.industry;

        const description = document.createElement("p");
        description.textContent = study.description;

        const link = document.createElement("a");
        link.href = study.url;
        link.textContent = "View case study";

        card.append(image, title, tag, description, link);
        content.append(card);
    });

    // Keep hidden drawer content inaccessible
    content.inert = true;
    content.setAttribute("aria-hidden", "true");

    // Update drawer and overlay visibility
    function setDrawerOpen(isOpen) {
        drawer.classList.toggle("is-open", isOpen);
        overlay.classList.toggle("is-visible", isOpen);

        tab.setAttribute("aria-expanded", String(isOpen));
        content.inert = !isOpen;
        content.setAttribute("aria-hidden", String(!isOpen));
    }

    // Toggle drawer when clicking the tab
    tab.addEventListener("click", () => {
        setDrawerOpen(!drawer.classList.contains("is-open"));
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

        /* Drawer tab */
        #gain-footer-drawer .gain-drawer-tab {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            height: 52px;
            padding: 0 24px;
            box-sizing: border-box;
            flex-shrink: 0;
            background: #fff;
            color: #222;
            border: 1px solid #ddd;
            border-radius: 12px 12px 0 0;
            font: inherit;
            font-weight: 600;
            cursor: pointer;
            pointer-events: auto;
        }

        /* Animate chevron rotation */
        #gain-footer-drawer .gain-drawer-tab svg {
            transition: transform 350ms ease;
        }

        #gain-footer-drawer.is-open .gain-drawer-tab svg {
            transform: rotate(180deg);
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
            border-top: 1px solid #ddd;
            overflow-x: auto;
            overflow-y: hidden;
            pointer-events: auto;
        }

        /* Individual case-study cards */
        #gain-footer-drawer .gain-drawer-card {
            display: flex;
            flex-direction: column;
            gap: 10px;
            flex: 0 0 260px;
            min-width: 0;
            padding: 12px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 8px;
        }

        #gain-footer-drawer .gain-drawer-card img {
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-radius: 4px;
        }

        #gain-footer-drawer .gain-drawer-card h3 {
            margin: 0;
            font-size: 16px;
            line-height: 1.3;
        }

        #gain-footer-drawer .gain-drawer-card-tag {
            align-self: flex-start;
            padding: 4px 8px;
            background: #f0f0f0;
            border-radius: 4px;
            font-size: 12px;
        }

        #gain-footer-drawer .gain-drawer-card p {
            margin: 0;
            font-size: 13px;
            line-height: 1.4;
        }

        #gain-footer-drawer .gain-drawer-card a {
            margin-top: auto;
            font-size: 14px;
            font-weight: 600;
            color: #2b46b7;
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
            transition: opacity 350ms ease, visibility 350ms ease;
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
    `;

    document.head.append(style);
})();
