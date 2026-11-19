(() => {
    // Add section under hero
    const hero = document.querySelector("#main-content h1");

    if (!hero || document.querySelector("#gain-questionnaire-section")) return;

    const section = document.createElement("section");
    section.id = "gain-questionnaire-section";

    section.innerHTML = `
        <h2>Find the right solution for you</h2>
        <p>Answer a few questions to discover how we can help.</p>
        <button type="button">Get Started</button>
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

                <p>
                    <strong>Services:</strong>
                    <span id="gain-summary-services"></span>
                </p>
                <button id="gain-edit-services" type="button">Edit services</button>

                <p>
                    <strong>Industries:</strong>
                    <span id="gain-summary-industries"></span>
                </p>
                <button id="gain-edit-industries" type="button">Edit industries</button>
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

        const articlesHeading = document.createElement("h3");
        articlesHeading.textContent = "Recommended articles";
        content.append(articlesHeading);

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

            const paragraph = document.createElement("p");
            paragraph.append(articleLink);

            content.append(paragraph);
        });
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

        const heading = document.createElement("h3");
        heading.textContent = "Recommended case studies";
        content.append(heading);

        if (recommendations.length === 0) {
            const message = document.createElement("p");
            message.textContent = "No matching case studies found. ";

            const link = document.createElement("a");
            link.href = "https://www.thisisgain.com/work/";
            link.textContent = "Browse all our work";

            message.append(link);
            content.append(message);
            return;
        }

        const list = document.createElement("ul");

        recommendations.forEach(study => {
            const item = document.createElement("li");

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

        content.append(list);
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

                content.append(emailLink);
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

        // Show selected services and industries in the results summary
        modal.querySelector("#gain-summary-services").textContent =
            selectedServices.join(", ");

        modal.querySelector("#gain-summary-industries").textContent =
            selectedIndustries.join(", ");
    }

    // Next and Back navigation
    const steps = modal.querySelectorAll('[id^="gain-step-"]');
    const progressItems = modal.querySelectorAll(".gain-progress-item");
    const nextButton = modal.querySelector("#gain-next");
    const backButton = modal.querySelector("#gain-back");

    let currentStep = 1;

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
    }

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
            width: 600px;
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

        /* Dark background behind modal */
        #gain-questionnaire-modal::backdrop {
            background-color: rgba(0, 0, 0, 0.6);
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
            transition: background-color 0.2s ease;
        }

        #gain-close:hover {
            background-color: #f1f3f5;
        }

        /* Progress bar container */
        #gain-progress {
            display: flex;
            gap: 12px;
            list-style: none;
            padding: 0;
            margin: 0 0 32px;
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

        /* Lines connecting circles */
        .gain-progress-item:not(:first-child)::before {
            content: "";
            position: absolute;
            top: 20px;
            right: 50%;
            width: 100%;
            height: 4px;
            background: #ddd;
        }

        /* Blue lines for completed progress */
        .gain-progress-item.is-active::before,
        .gain-progress-item.is-complete::before {
            background: #5579ce;
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
        }

        /* Active circle */
        .is-active .gain-progress-circle {
            background: #5579ce;
            border-color: #5579ce;
            color: white;
        }

        /* Completed circle */
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

        .is-complete .gain-progress-check {
            display: flex;
        }

        /* Hide inactive questionnaire steps */
        #gain-questionnaire-modal [id^="gain-step-"][hidden] {
            display: none !important;
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

        #gain-service-options label,
        #gain-industry-options label {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 4px 12px;
            font-size: 16px;
            cursor: pointer;
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
            margin-top: 24px;
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
            transition: background-color 0.2s ease;
        }

        #gain-next:hover {
            background-color: #3f62b0;
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

        /* Results summary container */
        #gain-results-summary {
            margin-top: 24px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }

        #gain-results-summary h3 {
            margin-bottom: 12px;
        }

        #gain-results-summary p {
            line-height: 1.6;
            margin-bottom: 6px;
        }

        /* Edit buttons */
        #gain-edit-services,
        #gain-edit-industries {
            background: transparent;
            color: #5579ce;
            border: none;
            padding: 0;
            cursor: pointer;
            margin-bottom: 12px;
            font-size: 14px;
            margin-top: 4px;
        }

        #gain-edit-services:hover,
        #gain-edit-industries:hover {
            text-decoration: underline;
        }

        #gain-edit-services:focus-visible,
        #gain-edit-industries:focus-visible {
            outline: 2px solid #5579ce;
        }

        /* Case study list spacing */
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
        }

        /* Exact match badge */
        #gain-results-content .gain-match-exact {
            background-color: #e6f4ea;
            color: #217a3c;
        }

        /* Services / Industries labels */
        #gain-results-summary strong {
            color: #333;
            margin-right: 6px;
        }

        /* Selected answers */
        #gain-results-summary p span {
            color: #555;
        }
    `;

    document.head.append(style);
})();