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

    // Toggle drawer visibility
    const tab = drawer.querySelector(".gain-drawer-tab");
    const content = drawer.querySelector("#gain-drawer-content");

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
            z-index: 1000;
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

        /* Drawer content: placeholder for the case-study slider */
        #gain-drawer-content {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 280px;
            box-sizing: border-box;
            background: #fff;
            border-top: 1px solid #ddd;
            pointer-events: auto;
        }
        Inside your existing style.textContent template literal, add:
        /* Background overlay behind the drawer */
        #gain-drawer-overlay {
            position: fixed;
            inset: 0;
            z-index: 999;
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
    `;

    document.head.append(style);
})();