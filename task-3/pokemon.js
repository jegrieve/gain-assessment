
(() => {
    let initialized = false;
    let observer = null;
    let requestId = 0;

    // Get the current page number from the URL
    function getCurrentPage() {
        const match = location.pathname.match(/\/blog\/page\/(\d+)\/?/);
        return match ? Number(match[1]) : 1;
    }

    // Fetch the 12 Pokémon for the requested page
    async function fetchPagePokemon(page) {
        const ids = Array.from(
            { length: 12 },
            (_, index) => (page - 1) * 12 + index + 1
        );

        return Promise.all(ids.map(async id => {
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${id}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch Pokémon #${id}`);
            }

            return response.json();
        }));
    }

    // Display placeholder cards while Pokémon load
    function showLoading(container) {
        container.setAttribute("aria-busy", "true");

        container.innerHTML = Array.from({ length: 12 }, () => `
            <article class="gain-pokemon-card gain-pokemon-card--loading" aria-hidden="true">
                <div class="gain-pokemon-image-placeholder"></div>
                <div class="gain-pokemon-title-placeholder"></div>
                <div class="gain-pokemon-tag-placeholder"></div>
            </article>
        `).join("");
    }

    // Render Pokémon in our own container, outside React
    async function renderPokemon(container) {
        const page = getCurrentPage();
        const currentRequest = ++requestId;

        showLoading(container);

        try {
            const pokemon = await fetchPagePokemon(page);

            // Ignore old responses if the user changes pages quickly
            if (currentRequest !== requestId) return;

            container.innerHTML = pokemon.map(p => {
                const name =
                    p.name.charAt(0).toUpperCase() + p.name.slice(1);

                const image =
                    p.sprites.other["official-artwork"].front_default;

                return `
                    <article class="gain-pokemon-card">
                        <img
                            src="${image}"
                            alt="${name}"
                            loading="lazy"
                        >

                        <h2>${name}</h2>

                        <div class="gain-pokemon-types">
                            ${p.types.map(type => `
                                <span>${type.type.name}</span>
                            `).join("")}
                        </div>
                    </article>
                `;
            }).join("");

            container.setAttribute("aria-busy", "false");

            console.log(`Rendered Pokémon for page ${page}`);
        } catch (error) {
            if (currentRequest !== requestId) return;

            console.error(error);
            container.textContent = "Could not load Pokémon. Please try again.";
            container.setAttribute("aria-busy", "false");
        }
    }

    // Inject CSS for console testing
    // TODO: Move CSS into pokemon.css before submission
    function injectStyles() {
        if (document.querySelector("#gain-pokemon-styles")) return;

        const style = document.createElement("style");
        style.id = "gain-pokemon-styles";

        style.textContent = `
            /* Hide the original React articles without modifying their DOM */
            #archive-listing ul.list-reset.grid.react {
                display: none !important;
            }

            /* Pokémon card container using Flexbox */
            #gain-pokemon-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 24px;
                width: 100%;
                box-sizing: border-box;
            }

            /* Individual Pokémon cards */
            #gain-pokemon-grid .gain-pokemon-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 0 0 calc((100% - 48px) / 3);
                min-width: 0;
                min-height: 320px;
                padding: 20px;
                box-sizing: border-box;
                border: 1px solid #ddd;
                border-radius: 12px;
                background: white;
                text-align: center;
            }

            /* Pokémon artwork */
            #gain-pokemon-grid .gain-pokemon-card img {
                display: block;
                width: 100%;
                height: 200px;
                object-fit: contain;
                object-position: center;
            }

            /* Pokémon name */
            #gain-pokemon-grid .gain-pokemon-card h2 {
                margin: 16px 0;
                font-size: 24px;
                line-height: 1.3;
            }

            /* Pokémon type badges */
            #gain-pokemon-grid .gain-pokemon-types {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: auto;
            }

            #gain-pokemon-grid .gain-pokemon-types span {
                padding: 6px 12px;
                background: #eee;
                border-radius: 20px;
                font-size: 14px;
                text-transform: capitalize;
            }

            /* Loading skeleton cards */
            #gain-pokemon-grid .gain-pokemon-card--loading {
                justify-content: center;
                gap: 16px;
            }

            #gain-pokemon-grid .gain-pokemon-image-placeholder {
                width: 100%;
                height: 200px;
                border-radius: 8px;
                background: #f0f0f0;
            }

            #gain-pokemon-grid .gain-pokemon-title-placeholder {
                width: 60%;
                height: 24px;
                border-radius: 6px;
                background: #f0f0f0;
            }

            #gain-pokemon-grid .gain-pokemon-tag-placeholder {
                width: 40%;
                height: 28px;
                border-radius: 20px;
                background: #f0f0f0;
            }

            /* Tablet: two cards per row */
            @media (max-width: 1023px) {
                #gain-pokemon-grid .gain-pokemon-card {
                    flex-basis: calc((100% - 24px) / 2);
                }
            }

            /* Mobile: one card per row */
            @media (max-width: 639px) {
                #gain-pokemon-grid .gain-pokemon-card {
                    flex-basis: 100%;
                }
            }
        `;

        document.head.append(style);
    }

    // Wait for React's article grid to exist
    function initPokemon() {
        if (initialized || document.querySelector("#gain-pokemon-grid")) return;

        const reactGrid = document.querySelector(
            "#archive-listing ul.list-reset.grid.react"
        );

        if (!reactGrid) return;

        // Create our own container outside React's managed DOM
        const reactContainer = reactGrid.parentElement;

        const pokemonContainer = document.createElement("div");
        pokemonContainer.id = "gain-pokemon-grid";
        pokemonContainer.setAttribute("aria-label", "Pokémon");

        reactContainer.before(pokemonContainer);

        initialized = true;
        observer?.disconnect();
        observer = null;

        // Watch React's article area for SPA pagination changes
        let lastPath = location.pathname;

        const pageObserver = new MutationObserver(() => {
            requestAnimationFrame(() => {
                const currentPath = location.pathname;

                if (currentPath === lastPath) return;

                lastPath = currentPath;
                renderPokemon(pokemonContainer);
            });
        });

        pageObserver.observe(reactContainer, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // Render Pokémon on the initial page
        renderPokemon(pokemonContainer);
    }

    function start() {
        injectStyles();
        initPokemon();

        if (initialized) return;

        // Handle React content that loads asynchronously
        observer = new MutationObserver(initPokemon);

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
})();
