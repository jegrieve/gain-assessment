## Take-home checklist

### All tasks

- [ ] Safe to run more than once on the same page (no duplicate sections, drawers or cards)

### 1. Dynamic Modal: Questionnaire (https://www.thisisgain.com/)

- [ ] Uses Flex or Grid CSS
- [ ] Works on desktop, tablet and mobile (down to 375px)
- [ ] Nothing is hardcoded: options, case studies, articles and the email are read from the homepage
- [ ] New section under the hero: header, paragraph and button
- [ ] Button UI states match Figure 1 (CSS only)
- [ ] Button opens a modal
- [ ] 4 question steps + a results step
- [ ] Service options match the "Solutions" menu and industry options match "Our Sectors"
- [ ] Questions 1 and 2 allow more than one answer, questions 3 and 4 allow one
- [ ] Results heading changes with question 4
- [ ] Results content changes with question 3 (case studies, articles or email)
- [ ] Exact matches first, topped up with labelled related ones (max 3, in slider order), plus the "none" message
- [ ] "Right away" always shows the email at the top (only once with "Talk to someone")
- [ ] "Talk to someone" + "Just exploring" also shows the 3 latest articles
- [ ] Summary of the question 1 and 2 picks, with a way to go back and change them
- [ ] Case studies and articles link to their real pages
- [ ] Progress bar with active (blue, bold), completed (blue + green checkmark) and next (white) states
- [ ] Can't go to the next step until the current one is answered
- [ ] Can go back, change an answer, and the results update

### 2. Footer Drawer (https://www.thisisgain.com/)

- [ ] Uses Flex or Grid CSS
- [ ] Works on desktop, tablet and mobile (down to 375px)
- [ ] Sticky drawer at the bottom of the page
- [ ] Tab toggles the drawer on/off
- [ ] Chevron rotates 180 degrees on toggle
- [ ] Drawer slides in and out from the bottom
- [ ] Page count and arrow buttons when the drawer is open
- [ ] Overlay on the page, and clicking it closes the drawer
- [ ] Drawer closes automatically at the bottom of the page
- [ ] One slide per case study, read from the "Work" slider (nothing hardcoded or fetched)
- [ ] Each slide has an image, header, industry tag with tooltip, service description and link
- [ ] Slider is draggable and swipeable on smaller viewports
- [ ] Tooltip matches Figure 5 and handles small screens or tight space
- [ ] 4+ slides on desktop, 2+ on tablet, 1 on mobile

### 3. SPA DOM Manipulation (https://www.thisisgain.com/blog/)

- [ ] Uses Flex or Grid CSS
- [ ] Works on desktop, tablet and mobile (down to 375px)
- [ ] Every article card shows a Pokémon (image, name, types) based on its position
- [ ] No article content flashes before the Pokémon appear (paging and filtering too)
- [ ] Pokémon numbers follow the page (page 2 starts at #13)
- [ ] "Filter by Tags" hidden, and "Filter by type" lists the 18 regular types and filters the current page, with an empty message
- [ ] The chosen type stays selected when changing pages
- [ ] Clicking a Pokémon card flips it to show more details, and still works after paging or filtering
- [ ] All changes persist through the type filter and paging

### Bonus

- [ ] [Bonus] Animations where they improve the experience
- [ ] [Bonus] Works when it runs before the page has finished loading
