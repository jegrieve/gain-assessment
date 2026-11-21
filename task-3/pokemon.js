
(() => {
    // Prevent duplicate initialization and observers
    if (window.__gainPokemonInitialized) return;
    window.__gainPokemonInitialized = true;
    // ============================================================
    // 1. STATE AND CONFIGURATION
    // ============================================================
    // Everything is scoped to this IIFE so it can be pasted into DevTools.
    const PAGE_SIZE = 12;
    const POKEMON_TYPES = [
        "normal", "fire", "water", "electric", "grass", "ice",
        "fighting", "poison", "ground", "flying", "psychic",
        "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
    ];

    const pageCache = new Map();
    let initialized = false;
    let observer = null;
    let requestId = 0;
    let selectedType = "";

    // ============================================================
    // 2. UTILITIES AND API
    // ============================================================
    // Escape values returned by PokeAPI before inserting them into HTML.
    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function getCurrentPage() {
        const match = location.pathname.match(/\/blog\/page\/(\d+)\/?/);
        return match ? Number(match[1]) : 1;
    }

    // One request per Pokémon; cards 1–12 are on page 1, 13–24 on page 2, etc.
    async function fetchPagePokemon(page) {
        const ids = Array.from(
            { length: PAGE_SIZE },
            (_, index) => (page - 1) * PAGE_SIZE + index + 1
        );

        return Promise.all(ids.map(async id => {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch Pokémon #${id}`);
            }

            return response.json();
        }));
    }

    // ============================================================
    // 3. HTML TEMPLATES
    // ============================================================
    // Kept separate from renderPokemon() so the rendering flow is easy to follow.
    function getPokemonCardHtml(pokemon) {
        const name = escapeHtml(
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
        );
        const image = escapeHtml(
            pokemon.sprites.other["official-artwork"].front_default
        );
        const abilities = escapeHtml(
            pokemon.abilities.map(ability =>
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
                            ${pokemon.types.map(type => `
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
                            #${escapeHtml(pokemon.id)}
                        </p>
                        <p>
                            <strong>Height:</strong>
                            ${pokemon.height / 10} m
                        </p>
                        <p>
                            <strong>Weight:</strong>
                            ${pokemon.weight / 10} kg
                        </p>
                        <p>
                            <strong>Abilities:</strong>
                            ${abilities}
                        </p>
                    </div>
                </div>
            </article>
        `;
    }

    // ============================================================
    // 4. PAGE RENDERING AND FILTERING
    // ============================================================
    function showLoading(container) {
        container.setAttribute("aria-busy", "true");

        container.innerHTML = Array.from({ length: PAGE_SIZE }, () => `
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

    function revealPagination() {
        document.querySelector("#archive-listing")
            ?.classList.add("gain-pokemon-loaded");
    }

    // Filter only the Pokémon on the currently rendered page.
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

    // Main flow: load (or reuse cached data), render cards, then filter.
    async function renderPokemon(container) {
        const page = getCurrentPage();
        const currentRequest = ++requestId;
        const cachedPokemon = pageCache.get(page);

        if (!cachedPokemon) {
            showLoading(container);
        } else {
            container.setAttribute("aria-busy", "true");
        }

        try {
            const pokemon = cachedPokemon || await fetchPagePokemon(page);

            if (!cachedPokemon) {
                pageCache.set(page, pokemon);
            }

            // Don't let a slow response from an older page replace the new page.
            if (currentRequest !== requestId) return;

            container.innerHTML = pokemon.map(getPokemonCardHtml).join("");
            container.setAttribute("aria-busy", "false");
            applyTypeFilter(container);
            revealPagination();
        } catch (error) {
            if (currentRequest !== requestId) return;

            console.error(error);
            container.innerHTML = `
                <div class="gain-pokemon-empty" role="alert">
                    Could not load Pokémon. Please try again.
                </div>
            `;
            container.setAttribute("aria-busy", "false");
            revealPagination();
        }
    }

    // ============================================================
    // 5. CARD INTERACTION
    // ============================================================
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

    // Event delegation lets newly rendered cards work after pagination/filtering.
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

    // ============================================================
    // 6. TYPE DROPDOWN
    // ============================================================
    function initTypeFilter() {
        const pokemonContainer = document.querySelector("#gain-pokemon-grid");
        const dropdown = document.querySelector(".listing-filters .filter-dropdown");
        const capability = dropdown?.querySelector('select[name="capability"]');

        // The original filter may not exist yet during React initialization.
        if (!pokemonContainer || !capability) return;

        dropdown.classList.add("gain-pokemon-filter-wrap");
        const existingSelect = document.querySelector("#gain-pokemon-type");

        // Keep our select attached if React replaces or moves its filter row.
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

        // Clone the original select to inherit GAIN's visual styling.
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
            ${POKEMON_TYPES.map(type => `
                <option value="${type}">
                    ${type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
            `).join("")}
        `;
        select.value = selectedType;
        capability.after(select);

        select.addEventListener("change", () => {
            selectedType = select.value;
            applyTypeFilter(pokemonContainer);
        });
    }

    // ============================================================
    // 7. INLINE STYLES (left here until CSS is extracted later)
    // ============================================================
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

    // ============================================================
    // 8. REACT/SPA INTEGRATION
    // ============================================================
    function initPokemon() {
        // Inserting a second grid would duplicate the UI on repeated execution.
        if (initialized || document.querySelector("#gain-pokemon-grid")) return;

        const reactGrid = document.querySelector(
            "#archive-listing ul.list-reset.grid.react"
        );
        const filters = document.querySelector(".listing-filters");
        if (!reactGrid || !filters) return;

        // Place our grid outside React's managed DOM so React won't remove it.
        const reactContainer = reactGrid.parentElement;
        const pokemonContainer = document.createElement("div");
        pokemonContainer.id = "gain-pokemon-grid";
        pokemonContainer.setAttribute("aria-label", "Pokémon");
        reactContainer.before(pokemonContainer);
        initialized = true;

        initCardFlipping(pokemonContainer);

        // Watch the React-controlled article area for SPA URL changes.
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

        renderPokemon(pokemonContainer);
    }

    function checkReady() {
        initPokemon();
        initTypeFilter();
    }

    // ============================================================
    // 9. BOOTSTRAP
    // ============================================================
    function start() {
        // At document-start even <html> might not exist yet.
        if (!document.documentElement) {
            const bootstrapObserver = new MutationObserver(() => {
                if (!document.documentElement) return;
                bootstrapObserver.disconnect();
                start();
            });
            bootstrapObserver.observe(document, { childList: true });
            return;
        }

        // Hide original articles as early as possible.
        injectStyles();
        checkReady();

        // Recheck at most once per frame as React builds its DOM.
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

    start();
})();
