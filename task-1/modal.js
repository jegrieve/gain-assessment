
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

    // Update results based on Questions 3 and 4
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

        // Show articles when requested, or when exploring and requesting contact
        if (
            resource === "Articles to read" ||
            (resource === "Talk to someone" && timeline === "Just exploring")
        ) {
            addArticles(content);
        }
    }

    // Next and Back navigation
    const steps = modal.querySelectorAll('[id^="gain-step-"]');
    const nextButton = modal.querySelector("#gain-next");
    const backButton = modal.querySelector("#gain-back");

    let currentStep = 1;

    function showStep() {
        steps.forEach((step, index) => {
            step.hidden = index !== currentStep - 1;
        });

        backButton.hidden = currentStep === 1;
        nextButton.hidden = currentStep === 5;
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
})();
