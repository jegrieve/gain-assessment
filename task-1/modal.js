
(() => {
    let initialized = false;
    let observer = null;

    // Wait until the homepage elements used by the questionnaire exist
    function sourcesReady() {
        if (!document.body) return false;

        const hero = document.querySelector("#main-content h1");
        const services = document.querySelectorAll(
            ".site-navigation__submenu-link-title"
        );

        const sectorsHeading = Array.from(
            document.querySelectorAll("#main-content p")
        ).find(p => p.textContent.trim() === "Our Sectors");

        const sectorsContainer = sectorsHeading?.closest(".wp-block-columns");

        return Boolean(
            hero?.parentElement &&
            services.length &&
            Array.from(services).every(service => service.textContent.trim()) &&
            sectorsContainer?.querySelector(".wp-block-button__link")
        );
    }

    function tryInit() {
        if (initialized || document.querySelector("#gain-questionnaire-section")) {
            observer?.disconnect();
            return;
        }

        if (!sourcesReady()) return;

        initialized = true;
        observer?.disconnect();
        observer = null;

        initQuestionnaire();
    }

    function start() {
        tryInit();

        if (initialized || document.querySelector("#gain-questionnaire-section")) {
            return;
        }

        // Handle elements inserted after the initial HTML is parsed
        observer = new MutationObserver(tryInit);

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

    function initQuestionnaire() {
    // Add section under hero
    const hero = document.querySelector("#main-content h1");

    if (!hero || document.querySelector("#gain-questionnaire-section")) return;

    const section = document.createElement("section");
    section.id = "gain-questionnaire-section";

    section.innerHTML = `
        <h2>Find the right solution for you</h2>
        <p>Answer a few questions to discover how we can help.</p>

        <div class="gain-button-wrap">
            <button type="button"><span>Get Started</span></button>
        </div>
    `;

    hero.parentElement.after(section);

    // Add "Get Started" modal
    const modal = document.createElement("dialog");
    modal.id = "gain-questionnaire-modal";

    // Progress icons from Lucide: https://lucide.dev (ISC License)
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

    // Open modal
    section.querySelector("button").addEventListener("click", () => {
        modal.showModal();
    });

    // Close modal
    modal.querySelector("#gain-close").addEventListener("click", () => {
        modal.close();
    });

    // Get services from the Solutions menu
    // TODO: Handle selector edge cases
    const services = document.querySelectorAll(".site-navigation__submenu-link-title");

    const serviceNames = Array.from(
        services,
        service => service.textContent.trim()
    );

    const options = modal.querySelector("#gain-service-options");

    serviceNames.forEach(name => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.value = name;

        label.append(checkbox, name);
        options.append(label);
    });

    // Get industries from the Our Sectors section
    const sectorsHeading = Array.from(document.querySelectorAll("#main-content p"))
        .find(p => p.textContent.trim() === "Our Sectors");

    const sectorsContainer = sectorsHeading.closest(".wp-block-columns");
    const sectorLinks = sectorsContainer.querySelectorAll(".wp-block-button__link");

    const industryNames = Array.from(
        sectorLinks,
        link => link.textContent.trim()
    );

    const industryOptions = modal.querySelector("#gain-industry-options");

    industryNames.forEach(name => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.value = name;

        label.append(checkbox, name);
        industryOptions.append(label);
    });

    // Get the 3 latest articles from the Insights slider
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

        // Display articles as a list, just like case studies
        const list = document.createElement("ul");
        list.className = "gain-recommendations-list";

        articles.forEach(heading => {
            // Find the article link within its surrounding card
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

    // Get matching case studies from the Work slider
    function addCaseStudies(content, selectedServices, selectedIndustries) {
        const cards = document.querySelectorAll(
            ".content-slider .content-card--work"
        );

        const caseStudies = Array.from(cards, card => {
            const link = card.querySelector(".content-card__link");
            const tags = card.querySelectorAll(".content-tags li");

            return {
                title: link.textContent.trim(),
                service: tags[0].textContent.trim(),
                industry: tags[1].textContent.trim(),
                url: link.href
            };
        });

        // Handle different industry labels used on the website
        function industryMatches(industry) {
            return selectedIndustries.includes(industry) ||
                (
                    industry === "Tech & Telcoms" &&
                    selectedIndustries.includes("Tech & Telco")
                );
        }

        // Both service and industry match
        const exactMatches = caseStudies.filter(study =>
            selectedServices.includes(study.service) &&
            industryMatches(study.industry)
        );

        // Only the service matches
        const relatedMatches = caseStudies.filter(study =>
            selectedServices.includes(study.service) &&
            !industryMatches(study.industry)
        );

        // Exact matches first, maximum 3 results
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

    // Update results based on questionnaire answers
    function updateResults() {
        const timeline = modal.querySelector(
            'input[name="gain-timeline"]:checked'
        ).value;

        const resource = modal.querySelector(
            'input[name="gain-resource"]:checked'
        ).value;

        const heading = modal.querySelector("#gain-results-heading");
        const content = modal.querySelector("#gain-results-content");

        // Set heading based on timeline
        if (timeline === "Right away") {
            heading.textContent = "Let's talk this week";
        } else if (timeline === "In the next 3 months") {
            heading.textContent = "Here's where to start";
        } else {
            heading.textContent = "Take your time";
        }

        // Clear previous results
        content.replaceChildren();

        // Show email if starting right away or requesting contact
        if (timeline === "Right away" || resource === "Talk to someone") {
            const footerEmail = document.querySelector(
                'footer a[href^="mailto:"]'
            );

            if (footerEmail) {
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
        }

        // Read the user's selected services and industries
        const selectedServices = Array.from(
            modal.querySelectorAll("#gain-step-1 input:checked"),
            input => input.value
        );

        const selectedIndustries = Array.from(
            modal.querySelectorAll("#gain-step-2 input:checked"),
            input => input.value
        );

        // Show case studies when requested
        if (resource === "Case studies like mine") {
            addCaseStudies(content, selectedServices, selectedIndustries);
        }

        // Show articles when requested, or when exploring and requesting contact
        if (
            resource === "Articles to read" ||
            (resource === "Talk to someone" && timeline === "Just exploring")
        ) {
            addArticles(content);
        }


        function renderSummaryChips(selector, values) {
            const container = modal.querySelector(selector);
            container.replaceChildren();
        
            values.forEach(value => {
                const chip = document.createElement("span");
                chip.className = "gain-summary-chip";
                chip.textContent = value;
        
                container.append(chip);
            });
        }
        
        renderSummaryChips("#gain-summary-services", selectedServices);
        renderSummaryChips("#gain-summary-industries", selectedIndustries);
        
    }

    // Next and Back navigation
    const steps = modal.querySelectorAll('[id^="gain-step-"]');
    const progressItems = modal.querySelectorAll(".gain-progress-item");
    const nextButton = modal.querySelector("#gain-next");
    const backButton = modal.querySelector("#gain-back");

    let currentStep = 1;

    // Enable Next only when the current question has an answer
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

        // Show "Done" on the Results page instead of hiding Next
        nextButton.textContent = currentStep === 5 ? "Done" : "Next";

        // Update progress indicator
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

        // Refresh Next's disabled state when navigating
        updateNextButtonState();
    }

    // Update Next immediately when an answer changes
    modal.addEventListener("change", event => {
        if (event.target.matches('input[type="checkbox"], input[type="radio"]')) {
            updateNextButtonState();
        }
    });

    nextButton.addEventListener("click", () => {
        // Done closes the questionnaire
        if (currentStep === 5) {
            modal.close();
            return;
        }

        const current = steps[currentStep - 1];

        // Require an answer before moving forward
        if (!current.querySelector("input:checked")) return;

        currentStep++;

        if (currentStep === 5) {
            updateResults();
        }

        showStep();
    });

    backButton.addEventListener("click", () => {
        currentStep--;
        showStep();
    });

    // Return to a question to edit previous answers
    modal.querySelector("#gain-edit-services").addEventListener("click", () => {
        currentStep = 1;
        showStep();
    });

    modal.querySelector("#gain-edit-industries").addEventListener("click", () => {
        currentStep = 2;
        showStep();
    });

    // Reset when closed using Done, X, or Escape
    modal.addEventListener("close", () => {
        modal.querySelectorAll("input").forEach(input => {
            input.checked = false;
        });

        modal.querySelector("#gain-results-content").replaceChildren();

        currentStep = 1;
        showStep();
    });

    // Set initial progress state
    showStep();

    // Inject CSS for console testing
    // TODO: Move CSS into modal.css before submission





    const style = document.createElement("style");
    style.id = "gain-questionnaire-styles";
    
    style.textContent = `
        /* Modal container */
        #gain-questionnaire-modal {
            width: 680px;
            max-width: 90vw;
            max-height: 90vh;
            box-sizing: border-box;
            padding: 40px 24px 24px;
            border: none;
            border-radius: 12px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
            overflow-y: auto;
            background-color: white;
            color: #333;
        }
    
        /* Consistent modal layout while open */
        #gain-questionnaire-modal[open] {
            display: flex;
            flex-direction: column;
            animation: gain-modal-enter 250ms ease-out both;
        }
    
        /* Stable height on larger desktop screens */
        @media (min-width: 768px) and (min-height: 620px) {
            #gain-questionnaire-modal {
                min-height: 540px;
            }
        }
    
        @keyframes gain-modal-enter {
            from {
                opacity: 0;
                transform: translateY(10px) scale(0.98);
            }
    
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    
        /* Dark background behind modal */
        #gain-questionnaire-modal::backdrop {
            background-color: rgba(0, 0, 0, 0.6);
        }
    
        /* Use the website's font */
        #gain-questionnaire-modal,
        #gain-questionnaire-section {
            font-family: inherit;
        }
    
        #gain-questionnaire-modal button,
        #gain-questionnaire-section .gain-button-wrap > button {
            font-family: inherit;
        }
    
        /* Close X in the top-right */
        #gain-close {
            position: absolute;
            top: 12px;
            right: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            padding: 0;
            background-color: transparent;
            color: #333;
            border: none;
            border-radius: 50%;
            font-size: 28px;
            line-height: 1;
            cursor: pointer;
            transition:
                background-color 0.2s ease,
                transform 160ms ease;
        }
    
        #gain-close:hover {
            background-color: #f1f3f5;
            transform: scale(1.06);
        }
    
        /* Progress bar container */
        #gain-progress {
            display: flex;
            gap: 12px;
            list-style: none;
            padding: 0;
            margin: 0 0 32px;
            flex-shrink: 0;
        }
    
        .gain-progress-item {
            display: flex;
            flex: 1;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            position: relative;
            min-width: 0;
        }
    
        /* Connecting lines: fill blue from left to right */
        .gain-progress-item:not(:first-child)::before {
            content: "";
            position: absolute;
            top: 20px;
            right: 50%;
            width: 100%;
            height: 4px;
            background: linear-gradient(
                to right,
                #5579ce 50%,
                #ddd 50%
            );
            background-size: 200% 100%;
            background-position: right center;
            transition: background-position 350ms ease;
        }
    
        /* Fill the line when its step becomes active or completed */
        .gain-progress-item.is-active::before,
        .gain-progress-item.is-complete::before {
            background-position: left center;
        }
    
        /* Default circles */
        .gain-progress-circle {
            width: 40px;
            height: 40px;
            box-sizing: border-box;
            border: 2px solid #ddd;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            position: relative;
            z-index: 1;
            background: white;
            color: #777;
    
            /* Smooth transition between step states */
            transition:
                background-color 250ms ease,
                border-color 250ms ease,
                color 250ms ease;
        }
    
        /* Active and completed circles */
        .is-active .gain-progress-circle,
        .is-complete .gain-progress-circle {
            background: #5579ce;
            border-color: #5579ce;
            color: white;
        }
    
        /* Active label */
        .is-active .gain-progress-label {
            color: #5579ce;
            font-weight: bold;
        }
    
        /* Completed label */
        .is-complete .gain-progress-label {
            color: #5579ce;
        }
    
        /* Green checkmark badge on completed steps */
        .gain-progress-check {
            display: none;
            position: absolute;
            top: -7px;
            right: -7px;
            width: 20px;
            height: 20px;
            align-items: center;
            justify-content: center;
            background: #28a745;
            color: white;
            border: 2px solid white;
            border-radius: 50%;
            box-sizing: border-box;
        }
    
        /* Pop the green checkmark into view */
        .is-complete .gain-progress-check {
            display: flex;
            animation: gain-check-pop 250ms ease-out both;
        }
    
        @keyframes gain-check-pop {
            0% {
                opacity: 0;
                transform: scale(0.4);
            }
    
            70% {
                opacity: 1;
                transform: scale(1.15);
            }
    
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
    
        /* Hide inactive questionnaire steps */
        #gain-questionnaire-modal [id^="gain-step-"][hidden] {
            display: none !important;
        }
    
        /* Question transition when changing steps */
        #gain-questionnaire-modal [id^="gain-step-"]:not([hidden]) {
            flex-shrink: 0;
            animation: gain-step-enter 220ms ease-out both;
        }
    
        @keyframes gain-step-enter {
            from {
                opacity: 0;
                transform: translateY(8px);
            }
    
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    
        /* Question headings */
        #gain-questionnaire-modal h2 {
            font-size: 24px;
            margin-bottom: 20px;
        }
    
        /* Question 1 and 2 answer containers */
        #gain-service-options,
        #gain-industry-options {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
    
        /*
         * Industry options: display answers in two columns instead of one.
         * Keeps the 13 industry choices compact and reduces vertical scrolling.
         */
        #gain-industry-options {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px 12px;
        }
    
        #gain-service-options label,
        #gain-industry-options label {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 4px 12px;
            font-size: 16px;
            cursor: pointer;
        }
    
        /* Smooth hover and selection feedback for all answer options */
        #gain-questionnaire-modal #gain-service-options label,
        #gain-questionnaire-modal #gain-industry-options label,
        #gain-questionnaire-modal #gain-step-3 label,
        #gain-questionnaire-modal #gain-step-4 label {
            border-radius: 6px;
            transition: background-color 180ms ease;
        }
    
        /* Hover highlights */
        #gain-questionnaire-modal #gain-service-options label:hover,
        #gain-questionnaire-modal #gain-industry-options label:hover,
        #gain-questionnaire-modal #gain-step-3 label:hover,
        #gain-questionnaire-modal #gain-step-4 label:hover {
            background-color: #f2f6ff;
        }
    
    
        /* Checkbox and radio appearance */
        #gain-questionnaire-modal input[type="checkbox"],
        #gain-questionnaire-modal input[type="radio"] {
            position: static !important;
            width: 18px !important;
            height: 18px !important;
            accent-color: #5579ce;
            flex-shrink: 0;
        }
    
        /* Question 3 and 4 answer labels */
        #gain-step-3 label,
        #gain-step-4 label {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 4px 12px;
            font-size: 16px;
            cursor: pointer;
            margin-bottom: 6px;
        }
    
        /* Bottom navigation layout */
        .gain-modal-actions {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: auto;
            padding-top: 24px;
            flex-shrink: 0;
        }
    
        /* Ensure hidden navigation buttons stay hidden */
        #gain-back[hidden],
        #gain-next[hidden] {
            display: none !important;
        }
    
        /* Shared navigation button padding */
        #gain-back,
        #gain-next {
            padding: 10px 20px;
        }
    
        /* Next / Done button */
        #gain-next {
            margin-left: auto;
            background-color: #5579ce;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
    
            /* Smooth transition from disabled gray to active blue */
            transition:
                background-color 200ms ease,
                color 200ms ease;
        }
    
        #gain-next:hover {
            background-color: #3f62b0;
        }
    
        /* Disabled Next button */
        #gain-next:disabled,
        #gain-next:disabled:hover {
            background-color: #dce1e6;
            color: #777;
            cursor: not-allowed;
        }
    
        /* Back button */
        #gain-back {
            background-color: #dce1e6;
            color: #333;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
    
        #gain-back:hover {
            background-color: #c5cbd1;
        }
    
        /* Results headings */
        #gain-results-content h3,
        #gain-results-summary h3 {
            font-size: 18px;
        }
    
        /* Results summary card */
        #gain-results-summary {
            margin-top: 12px;
            padding: 16px;
            border: 1px solid #dfe5ec;
            border-radius: 10px;
            background: #f9fafb;
        }
    
        #gain-results-summary h3 {
            margin: 0 0 12px;
            color: #253246;
        }
    
        /* Each group keeps its Edit button aligned with the label */
        #gain-results-summary .gain-summary-group {
            min-width: 0;
            padding: 12px 0;
            border-top: 1px solid #e3e8ef;
        }
    
        #gain-results-summary .gain-summary-group:last-child {
            padding-bottom: 0;
        }
    
        #gain-results-summary .gain-summary-heading {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 10px;
        }
    
        #gain-results-summary .gain-summary-heading strong {
            margin: 0;
            color: #333;
            font-size: 14px;
        }
    
        /* Selected answers wrap naturally as small chips */
        #gain-results-summary .gain-summary-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            min-width: 0;
        }
    
        #gain-results-summary .gain-summary-chip {
            display: inline-flex;
            align-items: center;
            max-width: 100%;
            box-sizing: border-box;
            padding: 5px 9px;
            border: 1px solid #e1e6ed;
            border-radius: 6px;
            background: white;
            color: #475569;
            font-size: 13px;
            line-height: 1.35;
            overflow-wrap: anywhere;
        }
    
        /* Right-aligned underlined Edit buttons */
        #gain-edit-services,
        #gain-edit-industries {
            margin: 0;
            padding: 0;
            flex-shrink: 0;
            border: none;
            background: transparent;
            color: #5579ce;
            cursor: pointer;
            font-size: 13px;
            white-space: nowrap;
            text-decoration: underline;
            text-underline-offset: 3px;
        }
    
        #gain-edit-services:hover,
        #gain-edit-industries:hover {
            color: #3f62b0;
        }
    
        #gain-edit-services:focus-visible,
        #gain-edit-industries:focus-visible {
            outline: 2px solid #5579ce;
            outline-offset: 3px;
            border-radius: 2px;
        }
    
        /* Results list spacing */
        #gain-results-content li {
            margin-bottom: 10px;
        }
    
        /* Results links */
        #gain-results-content a {
            color: #5579ce;
        }
    
        #gain-results-content a:hover {
            text-decoration: underline;
        }
    
        /* Case study match badges */
        #gain-results-content li span {
            color: #666;
            font-size: 13px;
            background-color: #f1f3f5;
            padding: 4px 8px;
            border-radius: 999px;
            margin-left: 10px;
            display: inline-block;
        }
    
        /* Exact match badge */
        #gain-results-content .gain-match-exact {
            background-color: #e6f4ea;
            color: #217a3c;
        }
    
        /* Email icon and link */
        #gain-results-content .gain-email-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
    
        /* Email contact panel */
        #gain-results-content .gain-email-container {
            width: 100%;
            max-width: 100%;
            min-width: 0;
            box-sizing: border-box;
            padding: 18px;
            margin-bottom: 16px;
            background: #eef4ff;
            border: 1px solid #cad9f4;
            border-radius: 10px;
        }
    
        #gain-results-content .gain-email-container h3 {
            margin: 0 0 12px;
            color: #253d70;
            font-size: 18px;
        }
    
        #gain-results-content .gain-email-container .gain-email-link {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            max-width: 100%;
            min-width: 0;
            box-sizing: border-box;
            padding: 12px 16px;
            border: 1px solid #cad9f4;
            border-radius: 8px;
            background: white;
            color: #365ba6;
            font-weight: 600;
            text-decoration: none;
            overflow-wrap: anywhere;
            transition: background-color 180ms ease, border-color 180ms ease;
        }
    
        #gain-results-content .gain-email-container .gain-email-link:hover {
            background: #e2edff;
            border-color: #adc5ef;
            text-decoration: none;
        }
    
        #gain-results-content .gain-email-container svg {
            flex-shrink: 0;
        }
    
        /* Case studies/articles: heading and cards in one joined panel */
        #gain-results-content .gain-recommendations-container {
            min-width: 0;
            box-sizing: border-box;
            margin-bottom: 16px;
            border: 1px solid #dfe5ec;
            border-radius: 10px;
            background: #f8faff;
        }
    
        #gain-results-content .gain-recommendations-container > h3 {
            margin: 0;
            padding: 14px 16px 6px;
            line-height: 1.4;
        }
    
        #gain-results-content .gain-recommendations-container > p {
            margin: 0;
            padding: 0 16px 16px;
            line-height: 1.5;
            overflow-wrap: anywhere;
        }
    
        #gain-results-content .gain-recommendations-container > .gain-recommendations-description {
            padding: 0 16px 14px;
            margin: 0;
            color: #687385;
            font-size: 14px;
            line-height: 1.5;
        }
    
        #gain-results-content .gain-recommendations-list {
            display: grid;
            gap: 10px;
            list-style: none;
            min-width: 0;
            margin: 0;
            padding: 0 12px 12px;
        }
    
        #gain-results-content .gain-recommendations-list .gain-recommendation-card {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px 12px;
            min-width: 0;
            max-width: 100%;
            box-sizing: border-box;
            margin: 0;
            padding: 14px 16px;
            border: 1px solid #dfe5ec;
            border-radius: 8px;
            background: white;
            transition: background-color 180ms ease, border-color 180ms ease,
                box-shadow 180ms ease;
        }
    
        #gain-results-content .gain-recommendation-card:hover,
        #gain-results-content .gain-recommendation-card:focus-within {
            background: #f8faff;
            border-color: #c4d3ef;
            box-shadow: 0 2px 8px rgba(44, 79, 137, 0.06);
        }
    
        #gain-results-content .gain-recommendation-card a {
            flex: 1 1 180px;
            min-width: 0;
            max-width: 100%;
            font-weight: 600;
            line-height: 1.45;
            overflow-wrap: anywhere;
            text-decoration: none;
        }
    
        #gain-results-content .gain-recommendation-card span {
            display: inline-block;
            flex: 0 0 auto;
            max-width: 100%;
            margin-left: auto;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
        }
    
        #gain-results-content .gain-match-related {
            background-color: #eef0f3;
            color: #565f69;
        }
    
        #gain-results-content .gain-recommendation-card a:focus-visible,
        #gain-results-content .gain-email-link:focus-visible {
            outline: 2px solid #5579ce;
            outline-offset: 3px;
            border-radius: 2px;
        }
    
        /* Questionnaire section below hero */
        #gain-questionnaire-section {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            gap: 12px;
            padding: 0px 40px 64px;
            margin-top: 0;
            background: white;
        }
    
        #gain-questionnaire-section h2 {
            font-size: 36px;
            font-weight: 700;
            line-height: 1.2;
            margin: 0;
            color: #222;
        }
    
        #gain-questionnaire-section p {
            font-size: 18px;
            line-height: 1.6;
            color: #555;
            margin: 0;
            max-width: 500px;
        }
    
        /* Soft shadow follows the button's pixel-cut silhouette */
        #gain-questionnaire-section .gain-button-wrap {
            position: relative;
            display: inline-flex;
            isolation: isolate;
            filter: drop-shadow(0 7px 4px rgba(0, 0, 0, 0.22));
        }
    
        /* No raised shadow while focused, pressed, or disabled */
        #gain-questionnaire-section .gain-button-wrap:has(> button:focus-visible),
        #gain-questionnaire-section .gain-button-wrap:has(> button:active),
        #gain-questionnaire-section .gain-button-wrap:has(> button:disabled) {
            filter: none;
        }
    
        /*
         * Focus overlay:
         * White outer edge with blue inner border.
         * Independent of the pixelated corner decorations.
         */
        #gain-questionnaire-section .gain-button-wrap:has(> button:focus-visible)::after {
            content: "";
            position: absolute;
            inset: 0;
            border: 2px solid white;
            box-shadow: inset 0 0 0 3px #2b46b7;
            box-sizing: border-box;
            pointer-events: none;
            z-index: 10;
        }
    
        /* Get Started — Regular */
        #gain-questionnaire-section .gain-button-wrap > button {
            position: relative;
            --corner-border: #222120;
            padding: 22px 20px;
            font-size: 24px;
            white-space: nowrap;
            font-weight: 900;
            letter-spacing: 1px;
            text-transform: uppercase;
            text-shadow: 0 2px 0 rgba(0, 0, 0, 0.35);
            background-color: #517636;
            color: #ffffff;
            border: 4px solid #222120;
            border-radius: 0;
            cursor: pointer;
    
            /* Top corners intact; bottom corners cut */
            clip-path: polygon(
                0 0,
                100% 0,
                100% calc(100% - 5px),
                calc(100% - 5px) calc(100% - 5px),
                calc(100% - 5px) 100%,
                5px 100%,
                5px calc(100% - 5px),
                0 calc(100% - 5px)
            );
    
            width: 220px;
            box-sizing: border-box;
            text-align: center;
    
            /* Light top edge, dark left/right/bottom edges */
            box-shadow:
                inset 0 4px 0 #699645,
                inset 4px 0 0 #3a5627,
                inset -4px 0 0 #3a5627,
                inset 0 -4px 0 #3a5627;
        }
    
        /* Remove clipping while focused, pressed, or disabled */
        #gain-questionnaire-section .gain-button-wrap > button:focus-visible,
        #gain-questionnaire-section .gain-button-wrap > button:active,
        #gain-questionnaire-section .gain-button-wrap > button:disabled {
            clip-path: none;
        }
    
        /* Hover — darker green, same edge shading */
        #gain-questionnaire-section .gain-button-wrap > button:hover:not(:disabled) {
            background-color: #44632d;
        }
    
        /*
         * Focus — blue replaces the normal black border.
         * The wrapper overlay completes the rectangle at the corners.
         */
        #gain-questionnaire-section .gain-button-wrap > button:focus-visible {
            background-color: #44632d;
            border-color: #2b46b7;
            outline: none;
    
            box-shadow:
                0 0 0 5px white,
                inset 0 4px 0 #699645,
                inset 4px 0 0 #3a5627,
                inset -4px 0 0 #3a5627,
                inset 0 -4px 0 #3a5627;
        }
    
        /* Pressed — solid dark green, no inner shading */
        #gain-questionnaire-section .gain-button-wrap > button:active:not(:disabled) {
            background-color: #3a5627;
            box-shadow: none;
        }
    
        /* Disabled — light gray with gray text and border */
        #gain-questionnaire-section .gain-button-wrap > button:disabled {
            background-color: #e7e1de;
            color: #9e9693;
            border-color: #9e9693;
            --corner-border: #9e9693;
            box-shadow: none;
            text-shadow: none;
            cursor: not-allowed;
        }
    
        /*
         * Four stepped corners.
         * Their original positions are preserved, including on focus.
         */
        #gain-questionnaire-section .gain-button-wrap > button::before,
        #gain-questionnaire-section .gain-button-wrap > button::after,
        #gain-questionnaire-section .gain-button-wrap > button > span::before,
        #gain-questionnaire-section .gain-button-wrap > button > span::after {
            content: "";
            position: absolute;
            width: 5px;
            height: 5px;
            box-sizing: content-box;
            background: white;
            pointer-events: none;
        }
    
        /* Top-left corner */
        #gain-questionnaire-section .gain-button-wrap > button::before {
            top: -4px;
            left: -4px;
            border-right: 4px solid var(--corner-border);
            border-bottom: 4px solid var(--corner-border);
        }
    
        /* Top-right corner */
        #gain-questionnaire-section .gain-button-wrap > button::after {
            top: -4px;
            right: -4px;
            border-left: 4px solid var(--corner-border);
            border-bottom: 4px solid var(--corner-border);
        }
    
        /* Bottom-left corner */
        #gain-questionnaire-section .gain-button-wrap > button > span::before {
            bottom: -4px;
            left: -4px;
            border-right: 4px solid var(--corner-border);
            border-top: 4px solid var(--corner-border);
        }
    
        /* Bottom-right corner */
        #gain-questionnaire-section .gain-button-wrap > button > span::after {
            bottom: -4px;
            right: -4px;
            border-left: 4px solid var(--corner-border);
            border-top: 4px solid var(--corner-border);
        }
    
        /*
         * Mobile responsiveness: prevent progress step labels from overlapping.
         * Display only the active step's label while keeping all five icons visible.
         */
        @media (max-width: 450px) {
            #gain-progress {
                gap: 4px;
            }
    
            .gain-progress-label {
                opacity: 0;
                white-space: nowrap;
                font-size: 12px;
            }
    
            .gain-progress-item.is-active .gain-progress-label {
                opacity: 1;
            }
        }
    
        /* Compact recommendation cards on tablet and smaller screens */
        @media (max-width: 900px) {
            #gain-results-content .gain-recommendations-container {
                overflow: hidden;
            }
    
            #gain-results-content .gain-recommendations-container > h3 {
                padding: 12px 14px 5px;
                font-size: 17px;
            }
    
            #gain-results-content .gain-recommendations-container > .gain-recommendations-description {
                padding: 0 14px 12px;
                font-size: 13px;
            }
    
            #gain-results-content .gain-recommendations-list {
                max-height: min(200px, 32dvh);
                overflow-y: auto;
                overflow-x: hidden;
                overscroll-behavior: contain;
                -webkit-overflow-scrolling: touch;
                gap: 8px;
                scrollbar-width: thin;
                scrollbar-color: #cad9f4 transparent;
            }
    
            #gain-results-content .gain-recommendations-list .gain-recommendation-card {
                padding: 11px 12px;
                gap: 6px 8px;
            }
    
            #gain-results-content .gain-recommendation-card a {
                flex: 1 1 140px;
                font-size: 14px;
                line-height: 1.35;
            }
    
            #gain-results-content .gain-recommendation-card span {
                font-size: 11px;
                padding: 3px 6px;
                margin-left: auto;
            }
        
            /* Match the contact panel to compact recommendation typography */
            #gain-results-content .gain-email-container {
                padding: 14px;
            }
    
            #gain-results-content .gain-email-container h3 {
                font-size: 17px;
                margin-bottom: 8px;
            }
    
            #gain-results-content .gain-email-container .gain-email-link {
                padding: 10px 12px;
                gap: 8px;
                font-size: 14px;
            }
    
            /* Match the answers summary to compact recommendation typography */
            #gain-results-summary {
                padding: 14px;
            }
    
            #gain-results-summary h3 {
                font-size: 17px;
                margin-bottom: 10px;
            }
    
            #gain-results-summary .gain-summary-heading strong {
                font-size: 13px;
            }
    
            #gain-edit-services,
            #gain-edit-industries {
                font-size: 12px;
            }
    
            #gain-results-summary .gain-summary-chip {
                font-size: 12px;
                padding: 4px 8px;
            }
    
            /* Keep long answer summaries compact */
            #gain-results-summary {
                display: flex;
                flex-direction: column;
                max-height: min(300px, 40dvh);
                box-sizing: border-box;
                overflow: hidden;
            }
    
            /* Scroll answers within the card */
            #gain-results-summary > h3 {
                flex-shrink: 0;
            }
    
            #gain-results-summary .gain-summary-scroll-area {
                min-height: 0;
                padding-right: 12px;
                overflow-y: auto;
                overflow-x: hidden;
                overscroll-behavior: contain;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: thin;
                scrollbar-color: #cad9f4 transparent;
            }
        }
    
        /* Tighter version for mobile */
        @media (max-width: 600px) {
            #gain-results-content .gain-recommendations-container > h3 {
                padding: 12px 12px 4px;
                font-size: 16px;
            }
    
            #gain-results-content .gain-recommendations-container > .gain-recommendations-description {
                padding: 0 12px 10px;
                font-size: 12px;
                line-height: 1.4;
            }
    
            #gain-results-content .gain-recommendations-list {
                max-height: min(170px, 30dvh);
            }
    
            #gain-results-content .gain-recommendations-list .gain-recommendation-card {
                padding: 10px 12px;
            }
    
            #gain-results-content .gain-recommendation-card a {
                flex: 1 1 130px;
            }
    
            #gain-results-summary {
                padding: 12px;
            }
    
            #gain-results-summary .gain-summary-chip {
                padding: 4px 8px;
                font-size: 12px;
            }
    
            /* Match headings and email text to compact mobile recommendations */
            #gain-results-content .gain-email-container {
                padding: 12px;
            }
    
            #gain-results-content .gain-email-container h3,
            #gain-results-summary h3 {
                font-size: 16px;
            }
    
            #gain-results-content .gain-email-container .gain-email-link {
                font-size: 13px;
            }
    
            #gain-results-summary .gain-summary-heading strong {
                font-size: 12px;
            }
    
            /* Shorter answer summary on mobile */
            #gain-results-summary {
                max-height: min(220px, 35dvh);
            }
        }
    
        /* Respect reduced-motion preferences */
        @media (prefers-reduced-motion: reduce) {
            #gain-questionnaire-modal[open],
            #gain-questionnaire-modal [id^="gain-step-"]:not([hidden]),
            .is-complete .gain-progress-check {
                animation: none;
            }
    
            .gain-progress-circle,
            .gain-progress-item:not(:first-child)::before,
            #gain-close,
            #gain-next,
            #gain-questionnaire-modal #gain-service-options label,
            #gain-questionnaire-modal #gain-industry-options label,
            #gain-questionnaire-modal #gain-step-3 label,
            #gain-questionnaire-modal #gain-step-4 label {
                transition: none;
            }
        }
    `;
    
    document.head.append(style);
    

    }
})();
