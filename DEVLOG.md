# Development Log

This document captures my approach, technical decisions, challenges, and trade-offs throughout the GAIN assessment.

My goal was to meet the functional requirements while keeping the implementations responsive, accessible, maintainable, and easy to explain.

## Task 1 — Dynamic Modal

### Initial Approach

- Build the questionnaire's HTML structure and core functionality first, then refine the visual design.
- Consider responsive layouts from the beginning, using Flexbox and Grid where appropriate.
- Read available services and industries directly from the existing website rather than hardcoding them.

### Key Decisions

- **Native `<dialog>` element:** Used the browser's built-in modal functionality for modal behaviour, keyboard interaction, and focus management rather than recreating everything manually.
- **Dynamic recommendations:** Read case studies from the homepage Work slider, articles from the Insights section, and contact details from the footer.
- **Results prioritization:** Prioritized case studies matching both the selected service and industry, followed by related case studies matching the service alone.
- **Editable answers:** Allowed users to revisit previous questions from the results page without restarting the questionnaire.
- **Progress indicators:** Added transitions, active/completed states, and checkmarks to communicate progression through the questionnaire.
- **Button states:** Created distinct default, hover, focus, active, and disabled states for the pixel-style Get Started button.

### Challenges and Solutions

- **Different industry labels:** Noticed that industry names were not always consistent across sections of the website (e.g., "Tech & Telco" versus "Tech & Telcoms"). Added a targeted matching exception to avoid missing valid recommendations.
- **Responsive results:** Multiple service and industry selections could make the results page quite tall. Used wrapping answer chips and constrained scrollable areas at smaller screen sizes.
- **Dynamic content readiness:** Required homepage elements might not exist immediately when the script executes. Added initialization checks and a temporary `MutationObserver` to initialize only when the required sources are available.

### Assumptions and Trade-offs

- Recommendation quality is limited to the case studies and articles available in the existing page DOM.
- The resource and timeline questions use predefined options because they describe user preferences, while service and industry options are read from the website.
- The questionnaire is a lightweight recommendation tool, not a comprehensive recommendation engine.

---

## Task 2 — Footer Drawer

### Initial Approach

- Build a fixed bottom drawer that complements the existing website without replacing its original content.
- Reuse information from the homepage Work slider and Solutions navigation.
- Support different numbers of visible cards depending on screen width.

### Key Decisions

- **DOM-derived data:** Extracted case-study titles, links, images, services, and industries from existing homepage elements rather than duplicating the content manually.
- **Native horizontal scrolling:** Used CSS scroll snapping for the carousel, with JavaScript handling pagination and navigation controls.
- **Multiple input methods:** Supported arrow navigation, trackpad scrolling, touch swiping, and mouse dragging.
- **Tooltips:** Displayed service and industry information in tooltips, with support for desktop hover, keyboard focus, and touch interaction.
- **Drawer dismissal:** Added overlay dismissal and automatic closing when the user reaches the bottom of the page.
- **Accessibility:** Used descriptive button labels, expanded states, and `inert` to prevent interaction with hidden drawer content.

### Challenges and Solutions

- **Image extraction:** Some homepage images use SVG placeholders containing the original image URL. Extracted the underlying URL so the drawer could display the actual image without additional API requests.
- **Tooltip clipping:** Tooltips inside the horizontally scrollable carousel risked being clipped. Rendered them outside the scrolling area and positioned them relative to their corresponding tags.
- **Carousel state:** Smooth arrow navigation and manual scrolling can both affect the current page. Added navigation-state tracking to avoid page-counter updates based on intermediate animation positions.
- **Drag versus click:** Added a small drag threshold and suppressed accidental link activation after dragging.

### Assumptions and Trade-offs

- The carousel reflects the case studies currently present in the homepage DOM rather than fetching a complete external catalogue.
- I preferred browser-native scrolling and snapping over implementing a fully custom carousel, reducing complexity while preserving mobile swipe behaviour.
- Some interaction logic is necessarily more involved because the drawer supports several input methods.

---

## Task 3 — SPA DOM Manipulation

### Initial Approach

- Replace the original blog cards with Pokémon while preserving the surrounding page layout, filters, and pagination.
- Use PokeAPI as the Pokémon data source.
- Account for the fact that the original blog listing is managed by React and can change without a full page reload.

### Key Decisions

- **Separate rendering container:** Created a Pokémon grid outside React's managed article list so React wouldn't overwrite the injected cards.
- **Early stylesheet loading:** Added CSS rules to hide the original article grid. Loading the separate stylesheet before the page renders helps prevent the original articles from briefly appearing.
- **SPA navigation:** Used a `MutationObserver` to detect page changes and render Pokémon corresponding to the current URL.
- **Sequential Pokémon IDs:** Mapped the existing pagination to groups of 12 Pokémon (1–12, 13–24, etc.).
- **Caching:** Cached successfully fetched pages to avoid unnecessary repeat requests when navigating backward and forward.
- **Stale-response protection:** Used request IDs so slower API responses from previous pages could not overwrite the currently requested page.
- **Type filtering:** Reused the site's existing filter styling and provided all 18 Pokémon types.
- **Card interactions:** Implemented flipping cards with mouse and keyboard interaction, including accessibility-state updates.

### Challenges and Solutions

- **React ownership:** Directly replacing React-managed elements could cause injected content to disappear after a rerender. Keeping the new grid outside that subtree avoided this conflict.
- **Loading transitions:** Added skeleton cards while requesting Pokémon, while skipping skeletons for cached pages.
- **Rapid navigation:** Protected against out-of-order responses when switching pages before previous fetches finish.
- **Responsive cards:** Adjusted the card layout for different breakpoints, allowing tags to wrap and card heights to grow naturally.
- **API failures:** Added an error message when Pokémon data cannot be loaded rather than leaving the page in a loading state.

### Assumptions and Trade-offs

- This implementation depends on the site's current routing, DOM structure, and class names. Significant changes to these integration points may require adjustments.
- Pokémon are filtered within the current page's 12 results rather than searching the complete Pokédex, as specified in the assessment.
- PokeAPI is an external dependency, so network or API failures can prevent results from appearing.
- The solution prioritizes working with the existing SPA rather than attempting to modify or take control of its underlying React application.

---

## Shared Engineering Decisions

### Console-First Architecture

- Each task is self-contained in one JavaScript file, without imports, external build tools, or a bundling process.
- Used an IIFE to keep functions and state scoped to each task.
- Organized functionality into logically named helper functions and code sections to make it easier to maintain, explain, and modify during the live interview.
- Added guards against duplicate UI initialization when scripts are executed more than once.
- Kept CSS in separate stylesheets, as required, so it can be injected into the document's `<head>` independently of the JavaScript.
- Designed the implementations to initialize when their required page elements become available, supporting execution before the page has finished loading.

### Dependency on the Existing Website

- All three tasks integrate with existing page content through DOM queries and CSS selectors.
- **Assumption:** The relevant website structure, routing, and selectors will remain reasonably stable during the assessment and review period.
- **Trade-off:** Direct DOM integration is appropriate for this assessment, but it is more fragile than integration through stable APIs or components maintained within the original application.
- Significant website changes, such as renamed classes, removed elements, or different rendering behaviour, may require updates to the scripts.
- In a production environment, I would favour stable integration points, shared data sources, and automated regression tests where possible.

### UI/UX and Accessibility

- Aimed to make interactions intuitive and consistent with the existing website.
- Considered responsive layouts, keyboard interaction, focus indicators, descriptive labels, and reduced-motion preferences.
- Used subtle animations where they communicate state or provide feedback rather than adding motion solely for decoration.

---

## Testing and Final Review

### Testing Performed

**Task 1 — Dynamic Modal**

- Tested the questionnaire's question navigation, answer selection, results, and editing behaviour.
- Verified that article recommendations match the homepage's Insights entries, including their titles and destination URLs.
- Confirmed that the questionnaire section, modal, and progress indicators are not duplicated after repeated script execution.
- Tested the separated CSS and JavaScript together through DevTools Console injection.
- Tested execution through Tampermonkey.

**Task 2 — Footer Drawer**

- Verified that the drawer's card count matches the homepage Work slider.
- Confirmed the case-study titles, links, images, descriptions, and tooltip elements are present.
- Verified pagination and the drawer's fixed positioning.
- Confirmed that repeated initialization does not create duplicate drawer or overlay elements.
- Manually tested opening, closing, carousel navigation, tooltips, dragging, and responsive behaviour.

**Task 3 — SPA DOM Manipulation**

- Verified that the standalone stylesheet loads correctly and the Pokémon grid displays 12 cards.
- Tested Pokémon numbering across different pages, including page 2 starting at #13.
- Verified all 18 type options, current-page filtering, empty states, and preservation of the selected type while navigating.
- Tested card flipping and continued interaction after pagination or filtering.
- Confirmed that the original article grid and original filters are hidden.
- Checked the interface at mobile, tablet, and desktop sizes.

### Testing Limitations

- Testing was performed against the live website as it existed during development. Future changes to its DOM structure or routing may affect the implementations.
- The Pokémon task relies on PokeAPI availability and network connectivity.
- The original article grid must be hidden before the page's first render to guarantee that no article content flashes. This requires the separate stylesheet to be loaded early, rather than injected manually after the page is already visible.
- Browser-based manual testing does not replace a comprehensive automated regression or accessibility test suite.

---

## Final Submission

The assessment is organized into three independent tasks, each containing standalone JavaScript and CSS files.

For each task, the CSS should be injected into the document's `<head>` before executing the JavaScript in DevTools Console. No build process or additional JavaScript dependencies are required.

The submission includes:

- **Task 1:** Dynamic Modal — JavaScript and CSS
- **Task 2:** Footer Drawer — JavaScript and CSS
- **Task 3:** SPA DOM Manipulation — JavaScript and CSS
- **README.md:** Setup instructions, task descriptions, and the assessment checklist
- **DEVLOG.md:** Development approach, technical decisions, challenges, testing, and trade-offs

The remaining submission steps are to finalize the README, record demonstrations, push the completed work to GitHub, and provide the repository link according to the assessment instructions.
