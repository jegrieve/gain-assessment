
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

    // Next and Back navigation
    const step1 = modal.querySelector("#gain-step-1");
    const step2 = modal.querySelector("#gain-step-2");
    const nextButton = modal.querySelector("#gain-next");
    const backButton = modal.querySelector("#gain-back");

    nextButton.addEventListener("click", () => {
        const selected = step1.querySelectorAll("input:checked");

        if (selected.length === 0) return;

        step1.hidden = true;
        step2.hidden = false;
        backButton.hidden = false;
        nextButton.hidden = true;
    });

    backButton.addEventListener("click", () => {
        step1.hidden = false;
        step2.hidden = true;
        backButton.hidden = true;
        nextButton.hidden = false;
    });
})();
