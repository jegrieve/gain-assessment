# GAIN Take-Home Assessment

This repository contains my solutions to the three development tasks for the GAIN take-home assessment.

All three tasks use vanilla JavaScript and CSS, with no additional dependencies or build process. Each task can be executed independently through Chrome DevTools.

## Demo Videos

[Watch all three task demonstrations on Google Drive](https://drive.google.com/drive/folders/13W1EEo0sKZK7ZshnKmhp3BPbXcT0-uhr?usp=sharing)

The folder contains:

- **Task 1 — Dynamic Modal:** Interactive questionnaire, recommendations, validation, and button states.
- **Task 2 — Footer Drawer:** Responsive case-study carousel, tooltips, and drawer interactions.
- **Task 3 — SPA DOM Manipulation:** Pokémon cards, pagination, type filtering, and card flipping.

## Repository Structure

- **`task-1/`**
  - `modal.js` — Dynamic questionnaire functionality
  - `modal.css` — Questionnaire layout and styling
- **`task-2/`**
  - `drawer.js` — Footer drawer and carousel functionality
  - `drawer.css` — Drawer layout and styling
- **`task-3/`**
  - `pokemon.js` — Pokémon rendering and SPA integration
  - `pokemon.css` — Pokémon grid and card styling
- **`README.md`** — Setup instructions and assessment checklist
- **`DEVLOG.md`** — Development decisions, implementation details, challenges, and trade-offs

## How to Run

Each task is self-contained and can be tested directly on the relevant GAIN website.

### General Instructions

1. Open the corresponding page in Google Chrome.
2. Open DevTools using `Cmd + Option + J` (Mac) or `Ctrl + Shift + J` (Windows).
3. Inject the corresponding CSS file into the document's `<head>`.
4. Copy the entire contents of the task's JavaScript file into the DevTools Console and press Enter.
5. Interact with the newly added functionality.

**Important:** Load the CSS before executing the JavaScript. The stylesheets and scripts are separate and do not require a build process.

### Injecting CSS Through DevTools

To inject a stylesheet using the Console, use this snippet:

```javascript
(() => {
    const style = document.createElement("style");

    style.textContent = `
        /* Paste the entire contents of the task's CSS file here */
    `;

    document.head.appendChild(style);
})();
```

Replace the comment with the CSS file's contents, keeping the surrounding backticks.

For a clean test, refresh the page before running a different task.

### Task 1 — Dynamic Modal

**Page:** https://www.thisisgain.com/

1. Inject `task-1/modal.css`.
2. Execute `task-1/modal.js` in the Console.
3. Scroll beneath the homepage hero section.
4. Click **Get Started** to open the questionnaire.
5. Complete the four questions to view personalized results.

You can change previous answers, edit your selections from the results screen, and explore different recommendation combinations.

**Testing the Disabled Button State**

The Get Started button includes five CSS-only visual states: default, hover, focus, active, and disabled.

To preview the disabled state, paste this into the Console:

```javascript
document.querySelector("#gain-questionnaire-section .gain-button-wrap button").disabled = true;
```

To restore the button:

```javascript
document.querySelector("#gain-questionnaire-section .gain-button-wrap button").disabled = false;
```

The disabled state is intended as a visual demonstration; the button is enabled during normal questionnaire use.

Other behaviours worth testing include attempting to continue without an answer, navigating backward, editing selections, and changing the resource or timeline selections to produce different results.

### Task 2 — Footer Drawer

**Page:** https://www.thisisgain.com/

1. Inject `task-2/drawer.css`.
2. Execute `task-2/drawer.js` in the Console.
3. Find the **Explore our work** tab at the bottom of the viewport.
4. Click the tab to open the drawer.
5. Explore case studies using the navigation arrows, mouse dragging, or touch swiping.

Hover over or focus on an industry tag to view its tooltip. The drawer can also be dismissed using the overlay and automatically closes when scrolling to the bottom of the page.

### Task 3 — SPA DOM Manipulation

**Page:** https://www.thisisgain.com/blog/

1. Inject `task-3/pokemon.css`.
2. Execute `task-3/pokemon.js` in the Console.
3. The original article grid will be replaced visually by a Pokémon grid.
4. Use the existing pagination to navigate between groups of 12 Pokémon.
5. Use **Filter by type** to filter the current page.
6. Click a Pokémon card to flip it and view additional details.

The selected type remains active when navigating between pages.

**Important:** To prevent the original articles from flashing during initial page loading, the Pokémon CSS must be loaded before the page's first render. This can be tested using early stylesheet injection through a browser extension or userscript setup. Injecting CSS manually into an already-loaded page cannot test that initial-loading behaviour.

## Development Notes

Each implementation is designed to be safe to execute more than once without duplicating its added UI.

Because the tasks integrate with an existing third-party website, they rely on its current DOM structure and selectors. Significant changes to the website may require updates.

For further details about architectural decisions, challenges, and trade-offs, see [DEVLOG.md](DEVLOG.md).

---

## Take-home checklist

### All tasks

- [x] Safe to run more than once on the same page (no duplicate sections, drawers or cards)

### 1. Dynamic Modal: Questionnaire (https://www.thisisgain.com/)

- [x] Uses Flex or Grid CSS
- [x] Works on desktop, tablet and mobile (down to 375px)
- [x] Nothing is hardcoded: options, case studies, articles and the email are read from the homepage
- [x] New section under the hero: header, paragraph and button
- [x] Button UI states match Figure 1 (CSS only)
- [x] Button opens a modal
- [x] 4 question steps + a results step
- [x] Service options match the "Solutions" menu and industry options match "Our Sectors"
- [x] Questions 1 and 2 allow more than one answer, questions 3 and 4 allow one
- [x] Results heading changes with question 4
- [x] Results content changes with question 3 (case studies, articles or email)
- [x] Exact matches first, topped up with labelled related ones (max 3, in slider order), plus the "none" message
- [x] "Right away" always shows the email at the top (only once with "Talk to someone")
- [x] "Talk to someone" + "Just exploring" also shows the 3 latest articles
- [x] Summary of the question 1 and 2 picks, with a way to go back and change them
- [x] Case studies and articles link to their real pages
- [x] Progress bar with active (blue, bold), completed (blue + green checkmark) and next (white) states
- [x] Can't go to the next step until the current one is answered
- [x] Can go back, change an answer, and the results update

### 2. Footer Drawer (https://www.thisisgain.com/)

- [x] Uses Flex or Grid CSS
- [x] Works on desktop, tablet and mobile (down to 375px)
- [x] Sticky drawer at the bottom of the page
- [x] Tab toggles the drawer on/off
- [x] Chevron rotates 180 degrees on toggle
- [x] Drawer slides in and out from the bottom
- [x] Page count and arrow buttons when the drawer is open
- [x] Overlay on the page, and clicking it closes the drawer
- [x] Drawer closes automatically at the bottom of the page
- [x] One slide per case study, read from the "Work" slider (nothing hardcoded or fetched)
- [x] Each slide has an image, header, industry tag with tooltip, service description and link
- [x] Slider is draggable and swipeable on smaller viewports
- [x] Tooltip matches Figure 5 and handles small screens or tight space
- [x] 4+ slides on desktop, 2+ on tablet, 1 on mobile

### 3. SPA DOM Manipulation (https://www.thisisgain.com/blog/)

- [x] Uses Flex or Grid CSS
- [x] Works on desktop, tablet and mobile (down to 375px)
- [x] Every article card shows a Pokémon (image, name, types) based on its position
- [x] No article content flashes before the Pokémon appear (paging and filtering too)
- [x] Pokémon numbers follow the page (page 2 starts at #13)
- [x] "Filter by Tags" hidden, and "Filter by type" lists the 18 regular types and filters the current page, with an empty message
- [x] The chosen type stays selected when changing pages
- [x] Clicking a Pokémon card flips it to show more details, and still works after paging or filtering
- [x] All changes persist through the type filter and paging

### Bonus

- [x] [Bonus] Animations where they improve the experience
- [x] [Bonus] Works when it runs before the page has finished loading
