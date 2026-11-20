
(() => {
    let initialized = false;
    let observer = null;
    let requestId = 0;
    let selectedType = "";
    const pageCache = new Map();

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

    // Reveal pagination after the initial Pokémon page finishes loading
    function revealPagination() {
        document.querySelector("#archive-listing")
            ?.classList.add("gain-pokemon-loaded");
    }

    // Filter Pokémon cards by the selected type
    function applyTypeFilter(container) {
        if (container.getAttribute("aria-busy") === "true") return;

        const cards = container.querySelectorAll(".gain-pokemon-card");
        let visibleCount = 0;

        cards.forEach(card => {
            const types = Array.from(
                card.querySelectorAll(".gain-pokemon-types span"),
                span => span.textContent.trim().toLowerCase()
            );

            const matches = !selectedType || types.includes(selectedType);

            card.hidden = !matches;

            if (matches) visibleCount++;
        });

        container.querySelector(".gain-pokemon-empty")?.remove();

        if (visibleCount === 0) {
            const message = document.createElement("p");
            message.className = "gain-pokemon-empty";
            message.textContent = "No Pokémon of this type on this page.";

            container.append(message);
        }
    }

    // Render Pokémon in our own container, outside React
    async function renderPokemon(container) {
        const page = getCurrentPage();
        const currentRequest = ++requestId;
        const cachedPokemon = pageCache.get(page);

        // Skip loading skeletons when revisiting a cached page
        if (!cachedPokemon) {
            showLoading(container);
        } else {
            container.setAttribute("aria-busy", "true");
        }

        try {
            const pokemon = cachedPokemon || await fetchPagePokemon(page);

            // Cache successfully fetched Pokémon for this page
            if (!cachedPokemon) {
                pageCache.set(page, pokemon);
            }

            // Ignore old responses if the user changes pages quickly
            if (currentRequest !== requestId) return;

            container.innerHTML = pokemon.map(p => {
                const name =
                    p.name.charAt(0).toUpperCase() + p.name.slice(1);

                const image =
                    p.sprites.other["official-artwork"].front_default;

                const abilities = p.abilities.map(ability =>
                    ability.ability.name.replace(/-/g, " ")
                ).join(", ");

                return `
                    <article
                        class="gain-pokemon-card"
                        role="button"
                        tabindex="0"
                        aria-label="Show details for ${name}"
                        aria-pressed="false"
                    >
                        <div class="gain-pokemon-card-inner">

                            <div class="gain-pokemon-card-face gain-pokemon-card-front">
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
                            </div>

                            <div
                                class="gain-pokemon-card-face gain-pokemon-card-back"
                                aria-hidden="true"
                            >
                                <h2>${name}</h2>

                                <p><strong>Pokédex:</strong> #${p.id}</p>
                                <p><strong>Height:</strong> ${p.height / 10} m</p>
                                <p><strong>Weight:</strong> ${p.weight / 10} kg</p>
                                <p><strong>Abilities:</strong> ${abilities}</p>
                            </div>

                        </div>
                    </article>
                `;
            }).join("");

            container.setAttribute("aria-busy", "false");
            applyTypeFilter(container);
            revealPagination();

            console.log(`Rendered Pokémon for page ${page}`);
        } catch (error) {
            if (currentRequest !== requestId) return;

            console.error(error);
            container.textContent = "Could not load Pokémon. Please try again.";
            container.setAttribute("aria-busy", "false");
            revealPagination();
        }
    }

    // Flip a Pokémon card between its front and back
    function flipCard(card) {
        const flipped = card.classList.toggle("is-flipped");
        const name = card.querySelector("h2").textContent.trim();

        card.setAttribute("aria-pressed", String(flipped));
        card.setAttribute(
            "aria-label",
            flipped ? `Show front of ${name}` : `Show details for ${name}`
        );

        card.querySelector(".gain-pokemon-card-front")
            .setAttribute("aria-hidden", String(flipped));

        card.querySelector(".gain-pokemon-card-back")
            .setAttribute("aria-hidden", String(!flipped));
    }

    // Handle card clicks and keyboard interaction
    function initCardFlipping(container) {
        container.addEventListener("click", event => {
            const card = event.target.closest(
                ".gain-pokemon-card:not(.gain-pokemon-card--loading)"
            );

            if (!card || !container.contains(card)) return;

            flipCard(card);
        });

        container.addEventListener("keydown", event => {
            if (event.key !== "Enter" && event.key !== " ") return;

            const card = event.target.closest(
                ".gain-pokemon-card:not(.gain-pokemon-card--loading)"
            );

            if (!card || !container.contains(card)) return;

            event.preventDefault();
            flipCard(card);
        });
    }

    // Inject CSS immediately to hide original articles before they render
    function injectStyles() {
        if (document.querySelector("#gain-pokemon-styles")) return;

        const style = document.createElement("style");
        style.id = "gain-pokemon-styles";

        style.textContent = `
            /* Hide original articles before and after React initializes */
            #archive-listing ul.list-reset.grid {
                display: none !important;
            }

            /* Hide incomplete pagination during initial loading */
            #archive-listing:not(.gain-pokemon-loaded) nav.m-y-40 {
                visibility: hidden;
            }

            /*
             * Hide the original Tags and Capability filters.
             * Our Pokémon type dropdown replaces Capability.
             */
            .listing-filters select[name="post_tag"],
            .listing-filters select[name="capability"] {
                display: none !important;
            }

            /* Pokémon grid using Flexbox */
            #gain-pokemon-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 24px;
                width: 100%;
                box-sizing: border-box;
            }

            /* Pokémon cards */
            #gain-pokemon-grid .gain-pokemon-card {
                position: relative;
                display: flex;
                flex-direction: column;
                flex: 0 0 calc((100% - 48px) / 3);
                min-width: 0;
                height: 360px;
                box-sizing: border-box;
                border: 1px solid #ddd;
                border-radius: 12px;
                background: white;
                perspective: 1000px;
                cursor: pointer;
            }

            #gain-pokemon-grid .gain-pokemon-card[hidden] {
                display: none !important;
            }

            #gain-pokemon-grid .gain-pokemon-card:focus-visible {
                outline: 3px solid #2b46b7;
                outline-offset: 3px;
            }

            /* 3D flip animation */
            #gain-pokemon-grid .gain-pokemon-card-inner {
                position: relative;
                width: 100%;
                height: 100%;
                transform-style: preserve-3d;
                transition: transform 500ms ease;
            }

            #gain-pokemon-grid .gain-pokemon-card.is-flipped .gain-pokemon-card-inner {
                transform: rotateY(180deg);
            }

            /* Front and back of card */
            #gain-pokemon-grid .gain-pokemon-card-face {
                position: absolute;
                inset: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px;
                box-sizing: border-box;
                text-align: center;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
            }

            #gain-pokemon-grid .gain-pokemon-card-back {
                justify-content: center;
                gap: 12px;
                transform: rotateY(180deg);
                overflow-y: auto;
            }

            #gain-pokemon-grid .gain-pokemon-card-back p {
                margin: 0;
                font-size: 16px;
                line-height: 1.4;
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

            /* No-results message */
            #gain-pokemon-grid .gain-pokemon-empty {
                flex-basis: 100%;
                margin: 24px 0;
                text-align: center;
                font-size: 18px;
                color: #555;
            }

            /* Loading skeleton cards */
            #gain-pokemon-grid .gain-pokemon-card--loading {
                justify-content: center;
                align-items: center;
                gap: 16px;
                padding: 20px;
                cursor: default;
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

            /* Accessibility: respect reduced-motion preferences */
            @media (prefers-reduced-motion: reduce) {
                #gain-pokemon-grid .gain-pokemon-card-inner {
                    transition: none;
                }
            }
        `;

        // document.head may not exist yet at document-start
        (document.head || document.documentElement).append(style);
    }

    // Insert the Pokémon type dropdown only when GAIN's filter row is ready
    function initTypeFilter() {
        const pokemonContainer = document.querySelector("#gain-pokemon-grid");

        const dropdown = document.querySelector(
            ".listing-filters .filter-dropdown"
        );

        const capability = dropdown?.querySelector(
            'select[name="capability"]'
        );

        // Wait until the original Capability dropdown exists
        if (!pokemonContainer || !capability) return;

        const existingSelect = document.querySelector("#gain-pokemon-type");

        // If React moved or replaced its filter row, keep ours in place
        if (existingSelect) {
            if (
                existingSelect.parentElement !== dropdown ||
                existingSelect.previousElementSibling !== capability
            ) {
                capability.after(existingSelect);
            }

            existingSelect.value = selectedType;
            return;
        }

        const types = [
            "normal", "fire", "water", "electric", "grass", "ice",
            "fighting", "poison", "ground", "flying", "psychic",
            "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
        ];

        const select = document.createElement("select");
        select.id = "gain-pokemon-type";
        select.setAttribute("aria-label", "Filter Pokémon by type");

        select.innerHTML = `
            <option value="">Filter by type</option>
            ${types.map(type => `
                <option value="${type}">
                    ${type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
            `).join("")}
        `;

        select.value = selectedType;

        // Match GAIN's original dropdown styling and position
        capability.after(select);

        select.addEventListener("change", () => {
            selectedType = select.value;
            applyTypeFilter(pokemonContainer);
        });
    }

    // Wait for React's article grid to exist
    function initPokemon() {
        if (initialized || document.querySelector("#gain-pokemon-grid")) return;

        const reactGrid = document.querySelector(
            "#archive-listing ul.list-reset.grid.react"
        );

        const filters = document.querySelector(".listing-filters");

        if (!reactGrid || !filters) return;

        // Create our own container outside React's managed DOM
        const reactContainer = reactGrid.parentElement;

        const pokemonContainer = document.createElement("div");
        pokemonContainer.id = "gain-pokemon-grid";
        pokemonContainer.setAttribute("aria-label", "Pokémon");

        reactContainer.before(pokemonContainer);

        initialized = true;

        // Set up card interactions independently of React's DOM
        initCardFlipping(pokemonContainer);

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

        // Render Pokémon and skeleton cards during loading
        renderPokemon(pokemonContainer);
    }

    // Initialize Pokémon and independently check the filter's readiness
    function checkReady() {
        initPokemon();
        initTypeFilter();
    }

    function start() {
        // At document-start, even the <html> element might not exist yet
        if (!document.documentElement) {
            const bootstrapObserver = new MutationObserver(() => {
                if (!document.documentElement) return;

                bootstrapObserver.disconnect();
                start();
            });

            bootstrapObserver.observe(document, {
                childList: true
            });

            return;
        }

        // Hide original articles immediately, before waiting for DOM readiness
        injectStyles();
        checkReady();

        // Keep watching in case React creates or replaces the filter row
        observer = new MutationObserver(checkReady);

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // Initialize immediately instead of waiting for DOMContentLoaded
    start();
})();
