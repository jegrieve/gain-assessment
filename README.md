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