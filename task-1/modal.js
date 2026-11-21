
(() => {
    // ============================================================
    // 1. SELECTORS AND INITIALIZATION STATE
    // ============================================================
    const SECTION_ID = "gain-questionnaire-section";
    const MODAL_ID = "gain-questionnaire-modal";
    const SERVICES_SELECTOR = ".site-navigation__submenu-link-title";
    const WORK_SELECTOR = ".content-slider .content-card--work";

    let initialized = false;
    let readyObserver = null;

    // ============================================================
    // 2. READ EXISTING HOMEPAGE CONTENT
    // ============================================================

    // Wait for the content needed to populate the first two questions.
    function getSectorsContainer() {
        const heading = Array.from(document.querySelectorAll("#main-content p"))
            .find(p => p.textContent.trim() === "Our Sectors");

        return heading?.closest(".wp-block-columns");
    }

    function sourcesReady() {
        if (!document.body) return false;

        const hero = document.querySelector("#main-content h1");
        const services = document.querySelectorAll(SERVICES_SELECTOR);
        const sectors = getSectorsContainer();

        return Boolean(
            hero?.parentElement &&
            services.length &&
            Array.from(services).every(service => service.textContent.trim()) &&
            sectors?.querySelector(".wp-block-button__link")
        );
    }

    function readServiceNames() {
        return Array.from(
            document.querySelectorAll(SERVICES_SELECTOR),
            service => service.textContent.trim()
        );
    }

    function readIndustryNames() {
        return Array.from(
            getSectorsContainer().querySelectorAll(".wp-block-button__link"),
            link => link.textContent.trim()
        );
    }

    // Read the Work slider when results are requested, preserving its order.
    function readCaseStudies() {
        return Array.from(document.querySelectorAll(WORK_SELECTOR), card => {
            const link = card.querySelector(".content-card__link");
            const tags = card.querySelectorAll(".content-tags li");

            return {
                title: link.textContent.trim(),
                service: tags[0].textContent.trim(),
                industry: tags[1].textContent.trim(),
                url: link.href
            };
        });
    }

    // ============================================================
    // 3. CREATE THE SECTION AND MODAL
    // ============================================================
    function createQuestionnaire() {
        const hero = document.querySelector("#main-content h1");
        if (!hero || document.getElementById(SECTION_ID)) return null;

        const section = document.createElement("section");
        section.id = SECTION_ID;
        section.innerHTML = `
            <h2>Find the right solution for <span class="gain-heading-you">you</span></h2>
            <p>Answer a few questions to discover how we can help.</p>
            <div class="gain-button-wrap">
                <button type="button"><span>Get Started</span></button>
            </div>
        `;

        hero.parentElement.after(section);

        const modal = document.createElement("dialog");
        modal.id = MODAL_ID;

        // Progress icons from Lucide (ISC License): https://lucide.dev
        modal.innerHTML = `
            <button id="gain-close" type="button" aria-label="Close questionnaire">&times;</button>

            <ol id="gain-progress" aria-label="Questionnaire progress">
                <li class="gain-progress-item">
                    <span class="gain-progress-circle">
                        <!-- Briefcase: Services -->
                        <svg width="24" height="24" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M12 12h.01"/>
                            <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                            <path d="M22 13a18.15 18.15 0 0 1-20 0"/>
                            <rect width="20" height="14" x="2" y="6" rx="2"/>
                        </svg>
                        <span class="gain-progress-check" aria-hidden="true">
                            <svg width="12" height="12" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="3"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 6 9 17l-5-5"/>
                            </svg>
                        </span>
                    </span>
                    <span class="gain-progress-label">Services</span>
                </li>

                <li class="gain-progress-item">
                    <span class="gain-progress-circle">
                        <!-- Building: Industry -->
                        <svg width="24" height="24" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M12 10h.01"/>
                            <path d="M12 14h.01"/>
                            <path d="M12 6h.01"/>
                            <path d="M16 10h.01"/>
                            <path d="M16 14h.01"/>
                            <path d="M16 6h.01"/>
                            <path d="M8 10h.01"/>
                            <path d="M8 14h.01"/>
                            <path d="M8 6h.01"/>
                            <path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
                            <rect x="4" y="2" width="16" height="20" rx="2"/>
                        </svg>
                        <span class="gain-progress-check" aria-hidden="true">
                            <svg width="12" height="12" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="3"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 6 9 17l-5-5"/>
                            </svg>
                        </span>
                    </span>
                    <span class="gain-progress-label">Industry</span>
                </li>

                <li class="gain-progress-item">
                    <span class="gain-progress-circle">
                        <!-- Book: Resources -->
                        <svg width="24" height="24" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
                        </svg>
                        <span class="gain-progress-check" aria-hidden="true">
                            <svg width="12" height="12" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="3"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 6 9 17l-5-5"/>
                            </svg>
                        </span>
                    </span>
                    <span class="gain-progress-label">Resources</span>
                </li>

                <li class="gain-progress-item">
                    <span class="gain-progress-circle">
                        <!-- Clock: Timeline -->
                        <svg width="24" height="24" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                        </svg>
                        <span class="gain-progress-check" aria-hidden="true">
                            <svg width="12" height="12" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="3"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 6 9 17l-5-5"/>
                            </svg>
                        </span>
                    </span>
                    <span class="gain-progress-label">Timeline</span>
                </li>

                <li class="gain-progress-item">
                    <span class="gain-progress-circle">
                        <!-- Flag: Results -->
                        <svg width="24" height="24" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528"/>
                        </svg>
                        <span class="gain-progress-check" aria-hidden="true">
                            <svg width="12" height="12" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="3"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 6 9 17l-5-5"/>
                            </svg>
                        </span>
                    </span>
                    <span class="gain-progress-label">Results</span>
                </li>
            </ol>

            <div id="gain-step-1">
                <h2>What do you need help with?</h2>
                <div id="gain-service-options"></div>
            </div>

            <div id="gain-step-2" hidden>
                <h2>Which industry are you in?</h2>
                <div id="gain-industry-options"></div>
            </div>

            <div id="gain-step-3" hidden>
                <h2>What would be most useful right now?</h2>
                <label><input type="radio" name="gain-resource" value="Case studies like mine"> Case studies like mine</label>
                <label><input type="radio" name="gain-resource" value="Articles to read"> Articles to read</label>
                <label><input type="radio" name="gain-resource" value="Talk to someone"> Talk to someone</label>
            </div>

            <div id="gain-step-4" hidden>
                <h2>When are you looking to start?</h2>
                <label><input type="radio" name="gain-timeline" value="Right away"> Right away</label>
                <label><input type="radio" name="gain-timeline" value="In the next 3 months"> In the next 3 months</label>
                <label><input type="radio" name="gain-timeline" value="Just exploring"> Just exploring</label>
            </div>

            <div id="gain-step-5" hidden>
                <h2 id="gain-results-heading">Your results</h2>
                <div id="gain-results-content"></div>

                <div id="gain-results-summary">
                    <h3>Your answers</h3>
                    <div class="gain-summary-scroll-area"
                         tabindex="0"
                         aria-label="Your selected services and industries">

                        <div class="gain-summary-group">
                            <div class="gain-summary-heading">
                                <strong>Services</strong>
                                <button id="gain-edit-services" type="button">Edit services</button>
                            </div>
                            <div id="gain-summary-services" class="gain-summary-chips"></div>
                        </div>

                        <div class="gain-summary-group">
                            <div class="gain-summary-heading">
                                <strong>Industries</strong>
                                <button id="gain-edit-industries" type="button">Edit industries</button>
                            </div>
                            <div id="gain-summary-industries" class="gain-summary-chips"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="gain-modal-actions">
                <button id="gain-back" type="button" hidden>Back</button>
                <button id="gain-next" type="button">Next</button>
            </div>
        `;

        document.body.append(modal);

        section.querySelector("button").addEventListener("click", () => {
            modal.showModal();
        });

        modal.querySelector("#gain-close").addEventListener("click", () => {
            modal.close();
        });

        return modal;
    }

    // ============================================================
    // 4. POPULATE QUESTION OPTIONS
    // ============================================================

    function populateCheckboxes(container, names) {
        names.forEach(name => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.value = name;

            label.append(checkbox, name);
            container.append(label);
        });
    }

    function populateQuestions(modal) {
        populateCheckboxes(
            modal.querySelector("#gain-service-options"),
            readServiceNames()
        );
        populateCheckboxes(
            modal.querySelector("#gain-industry-options"),
            readIndustryNames()
        );
    }

    // ============================================================
    // 5. BUILD RESULTS: ARTICLES, CASE STUDIES AND EMAIL
    // ============================================================

    // The Insights headings and links are taken from the existing page.
    function addArticles(content) {
        const headings = Array.from(
            document.querySelectorAll("#main-content h2, #main-content h3")
        );

        const insightsIndex = headings.findIndex(heading =>
            heading.tagName === "H2" &&
            heading.textContent.trim() === "Insights"
        );

        if (insightsIndex === -1) return;

        const articles = headings
            .slice(insightsIndex + 1)
            .filter(heading => heading.tagName === "H3")
            .slice(0, 3);

        const container = document.createElement("div");
        container.className = "gain-recommendations-container";

        const articlesHeading = document.createElement("h3");
        articlesHeading.textContent = "Recommended articles";

        const description = document.createElement("p");
        description.className = "gain-recommendations-description";
        description.textContent = "Explore some of our latest insights.";

        container.append(articlesHeading, description);

        const list = document.createElement("ul");
        list.className = "gain-recommendations-list";

        articles.forEach(heading => {
            // The link may belong to a parent of the article heading.
            let link = heading.querySelector("a[href]");
            let parent = heading.parentElement;

            while (!link && parent && parent.id !== "main-content") {
                link = parent.querySelector("a[href]");
                parent = parent.parentElement;
            }

            if (!link) return;

            const articleLink = document.createElement("a");
            articleLink.href = link.href;
            articleLink.textContent = heading.textContent.trim();

            const item = document.createElement("li");
            item.className = "gain-recommendation-card";
            item.append(articleLink);

            list.append(item);
        });

        container.append(list);
        content.append(container);
    }

    function addCaseStudies(content, selectedServices, selectedIndustries) {
        const caseStudies = readCaseStudies();

        // The homepage uses two spellings of this industry.
        function industryMatches(industry) {
            return selectedIndustries.includes(industry) ||
                (
                    industry === "Tech & Telcoms" &&
                    selectedIndustries.includes("Tech & Telco")
                );
        }

        // Both service and industry match.
        const exactMatches = caseStudies.filter(study =>
            selectedServices.includes(study.service) &&
            industryMatches(study.industry)
        );

        // Only the service matches.
        const relatedMatches = caseStudies.filter(study =>
            selectedServices.includes(study.service) &&
            !industryMatches(study.industry)
        );

        // Exact first; keep original slider order within each group.
        const recommendations = [
            ...exactMatches,
            ...relatedMatches
        ].slice(0, 3);

        const container = document.createElement("div");
        container.className = "gain-recommendations-container";

        const heading = document.createElement("h3");
        heading.textContent = "Recommended case studies";

        const description = document.createElement("p");
        description.className = "gain-recommendations-description";
        description.textContent = "Explore work relevant to your selections.";

        container.append(heading, description);
        content.append(container);

        if (recommendations.length === 0) {
            const message = document.createElement("p");
            message.textContent = "No matching case studies found. ";

            const link = document.createElement("a");
            link.href = "https://www.thisisgain.com/work/";
            link.textContent = "Browse all our work";

            message.append(link);
            container.append(message);
            return;
        }

        const list = document.createElement("ul");
        list.className = "gain-recommendations-list";

        recommendations.forEach(study => {
            const item = document.createElement("li");
            item.className = "gain-recommendation-card";

            const link = document.createElement("a");
            link.href = study.url;
            link.textContent = study.title;

            const label = document.createElement("span");
            const isExact = industryMatches(study.industry);

            label.textContent = isExact ? "Exact match" : "Related";
            label.className = isExact
                ? "gain-match-exact"
                : "gain-match-related";

            item.append(link, label);
            list.append(item);
        });

        container.append(list);
    }

    function addEmail(content) {
        const footerEmail = document.querySelector(
            'footer a[href^="mailto:"]'
        );

        if (!footerEmail) return;

        const emailLink = document.createElement("a");
        emailLink.href = footerEmail.href;
        emailLink.textContent = footerEmail
            .getAttribute("href")
            .replace("mailto:", "");

        emailLink.classList.add("gain-email-link");
        emailLink.insertAdjacentHTML("afterbegin", `
            <svg width="18" height="18" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round"
                 aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
        `);

        const emailContainer = document.createElement("div");
        emailContainer.className = "gain-email-container";

        const emailHeading = document.createElement("h3");
        emailHeading.textContent = "Email Us";

        emailContainer.append(emailHeading, emailLink);
        content.append(emailContainer);
    }

    function renderSummaryChips(modal, selector, values) {
        const container = modal.querySelector(selector);
        container.replaceChildren();

        values.forEach(value => {
            const chip = document.createElement("span");
            chip.className = "gain-summary-chip";
            chip.textContent = value;
            container.append(chip);
        });
    }

    // ============================================================
    // 6. RESULTS: CHOOSE WHAT TO SHOW BASED ON ANSWERS
    // ============================================================

    function updateResults(modal) {
        const timeline = modal.querySelector(
            'input[name="gain-timeline"]:checked'
        ).value;

        const resource = modal.querySelector(
            'input[name="gain-resource"]:checked'
        ).value;

        const heading = modal.querySelector("#gain-results-heading");
        const content = modal.querySelector("#gain-results-content");

        const selectedServices = Array.from(
            modal.querySelectorAll("#gain-step-1 input:checked"),
            input => input.value
        );

        const selectedIndustries = Array.from(
            modal.querySelectorAll("#gain-step-2 input:checked"),
            input => input.value
        );

        if (timeline === "Right away") {
            heading.textContent = "Let's talk this week";
        } else if (timeline === "In the next 3 months") {
            heading.textContent = "Here's where to start";
        } else {
            heading.textContent = "Take your time";
        }

        content.replaceChildren();

        // Show email once, at the top, when needed.
        if (timeline === "Right away" || resource === "Talk to someone") {
            addEmail(content);
        }

        if (resource === "Case studies like mine") {
            addCaseStudies(content, selectedServices, selectedIndustries);
        }

        if (
            resource === "Articles to read" ||
            (resource === "Talk to someone" && timeline === "Just exploring")
        ) {
            addArticles(content);
        }

        renderSummaryChips(
            modal,
            "#gain-summary-services",
            selectedServices
        );

        renderSummaryChips(
            modal,
            "#gain-summary-industries",
            selectedIndustries
        );
    }

    // ============================================================
    // 7. QUESTION NAVIGATION AND RESET
    // ============================================================

    function initStepNavigation(modal) {
        const steps = modal.querySelectorAll('[id^="gain-step-"]');
        const progressItems = modal.querySelectorAll(".gain-progress-item");
        const nextButton = modal.querySelector("#gain-next");
        const backButton = modal.querySelector("#gain-back");

        let currentStep = 1;

        function updateNextButtonState() {
            if (currentStep === 5) {
                nextButton.disabled = false;
                return;
            }

            const current = steps[currentStep - 1];
            nextButton.disabled = !current.querySelector("input:checked");
        }

        function showStep() {
            steps.forEach((step, index) => {
                step.hidden = index !== currentStep - 1;
            });

            backButton.hidden = currentStep === 1;
            nextButton.textContent = currentStep === 5 ? "Done" : "Next";

            progressItems.forEach((item, index) => {
                const stepNumber = index + 1;
                const isComplete = stepNumber < currentStep;
                const isActive = stepNumber === currentStep;

                item.classList.toggle("is-complete", isComplete);
                item.classList.toggle("is-active", isActive);
                item.classList.toggle("is-upcoming", stepNumber > currentStep);

                if (isActive) {
                    item.setAttribute("aria-current", "step");
                } else {
                    item.removeAttribute("aria-current");
                }
            });

            updateNextButtonState();
        }

        modal.addEventListener("change", event => {
            if (event.target.matches(
                'input[type="checkbox"], input[type="radio"]'
            )) {
                updateNextButtonState();
            }
        });

        nextButton.addEventListener("click", () => {
            if (currentStep === 5) {
                modal.close();
                return;
            }

            const current = steps[currentStep - 1];
            if (!current.querySelector("input:checked")) return;

            currentStep++;

            if (currentStep === 5) {
                updateResults(modal);
            }

            showStep();
        });

        backButton.addEventListener("click", () => {
            currentStep--;
            showStep();
        });

        modal.querySelector("#gain-edit-services").addEventListener("click", () => {
            currentStep = 1;
            showStep();
        });

        modal.querySelector("#gain-edit-industries").addEventListener("click", () => {
            currentStep = 2;
            showStep();
        });

        // Reset on Done, X, or Escape.
        modal.addEventListener("close", () => {
            modal.querySelectorAll("input").forEach(input => {
                input.checked = false;
            });

            modal.querySelector("#gain-results-content").replaceChildren();

            currentStep = 1;
            showStep();
        });

        showStep();
    }

    // ============================================================
    // 8. INITIALIZATION AND LATE-LOADED HOMEPAGE CONTENT
    // ============================================================

    function initQuestionnaire() {
        if (document.getElementById(SECTION_ID)) return;

        const modal = createQuestionnaire();
        if (!modal) return;

        populateQuestions(modal);
        initStepNavigation(modal);
    }

    function tryInit() {
        if (initialized || document.getElementById(SECTION_ID)) {
            readyObserver?.disconnect();
            readyObserver = null;
            return;
        }

        if (!sourcesReady()) return;

        // Disconnect before inserting our own nodes.
        initialized = true;
        readyObserver?.disconnect();
        readyObserver = null;

        initQuestionnaire();
    }

    function watchForSources() {
        tryInit();

        if (initialized || document.getElementById(SECTION_ID)) return;

        // Coalesce multiple DOM changes into one readiness check per frame.
        let scheduled = false;

        readyObserver = new MutationObserver(() => {
            if (scheduled) return;

            scheduled = true;

            requestAnimationFrame(() => {
                scheduled = false;
                tryInit();
            });
        });

        readyObserver.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // Begin after DOMContentLoaded so options aren't read from partially
    // parsed homepage content. This also supports document-start execution.
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
