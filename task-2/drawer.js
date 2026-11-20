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

        <div id="gain-drawer-content" hidden></div>
    `;

    document.body.append(drawer);

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
        }

        /* Collapsed drawer tab */
        #gain-footer-drawer .gain-drawer-tab {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 14px 24px;
            background: #fff;
            color: #222;
            border: 1px solid #ddd;
            border-radius: 12px 12px 0 0;
            font: inherit;
            font-weight: 600;
            cursor: pointer;
            pointer-events: auto;
        }
    `;

    document.head.append(style);
})();