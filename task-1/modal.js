
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
        <h2>What do you need help with?</h2>
        <div id="gain-service-options"></div>
        <button type="button">Close</button>
    `;

    document.body.append(modal);

    section.querySelector("button").addEventListener("click", () => modal.showModal());
    modal.querySelector("button").addEventListener("click", () => modal.close());

    // Get services from the Solutions menu
    // TODO: Edge cases
    const services = document.querySelectorAll(".site-navigation__submenu-link-title");
    const serviceNames = Array.from(services, service => service.textContent.trim());
    const options = modal.querySelector("#gain-service-options");

    serviceNames.forEach(name => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.value = name;

        // TODO: Temporary fix for the website's hidden checkbox styling
        checkbox.style.cssText = "position: static !important; width: 18px !important; height: 18px !important;";

        label.append(checkbox, name);
        options.append(label);
    });
})();
