---
name: weather
description: Current conditions for any city, read like a public-information sign.
colors:
  code-sunny: "#f4a12f"
  on-sunny: "#14263a"
  code-cloudy: "#bfcad3"
  on-cloudy: "#14263a"
  code-foggy: "#a9beb4"
  on-foggy: "#14263a"
  code-rainy: "#2b6cb0"
  on-rainy: "#ffffff"
  code-stormy: "#5a4a9c"
  on-stormy: "#ffffff"
  code-snowy: "#ddebf6"
  on-snowy: "#14263a"
  code-clear-night: "#213f6b"
  on-clear-night: "#ffffff"
  dark-ground: "#0d1721"
  dark-panel: "#142230"
  dark-panel-hover: "#1b2d3e"
  dark-ink: "#e6edf3"
  dark-ink-2: "#9db0c1"
  dark-rule: "#24364a"
  dark-control: "#62798f"
  dark-band: "#1c3350"
  dark-band-ink: "#f2f6f9"
  dark-band-ink-2: "#a9bccd"
  dark-band-control: "#7089a3"
  dark-primary: "#e6edf3"
  dark-on-primary: "#0d1721"
  dark-primary-hover: "#ffffff"
  dark-error: "#ff9a8f"
  dark-focus: "#8cc8ff"
  light-ground: "#edf1f4"
  light-panel: "#ffffff"
  light-panel-hover: "#f4f7f9"
  light-ink: "#14263a"
  light-ink-2: "#4a5c6e"
  light-rule: "#cfd8df"
  light-control: "#7a8b9b"
  light-band: "#14263a"
  light-band-ink: "#ffffff"
  light-band-ink-2: "#afc2d3"
  light-band-control: "#5d7186"
  light-primary: "#14263a"
  light-on-primary: "#ffffff"
  light-primary-hover: "#213a55"
  light-error: "#b42318"
  light-focus: "#1d5fbf"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "6rem"
    fontWeight: 560
    lineHeight: 0.9
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
    fontVariation: "'wdth' 75"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  metric:
    fontFamily: "Archivo, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 560
    lineHeight: 1.1
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
    fontVariation: "'wdth' 75"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  section-title:
    fontFamily: "Archivo, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "Archivo, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: "Archivo, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    fontVariation: "'wdth' 87.5"
rounded:
  sign: "2px"
  control: "4px"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "24px"
  s-6: "32px"
  s-7: "48px"
  s-8: "64px"
  target: "44px"
  shell: "1200px"
components:
  band:
    backgroundColor: "{colors.dark-band}"
    textColor: "{colors.dark-band-ink}"
    height: "72px"
  units-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.dark-band-ink-2}"
    rounded: "{rounded.control}"
    padding: "2px"
    height: "40px"
  units-toggle-active:
    backgroundColor: "{colors.dark-band-ink}"
    textColor: "{colors.dark-band}"
    rounded: "{rounded.sign}"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.dark-band-ink}"
    rounded: "{rounded.control}"
    size: "{spacing.target}"
  code-bar:
    height: "6px"
    width: "100%"
  search-field:
    backgroundColor: "{colors.dark-panel}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.control}"
    padding: "6px 6px 6px 16px"
    height: "56px"
  button-primary:
    backgroundColor: "{colors.dark-primary}"
    textColor: "{colors.dark-on-primary}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "{spacing.target}"
  button-primary-hover:
    backgroundColor: "{colors.dark-primary-hover}"
  chip:
    backgroundColor: "{colors.dark-panel}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "{spacing.target}"
  chip-hover:
    backgroundColor: "{colors.dark-panel-hover}"
  plate:
    backgroundColor: "{colors.dark-panel}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.sign}"
    padding: "24px 32px"
    height: "432px"
  plate-sunny:
    backgroundColor: "{colors.code-sunny}"
    textColor: "{colors.on-sunny}"
  plate-cloudy:
    backgroundColor: "{colors.code-cloudy}"
    textColor: "{colors.on-cloudy}"
  plate-foggy:
    backgroundColor: "{colors.code-foggy}"
    textColor: "{colors.on-foggy}"
  plate-rainy:
    backgroundColor: "{colors.code-rainy}"
    textColor: "{colors.on-rainy}"
  plate-stormy:
    backgroundColor: "{colors.code-stormy}"
    textColor: "{colors.on-stormy}"
  plate-snowy:
    backgroundColor: "{colors.code-snowy}"
    textColor: "{colors.on-snowy}"
  plate-clear-night:
    backgroundColor: "{colors.code-clear-night}"
    textColor: "{colors.on-clear-night}"
  stale-tag:
    rounded: "{rounded.sign}"
    padding: "2px 8px"
    typography: "{typography.label}"
  refresh-button:
    backgroundColor: "transparent"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "{spacing.target}"
  key-tile:
    rounded: "{rounded.sign}"
    typography: "{typography.label}"
  range-track:
    height: "4px"
  metric-cell:
    backgroundColor: "{colors.dark-panel}"
    textColor: "{colors.dark-ink}"
    padding: "16px 24px"
    typography: "{typography.metric}"
  metrics-grid:
    backgroundColor: "{colors.dark-rule}"
    rounded: "{rounded.sign}"
  data-note:
    textColor: "{colors.dark-ink-2}"
    typography: "{typography.small}"
    width: "62ch"
  footer:
    textColor: "{colors.dark-ink-2}"
    typography: "{typography.small}"
    padding: "16px 0"
---

# Design System: weather

## Overview

**Creative North Star: "The Wayfinding Sign"**

The page behaves like a piece of 1970s public-information signage: a navy band across the top, a cool ground, plain panels, and one reversed plate whose field is the colour of the current condition. Seven condition code colours form a closed vocabulary; a visitor learns it once from the key on the empty plate and then reads every result at a glance, by colour first and pictogram second.

Density is calm and fixed. Every state (empty, loading, result, error, previous result) swaps inside cells of the same size, so nothing jumps. Depth comes from flat tonal steps and hairline rules, never from shadows or gradients. One family, Archivo, does all the talking by moving along its width axis: condensed for numerals, semi-condensed for labels, normal width for reading.

The system ships in two themes. Dark is the default (and the fallback when storage is blocked); light swaps the ground to silver and the panels to white. The band and the code colours stay recognisably the same in both.

**Key Characteristics:**
- A navy band with a seven-segment code bar under it; the current condition's segment widens.
- One plate per screen takes a code-colour field; everything else stays neutral.
- Solid geometric pictograms on a 48-unit grid; outline interface icons on a 24-unit grid.
- Two corner radii only: 2px for signs, 4px for controls.
- Flat surfaces, hairline rules, no shadows.
- Condensed tabular numerals for every reading.

## Colors

A cool navy-and-silver neutral system carrying a closed set of seven condition code colours, each paired with the ink that reads on it (all pairs at least 5.4:1).

### Primary
- **Signal Orange** (code-sunny): the clear-day condition colour, and the only code colour that also serves as the house signal: the sun brand mark, the focus ring inside the band, the search caret, text selection and the skip link.
- **Band Navy** (dark-band / light-band): the header band in both themes; the browser theme colour mirrors it.

### Secondary
The seven condition codes, each with its on-colour:
- **Signal Orange** (code-sunny, navy ink): clear sky by day.
- **Cloud Silver** (code-cloudy, navy ink): few to overcast clouds.
- **Mist Sage** (code-foggy, navy ink): mist, haze, fog and the 7xx atmosphere group.
- **Rain Blue** (code-rainy, white ink): drizzle and rain.
- **Storm Violet** (code-stormy, white ink): thunderstorms.
- **Snow Ice** (code-snowy, navy ink): snow.
- **Night Blue** (code-clear-night, white ink): clear sky at night.

### Neutral
- **Ground** (dark-ground / light-ground): the page field, near-black blue in dark, cool silver in light.
- **Panel** (dark-panel / light-panel): field, chips, neutral plate and metric cells; panel-hover lifts it one tonal step on hover.
- **Ink and Ink 2** (dark-ink, dark-ink-2 / light-ink, light-ink-2): primary text, and secondary text for ledes, hints, placeholders and captions.
- **Rule** (dark-rule / light-rule): hairlines, chip borders, the metric grid gutters and the footer rule.
- **Control** (dark-control / light-control): the search field border and scrollbar thumb.
- **Band Ink, Band Ink 2, Band Control**: text, secondary text and control outlines on the band.
- **Primary** (dark-primary / light-primary): the search button; it inverts against the theme (pale on dark, navy on light).
- **Error** and **Focus**: the validation/error state and the 3px focus outline.

### Named Rules
**The Code Means Condition Rule.** A code colour appears only where it stands for a weather condition: the plate field, the key tiles and the code bar. The single exception is Signal Orange as the house signal listed above; no other code colour is ever used decoratively.

**The Ink Pair Rule.** A code field always carries its own on-colour. On the light fields (sunny, cloudy, foggy, snowy) secondary text is the navy ink at 80% and the border darkens to 45% ink; on the dark fields (rainy, stormy, clear night) secondary text stays at full white.

**The One Reversed Plate Rule.** Only one surface per screen takes a code-colour field. Detail cells, chips and notes stay on panel neutrals.

## Typography

**Display Font:** Archivo (with Helvetica Neue, Arial, system-ui)
**Body Font:** Archivo
**Label/Mono Font:** Archivo at semi-condensed width

**Character:** A single grotesque that changes voice by width, not by family. Condensed numerals read like a departure board; semi-condensed labels read like a sign's legend strip.

Archivo is loaded as a variable font across width 62–125 and weight 100–900. The build uses three widths (75% for numerals, 87.5% for labels and captions, 100% for everything else) and the weights 400, 500, 560, 600, 650, 700 and 750.

### Hierarchy
- **Display** (560, 6rem, 0.9, condensed 75%, tabular): the temperature on the plate; the unit sits at 0.375em, semi-condensed, raised. 4.5rem below 768px.
- **Headline** (700, 2.5rem, 1.05, -0.025em, balanced wrap): the page H1. 2rem below 768px.
- **Metric** (560, 2rem, 1.1, condensed 75%, tabular): detail values in stacked cells; 1.75rem in narrow timetable rows; units at 0.5em in ink 2. 1.625rem below 768px.
- **Title** (700, 1.75rem, 1.15, -0.02em): the city name and the empty-plate title. 1.5rem below 768px.
- **Section title** (700, 1.25rem, -0.01em): "The finer details".
- **Lede** (400, 1.125rem, 1.45, max 34ch): the intro line; also the condition description at weight 600.
- **Body** (400, 1rem, 1.5): running text and the base size; reading measure capped near 40–62ch.
- **Small** (400, 0.875rem): status, hints, plate caption, data note, footer.
- **Label** (500–600, 0.8125rem, semi-condensed 87.5%): metric labels, country and chip codes, key captions, the stale tag, the "by a/d." signature.

The wordmark "weather" is set lowercase at 750, 1.375rem, -0.02em (1.25rem on phones).

### Named Rules
**The Width Axis Rule.** One family only. Hierarchy comes from width and weight on Archivo; a reading is condensed, a label is semi-condensed, a sentence is normal width.

**The Tabular Reading Rule.** Every number that can change (temperature, metrics, range ends, unit toggle) uses tabular figures so values swap without the line shifting.

## Layout

A centred shell of 75rem with a fluid gutter of clamp(1rem, 4vw, 3rem). Spacing runs on an eight-step scale from 4px to 64px; 24px and 48px carry most structural gaps.

- **1200px and up:** three columns read left to right as ask, answer, detail. The intro column takes 4.5 parts against 7.5 for the readout, and the readout splits plate to details 5:3. Plate and details share one height in every state, and the whole first view fits 1440×900.
- **768–1199px:** the intro becomes a two-column band (title and lede left, search, chips and status right) above the plate and details, which split 3:2.
- **Below 768px:** everything stacks; the plate drops to a 22rem minimum, the details grid goes 2×2, the band note hides and the footer stacks.
- **Below 480px:** the search button collapses to its arrow (label kept for assistive tech) and the "by a/d." signature hides.
- **Below 360px:** the plate caption wraps under Refresh.

The details grid follows its own container, not the viewport: one column of timetable rows (label left, value right) under 20rem, two stacked cells from 20rem, four across from 40rem.

All interactive targets are at least 44px (the units toggle segments are 44px wide and 40px tall inside a 2px-padded frame; 40px wide under 360px).

### Named Rules
**The Fixed Cell Rule.** States swap in place inside cells of fixed size; the plate keeps its minimum height (27rem, 22rem on phones) so loading, results and errors never shift the layout.

## Elevation & Depth

The system is flat. There are no shadows anywhere. Depth is conveyed by three tonal steps (ground, panel, band), 1px hairline rules, and the one reversed code-colour plate. Hover lifts a surface one tonal step (panel to panel-hover) or tints it by 8–10% of its ink.

### Named Rules
**The Flat Sign Rule.** Surfaces never cast shadows, blur, or glow. If something must stand forward, it changes field colour or gains a rule.

## Shapes

Rectangular, nearly square-cornered forms. Signs (the plate, the brand mark, key tiles, the metric grid, the stale tag) take a 2px corner; controls (field, chips, units frame, icon button, Refresh) take 4px. Borders are hairlines: 1px for panels and chips, 1.5px for the search field. The stale state is the one place a border goes dashed (2px, in plate ink).

**Pictograms** are solid geometric shapes on a 48-unit grid. Line elements (sun rays, rain streaks) are 3 units wide with butt caps; clouds are built from three circles and a bar, and partial-cloud symbols mask the sun or moon behind the cloud with a 5-unit clearance. They always fill with the current ink. On the plate the pictogram scales with the plate's width (clamp 6.5rem to 10rem); in the key it sits in a square tile of its code colour with 18% padding.

**Interface icons** are outlines on a 24-unit grid with a 2-unit stroke, butt caps and mitred joins, drawn at 20px (18px inline, 14px in the footer).

### Named Rules
**The Two Corners Rule.** 2px for signs, 4px for controls. Nothing is pill-shaped or circular.

**The One Grid Rule.** Every pictogram is drawn on the same 48-unit grid with the same 3-unit stroke, so all seven codes sit at the same visual scale.

## Components

### Band
- **Character:** the signage band; always navy in both themes.
- **Structure:** wordmark (sun pictogram on a 36px Signal Orange tile, lowercase name, a hairline-separated "by a/d." signature), a short note, then preferences pushed right. 72px tall (60px on phones).
- **Focus:** inside the band the focus ring turns Signal Orange.

### Units toggle
- **Style:** a 4px-cornered frame in band-control with 2px padding, holding °C and °F segments at weight 600, tabular.
- **State:** the pressed segment inverts to band ink on band navy; unpressed text is band ink 2 and brightens on hover. Colour transitions at 0.2s.

### Icon button (theme)
- **Style:** a 44px square, 4px corners, band-control outline, transparent field, 24px pictogram (sun in dark theme, moon in light). Hover tints 8% white.

### Code bar
- **Character:** the signature move. A 6px strip of seven equal segments, one per code, under the band.
- **Behaviour:** the current condition's segment grows to twelve shares over 0.7s on the ease-out curve while the plate takes the same colour.

### Search field
- **Style:** 56px tall on the panel colour, 1.5px control border, 4px corners; a 20px search icon in ink 2, the input at 1.0625rem with a Signal Orange caret, and the primary button docked inside.
- **Hover / Focus:** border moves to ink 2 on hover; on focus the border goes to ink and a 3px focus outline appears 2px out.
- **Error:** the border turns error red and the status line below shows an outline alert icon and the message in error colour.

### Primary button
- **Style:** 44px tall, 16px side padding, weight 650, primary field with on-primary text, label plus arrow icon.
- **Hover / Disabled:** steps to primary-hover over 0.2s; disabled drops to 70% opacity with a progress cursor. Under 480px it becomes a 44px square showing only the arrow.

### Chips
- **Style:** 44px tall, panel field, 1px rule border, 4px corners, city name at 0.9375rem/600 followed by a semi-condensed country code in ink 2.
- **Hover:** border to ink 2 and field to panel-hover.

### Plate
- **Character:** the reversed sign that carries the answer. One per screen.
- **Structure:** 2px corners, a 1px border at 14% ink (45% on light code fields), padding 24px/32px (16px on phones). The result reads top to bottom as city, open space, temperature with the pictogram at bottom right, description, range bar; a caption strip closes the plate above a hairline: "Current conditions · condition" in plate ink, observation time in plate ink 2, and Refresh at the right.
- **States:** neutral panel when empty; the code colour and its ink once a result lands (field and ink cross-fade over 0.5s). Loading draws a 3px progress line across the plate top that runs once over 8s and slows toward 90%, and dims values to 45% opacity; nothing loops. A failed newer search keeps the old result, turns the border 2px dashed and shows a "Previous result" tag in reversed plate colours.
- **Refresh:** 44px tall, 4px corners, 1px current-colour outline, weight 650, refresh icon; hover tints 10% plate ink. Focus rings on the plate follow the plate ink.

### Key
- **Character:** the legend that teaches the colour code, shown on the empty plate.
- **Style:** one row of seven equal columns; each a square code-colour tile (2px corners) holding its pictogram in the matching on-colour, with a semi-condensed label in ink 2 beneath.

### Range bar
- **Style:** "Low" and "High" ends in plate ink 2 with bold values in plate ink, joined by a 4px track in plate rule; a 4px by 18px marker in plate ink sits at the current temperature's position and slides over 0.5s.

### Metrics
- **Style:** a grid whose 1px gutters show the rule colour through, 2px outer corners. Each cell is panel-coloured with a semi-condensed label and 18px icon, a condensed tabular value with a smaller unit, and a hint line in ink 2. The wind hint carries a solid direction arrow rotated to the wind bearing (0.6s ease-out).
- **Responsive:** timetable rows in a narrow column; stacked cells two or four across in wider ones.

### Data note
- **Style:** an outline info icon beside a small paragraph in ink 2, capped at 62ch, opening with a bold lead sentence in ink at 650.

### Footer
- **Style:** a 1px rule on top, small text in ink 2 at left, links in ink at right with 14px external-link icons; links are 44px tall targets, underline 1px offset 0.25em, thickening to 2px on hover.

### Motion
One easing curve, cubic-bezier(0.16, 1, 0.3, 1), for anything that travels or recolours (code bar 0.7s, plate 0.5s, range marker 0.5s, wind arrow 0.6s). Control hover states use 0.2s colour transitions. Under reduced motion every transition and animation is removed.

## Do's and Don'ts

### Do:
- **Do** pair every code colour with its own on-colour and keep the pairs at 5.4:1 or better.
- **Do** keep one reversed code-colour plate per screen; everything else sits on ground and panel neutrals.
- **Do** set readings in Archivo at 75% width with tabular figures, and labels at 87.5% width.
- **Do** use 2px corners for signs and 4px corners for controls.
- **Do** draw new pictograms on the 48-unit grid with 3-unit butt-capped strokes, and new interface icons on the 24-unit grid with 2-unit outlines.
- **Do** keep every interactive target at 44px or more and show the 3px focus outline (Signal Orange on the band, plate ink on the plate).
- **Do** swap states inside fixed cells, and mark a superseded result instead of silently keeping it.

### Don't:
- **Don't** use a code colour for decoration or for anything that is not a condition, beyond Signal Orange's role as the house signal.
- **Don't** add shadows, blur, glass or gradients; depth is tonal steps and hairlines.
- **Don't** put sky photographs or gradients behind the reading.
- **Don't** introduce a second typeface; vary Archivo's width and weight instead.
- **Don't** round pictogram or icon strokes, or mix pictogram grids.
- **Don't** loop animations; loading progress runs once and stops.
