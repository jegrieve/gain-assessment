
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
    // 7. REACT/SPA INTEGRATION
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
    // 8. BOOTSTRAP
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

        // Initialize when the required DOM elements are available.
        // The separate stylesheet handles hiding original articles.
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
