
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

    modal.innerHTML = `
        <ol id="gain-progress" aria-label="Questionnaire progress">
            <li class="gain-progress-item">
                <span class="gain-progress-circle">1</span>
                <span class="gain-progress-label">Services</span>
            </li>
            <li class="gain-progress-item">
                <span class="gain-progress-circle">2</span>
                <span class="gain-progress-label">Industry</span>
            </li>
            <li class="gain-progress-item">
                <span class="gain-progress-circle">3</span>
                <span class="gain-progress-label">Resources</span>
            </li>
            <li class="gain-progress-item">
                <span class="gain-progress-circle">4</span>
                <span class="gain-progress-label">Timeline</span>
            </li>
            <li class="gain-progress-item">
                <span class="gain-progress-circle">5</span>
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

        <button id="gain-back" type="button" hidden>Back</button>
        <button id="gain-next" type="button">Next</button>
        <button id="gain-close" type="button">Close</button>
    `;

    document.body.append(modal);

    section.querySelector("button").addEventListener("click", () => modal.showModal());

    // TODO: Reset questionnaire when modal closes
    modal.querySelector("#gain-close").addEventListener("click", () => modal.close());

    // Get services from the Solutions menu
    // TODO: Handle selector edge cases
    const services = document.querySelectorAll(".site-navigation__submenu-link-title");
    const serviceNames = Array.from(services, service => service.textContent.trim());
    const options = modal.querySelector("#gain-service-options");

    serviceNames.forEach(name => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.value = name;

        // TODO: Move temporary checkbox styling to CSS
        checkbox.style.cssText = "position: static !important; width: 18px !important; height: 18px !important;";

        label.append(checkbox, name);
        options.append(label);
    });

    // Get industries from the Our Sectors section
    const sectorsHeading = Array.from(document.querySelectorAll("#main-content p"))
        .find(p => p.textContent.trim() === "Our Sectors");

    const sectorsContainer = sectorsHeading.closest(".wp-block-columns");
    const sectorLinks = sectorsContainer.querySelectorAll(".wp-block-button__link");
    const industryNames = Array.from(sectorLinks, link => link.textContent.trim());

    const industryOptions = modal.querySelector("#gain-industry-options");

    industryNames.forEach(name => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.value = name;

        // TODO: Move temporary checkbox styling to CSS
        checkbox.style.cssText = "position: static !important; width: 18px !important; height: 18px !important;";

        label.append(checkbox, name);
        industryOptions.append(label);
    });

    // TODO: Move temporary radio styling to CSS
    modal.querySelectorAll('input[type="radio"]').forEach(input => {
        input.style.cssText = "position: static !important; width: 18px !important; height: 18px !important;";
    });

    // Get the 3 latest articles from the Insights slider
    function addArticles(content) {
        const headings = Array.from(document.querySelectorAll("#main-content h2, #main-content h3"));

        const insightsIndex = headings.findIndex(heading =>
            heading.tagName === "H2" && heading.textContent.trim() === "Insights"
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
        const cards = document.querySelectorAll(".content-slider .content-card--work");

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
                (industry === "Tech & Telcoms" && selectedIndustries.includes("Tech & Telco"));
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
            label.textContent = industryMatches(study.industry)
                ? " — Exact match"
                : " — Related";

            item.append(link, label);
            list.append(item);
        });

        content.append(list);
    }

    // Update results based on questionnaire answers
    function updateResults() {
        const timeline = modal.querySelector('input[name="gain-timeline"]:checked').value;
        const resource = modal.querySelector('input[name="gain-resource"]:checked').value;
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
            const footerEmail = document.querySelector('footer a[href^="mailto:"]');

            if (footerEmail) {
                const emailLink = document.createElement("a");

                emailLink.href = footerEmail.href;
                emailLink.textContent = footerEmail.getAttribute("href").replace("mailto:", "");

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
        modal.querySelector("#gain-summary-services").textContent = selectedServices.join(", ");
        modal.querySelector("#gain-summary-industries").textContent = selectedIndustries.join(", ");
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
        nextButton.hidden = currentStep === 5;

        // Update progress indicator
        progressItems.forEach((item, index) => {
            const stepNumber = index + 1;
            const isComplete = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;

            item.classList.toggle("is-complete", isComplete);
            item.classList.toggle("is-active", isActive);
            item.classList.toggle("is-upcoming", stepNumber > currentStep);

            const circle = item.querySelector(".gain-progress-circle");
            circle.textContent = isComplete ? "✓" : stepNumber;

            if (isActive) {
                item.setAttribute("aria-current", "step");
            } else {
                item.removeAttribute("aria-current");
            }
        });
    }

    nextButton.addEventListener("click", () => {
        const current = steps[currentStep - 1];

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

    // Set initial progress state
    showStep();
})();
