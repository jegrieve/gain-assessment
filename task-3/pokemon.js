
(() => {
    let initialized = false;
    let observer = null;
    let requestId = 0;
    let selectedType = "";
    const pageCache = new Map();

    // Escape API-derived values before inserting them into HTML
    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

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
            <article
                class="gain-pokemon-card gain-pokemon-card--loading"
                aria-hidden="true"
            >
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
                card.querySelectorAll(".gain-pokemon-types li"),
                item => item.textContent.trim().toLowerCase()
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
                const name = escapeHtml(
                    p.name.charAt(0).toUpperCase() + p.name.slice(1)
                );

                const image = escapeHtml(
                    p.sprites.other["official-artwork"].front_default
                );

                const abilities = escapeHtml(
                    p.abilities.map(ability =>
                        ability.ability.name.replace(/-/g, " ")
                    ).join(", ")
                );

                return `
                    <article
                        class="gain-pokemon-card listing-box"
                        role="button"
                        tabindex="0"
                        aria-label="Show details for ${name}"
                        aria-pressed="false"
                    >
                        <div class="gain-pokemon-card-inner">

                            <div class="gain-pokemon-card-face gain-pokemon-card-front">

                                <div class="listing-box__media listing-box__media--post gain-pokemon-media">
                                    <img
                                        class="listing-box__image"
                                        src="${image}"
                                        alt="${name}"
                                        loading="lazy"
                                    />
                                </div>

                                <h2 class="listing-box__title has-inter-tight-font-family has-body-xl-font-size">
                                    ${name}
                                </h2>

                                <ul class="content-tags gain-pokemon-types">
                                    ${p.types.map(type => `
                                        <li data-type="${escapeHtml(type.type.name)}">
                                            ${escapeHtml(type.type.name)}
                                        </li>
                                    `).join("")}
                                </ul>

                            </div>

                            <div
                                class="gain-pokemon-card-face gain-pokemon-card-back"
                                aria-hidden="true"
                            >
                                <h2>${name}</h2>

                                <p>
                                    <strong>Pokédex:</strong>
                                    #${escapeHtml(p.id)}
                                </p>

                                <p>
                                    <strong>Height:</strong>
                                    ${p.height / 10} m
                                </p>

                                <p>
                                    <strong>Weight:</strong>
                                    ${p.weight / 10} kg
                                </p>

                                <p>
                                    <strong>Abilities:</strong>
                                    ${abilities}
                                </p>
                            </div>

                        </div>
                    </article>
                `;
            }).join("");

            container.setAttribute("aria-busy", "false");
            applyTypeFilter(container);
            revealPagination();

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

            /* Match GAIN's original 12-column article grid */
            #gain-pokemon-grid {
                display: grid;
                grid-template-columns: repeat(12, minmax(0, 1fr));
                gap: 1rem;
                width: 100%;
                box-sizing: border-box;
            }

            /*
             * Match GAIN's article cards.
             * Height now grows naturally with content.
             */
            #gain-pokemon-grid .gain-pokemon-card {
                position: relative;
                grid-column: span 4;
                display: flex;
                flex-direction: column;
                min-width: 0;
                aspect-ratio: auto;
                height: auto;
                box-sizing: border-box;
                padding: var(--wp--preset--spacing--16, 1rem);
                border: 1px solid var(--wp--custom--color--grey-light, #e3e3e5);
                border-radius: 0;
                background: var(--wp--preset--color--white, #fff);
                perspective: 1000px;
                cursor: pointer;

                /*
                 * Clip the rotating faces inside the card.
                 * Prevents white surfaces crossing the outer border.
                 */
                overflow: clip;

                /*
                 * GAIN's original card hover movement is disabled.
                 */
                transform: none !important;
                transition: border-color 200ms ease-in;
            }

            #gain-pokemon-grid .gain-pokemon-card[hidden] {
                display: none !important;
            }

            #gain-pokemon-grid .gain-pokemon-card:focus-visible {
                outline: 3px solid var(--wp--preset--color--not-black, #001400);
                outline-offset: 3px;
            }

            /*
             * Use CSS Grid to overlap the two faces while allowing
             * their contents to determine the card's height.
             */
            #gain-pokemon-grid .gain-pokemon-card-inner {
                position: relative;
                display: grid;
                grid-template-columns: minmax(0, 1fr);
                flex: 1 0 auto;
                min-width: 0;
                width: 100%;
                transform-style: preserve-3d;
                transition: transform 500ms ease;
            }

            #gain-pokemon-grid .gain-pokemon-card.is-flipped .gain-pokemon-card-inner {
                transform: rotateY(180deg);
            }

            /*
             * Both faces occupy the same grid cell and
             * contribute to natural card height.
             */
            #gain-pokemon-grid .gain-pokemon-card-face {
                position: relative;
                grid-area: 1 / 1;
                display: flex;
                flex-direction: column;
                min-width: 0;
                box-sizing: border-box;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
            }

            /* Original article-style front */
            #gain-pokemon-grid .gain-pokemon-card-front {
                gap: var(--wp--preset--spacing--24, 1.5rem);
            }

            /* White 4:3 Pokémon artwork */
            #gain-pokemon-grid .gain-pokemon-media {
                position: relative;
                width: 100%;
                aspect-ratio: 4 / 3;
                flex-shrink: 0;
                overflow: hidden;
                background: #fff !important;
            }

            #gain-pokemon-grid .gain-pokemon-media .listing-box__image {
                width: 100%;
                height: 100%;
                object-fit: contain;
                padding: 12px;
                box-sizing: border-box;
                background: #fff;
            }

            /* GAIN's article heading typography */
            #gain-pokemon-grid .gain-pokemon-card .listing-box__title {
                width: 75%;
                margin: 0;
                font-family: var(--wp--preset--font-family--inter-tight, sans-serif);
                font-size: var(--wp--preset--font-size--body-xl, 1.5rem);
                font-weight: 400;
                line-height: 1.2;
                letter-spacing: -0.017857em;
                overflow-wrap: anywhere;
            }

            /*
             * Bottom-right content tags.
             * Multiple rows are allowed on narrow screens.
             */
            #gain-pokemon-grid .gain-pokemon-types {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: flex-end;
                width: 100%;
                min-width: 0;
                margin: auto 0 0;
                padding: 0;
                list-style: none;
            }

            #gain-pokemon-grid .gain-pokemon-types li {
                flex-shrink: 0;
                max-width: 100%;
                text-transform: capitalize;
            }

            /*
             * Clean centred back face.
             * It shares the card's naturally calculated height.
             */
            #gain-pokemon-grid .gain-pokemon-card-back {
                justify-content: center;
                align-items: center;
                gap: 12px;
                padding: 20px;
                text-align: center;
                background: #fff;
                color: var(--wp--preset--color--not-black, #001400);
                transform: rotateY(180deg);
            }

            #gain-pokemon-grid .gain-pokemon-card-back h2 {
                margin: 0 0 4px;
                max-width: 100%;
                font-family: var(--wp--preset--font-family--inter-tight, sans-serif);
                font-size: var(--wp--preset--font-size--body-xl, 1.5rem);
                font-weight: 400;
                line-height: 1.2;
                letter-spacing: -0.017857em;
                overflow-wrap: anywhere;
            }

            #gain-pokemon-grid .gain-pokemon-card-back p {
                margin: 0;
                max-width: 100%;
                font-size: 16px;
                line-height: 1.4;
                overflow-wrap: anywhere;
            }

            #gain-pokemon-grid .gain-pokemon-card-back strong {
                font-weight: 600;
            }

            /* No-results message */
            #gain-pokemon-grid .gain-pokemon-empty {
                grid-column: 1 / -1;
                margin: 24px 0;
                text-align: center;
                font-size: 18px;
                color: #555;
            }

            /* Loading skeletons */
            #gain-pokemon-grid .gain-pokemon-card--loading {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: stretch;
                gap: 24px;
                cursor: default;
            }

            #gain-pokemon-grid .gain-pokemon-image-placeholder {
                width: 100%;
                aspect-ratio: 4 / 3;
                flex-shrink: 0;
                background: #f0f0f0;
            }

            #gain-pokemon-grid .gain-pokemon-title-placeholder {
                width: 60%;
                height: 28px;
                border-radius: 4px;
                background: #f0f0f0;
            }

            #gain-pokemon-grid .gain-pokemon-tag-placeholder {
                width: 40%;
                height: 28px;
                margin: auto 0 0 auto;
                background: #f0f0f0;
            }

            /* Match GAIN's responsive article columns */
            @media (max-width: 767px) {
                #gain-pokemon-grid .gain-pokemon-card {
                    grid-column: span 6;
                }
            }

            @media (max-width: 639px) {
                #gain-pokemon-grid .gain-pokemon-card {
                    grid-column: span 12;
                }
            }

            @media (max-width: 380px) {
                #gain-pokemon-grid .gain-pokemon-card-back {
                    padding: 16px;
                    gap: 10px;
                }

                #gain-pokemon-grid .gain-pokemon-card-back p {
                    font-size: 14px;
                }
            }

            /* Subtle card appearance animation */
            #gain-pokemon-grid .gain-pokemon-card:not(.gain-pokemon-card--loading) {
                animation: gain-pokemon-appear 220ms ease-out both;
            }

            @keyframes gain-pokemon-appear {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            /*
             * Stronger border without resizing the card.
             * The inset shadow adds visual weight inside the 1px border.
             */
            @media (hover: hover) {
                #gain-pokemon-grid .gain-pokemon-card:not(.gain-pokemon-card--loading):hover {
                    border-color: var(--wp--preset--color--not-black, #001400);
                    box-shadow: inset 0 0 0 1px var(--wp--preset--color--not-black, #001400);
                    transform: none !important;
                }
            }

            /* Loading skeleton shimmer */
            #gain-pokemon-grid .gain-pokemon-card--loading > div {
                background: linear-gradient(
                    90deg,
                    #edf0f4 25%,
                    #e0e6ee 50%,
                    #edf0f4 75%
                );
                background-size: 200% 100%;
                animation: gain-pokemon-shimmer 1.4s linear infinite;
            }

            @keyframes gain-pokemon-shimmer {
                to { background-position: -200% 0; }
            }

            /* Accessibility: respect reduced-motion preferences */
            @media (prefers-reduced-motion: reduce) {
                #gain-pokemon-grid .gain-pokemon-card-inner,
                #gain-pokemon-grid .gain-pokemon-card {
                    transition: none !important;
                    animation: none !important;
                }

                #gain-pokemon-grid .gain-pokemon-card--loading > div {
                    animation: none !important;
                }
            }

            /* Keep the card's existing dimensions */
            #gain-pokemon-grid .gain-pokemon-card {
                border-color: transparent;
                box-shadow: none !important;
                isolation: isolate;
            }

            /* Draw the 1px border above the rotating faces */
            #gain-pokemon-grid .gain-pokemon-card::after {
                content: "";
                position: absolute;
                inset: 0;
                z-index: 10;
                pointer-events: none;
                border: 1px solid var(--wp--custom--color--grey-light, #e3e3e5);
                transition: none;
            }

            /* Hover: darker border only, no added thickness or movement */
            @media (hover: hover) {
                #gain-pokemon-grid .gain-pokemon-card:not(.gain-pokemon-card--loading):hover {
                    border-color: transparent;
                    box-shadow: none !important;
                    transform: none !important;
                }

                #gain-pokemon-grid .gain-pokemon-card:not(.gain-pokemon-card--loading):hover::after {
                    border-color: var(--wp--preset--color--not-black, #001400);
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

        dropdown.classList.add("gain-pokemon-filter-wrap");

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

        // Clone GAIN's Capability dropdown for identical styling
        const select = capability.cloneNode(false);

        select.removeAttribute("name");
        select.removeAttribute("id");
        select.removeAttribute("disabled");
        select.removeAttribute("required");
        select.style.removeProperty("display");

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

        // Coalesce frequent React DOM updates into one check per frame
        let readyScheduled = false;

        const scheduleCheckReady = () => {
            if (readyScheduled) return;

            readyScheduled = true;

            requestAnimationFrame(() => {
                readyScheduled = false;
                checkReady();
            });
        };

        observer = new MutationObserver(scheduleCheckReady);

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // Initialize immediately instead of waiting for DOMContentLoaded
    start();
})();
