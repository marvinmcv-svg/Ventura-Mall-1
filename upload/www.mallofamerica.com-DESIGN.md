# Design System Inspired by Mall of America

## 1. Visual Theme & Atmosphere

The Mall of America design system embodies a vibrant, family-friendly entertainment destination that celebrates boldness and accessibility. The aesthetic bridges contemporary retail sophistication with playful, approachable energy—think clean modernism punctuated by confident color accents and inviting typography. The visual language prioritizes clarity and wayfinding while maintaining a premium feel that appeals to both destination shoppers and local visitors. The system balances a neutral, professional foundation with strategic pops of color that evoke fun, adventure, and excitement.

**Key Characteristics**

- Bold, sans-serif typography (Interstate) for contemporary clarity paired with elegant serif headlines (Bodoni)
- High-contrast black navigation and white backgrounds for legibility and premium positioning
- Minimal accent color usage for strategic emphasis and call-to-action direction
- Clean, spacious layouts with generous padding that conveys luxury and breathing room
- Circular, pill-shaped buttons for friendliness and approachability
- Destination-focused imagery with illustrative, optimistic visual tone

## 2. Color Palette & Roles

### Primary
- **Charcoal** (`#313131`): Primary text, headings, and structural elements across all contexts
- **Black** (`#000000`): Navigation background, borders, and high-contrast dividers

### Accent Colors
- **Teal Accent** (`#AADDDD`): Secondary highlights and interactive states; used sparingly for visual interest

### Interactive
- **Light Gray** (`#C7C8CA`): Inactive/secondary button states and pagination indicators
- **Charcoal Active** (`#333333`): Active button and link states

### Neutral Scale
- **Off-White** (`#FFFFFF`): Primary background, text containers, and card surfaces
- **Medium Gray** (`#999999`): Secondary text, labels, and subtle dividers
- **Light Gray** (`#909090`): Tertiary text and disabled states
- **Dim Gray** (`#808080`): Placeholder text and low-priority information

### Status
- **Warning Pale** (`#FACEB0`): Warning and alert states (reserve for error messaging)

## 3. Typography Rules

### Font Family
- **Primary (Headlines):** Bodoni, Georgia, serif
- **Secondary (Body & UI):** Interstate, Helvetica, Arial, sans-serif

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display / H1 | Bodoni | 48px | 700 | 53.28px | 0px | Hero headings, major announcements |
| Heading / H2 | Bodoni | 32px | 700 | 38.08px | 0px | Section titles, campaign headlines |
| Subheading / H3 | Bodoni | 25px | 700 | 29px | 0px | Card titles, content sections |
| Body Text | Interstate | 18px | 300 | 23.94px | 0px | Main content, descriptions |
| Button Text | Interstate | 16px | 700 | 19.95px | 0px | Call-to-action labels |
| Label / Caption | Interstate | 16px | 300 | 22.08px | 0px | Form labels, helper text |
| Small / Tag | Interstate | 12px | 700 | 15.96px | 0px | Badges, navigation tabs, metadata |
| Input Text | Interstate | 16px | 400 | 21.28px | 0px | Form input, placeholder text |
| List Item | Interstate | 15px | 700 | 19.95px | 0px | Navigation lists, menu items |

### Principles
- Use Bodoni for all headlines to establish luxury and editorial authority
- Interstate body text maintains friendliness and modern clarity
- Generous line heights (1.2–1.33x font size) enhance readability and spaciousness
- Favor light weights (300) for body text to balance boldness of headlines
- All-caps treatments reserved for button text and small labels only
- Maintain 18px minimum for body text to ensure accessibility

## 4. Component Stylings

### Buttons

**Primary Button**
- Background: `#313131`
- Text Color: `#FFFFFF`
- Font: Interstate, 16px, weight 700
- Padding: `16px 32px`
- Border Radius: `4px`
- Border: `2px solid #313131`
- Box Shadow: none
- Hover: Background `#000000`, Text `#FFFFFF`
- Active: Background `#1A1A1A`, Box Shadow: `0px 4px 12px rgba(49, 49, 49, 0.3)`

**Secondary Button**
- Background: `#FFFFFF`
- Text Color: `#313131`
- Font: Interstate, 16px, weight 700
- Padding: `16px 32px`
- Border Radius: `4px`
- Border: `2px solid #313131`
- Box Shadow: none
- Hover: Background `#F5F5F5`, Border `#313131`
- Active: Background `#EEEEEE`

**Ghost / Link Button**
- Background: transparent
- Text Color: `#313131`
- Font: Interstate, 16px, weight 700
- Padding: `12px 0px`
- Border Radius: `0px`
- Border: `0px none`
- Box Shadow: none
- Hover: Text Color `#000000`, Border Bottom `2px solid #313131`
- Active: Text Color `#000000`

**Pagination Button (Carousel)**
- Background: `#C7C8CA` (inactive), `#333333` (active)
- Font: Interstate, 12px, weight 700
- Padding: `4px`
- Border Radius: `50%`
- Height: `8px`
- Width: `8px`
- Border: `0px none`
- Box Shadow: none
- Hover: Background `#999999`

### Cards & Containers

**Content Card**
- Background: `#FFFFFF`
- Text Color: `#313131`
- Font: Interstate, 18px, weight 300
- Padding: `32px`
- Border Radius: `0px`
- Border: `1px solid #E5E5E5`
- Box Shadow: `0px 2px 8px rgba(49, 49, 49, 0.08)`
- Hover: Box Shadow: `0px 4px 16px rgba(49, 49, 49, 0.12)`

**Hero Card (with overlay text)**
- Background: Linear gradient overlay (dark transparent to transparent)
- Text Color: `#FFFFFF` (on overlay)
- Font: Interstate, 18px, weight 300
- Padding: `24px`
- Border Radius: `0px`
- Position: Absolute bottom
- Box Shadow: none

**Feature Card (Three-column)**
- Background: `#FFFFFF`
- Text Color: `#313131`
- Padding: `0px`
- Border Radius: `0px`
- Border: `1px solid #F0F0F0`
- Box Shadow: none
- Image: Full width, 240px height
- Hover: Box Shadow: `0px 6px 20px rgba(49, 49, 49, 0.15)`

### Inputs & Forms

**Text Input**
- Background: `#FFFFFF`
- Text Color: `#000000`
- Font: Interstate, 16px, weight 400
- Padding: `12px 16px`
- Border Radius: `0px`
- Border: `1px solid #000000`
- Height: `44px`
- Box Shadow: none
- Focus: Border `2px solid #313131`, Box Shadow: `0px 0px 0px 4px rgba(170, 221, 221, 0.2)`
- Placeholder: Color `#999999`, Font Weight 400

**Form Label**
- Font: Interstate, 16px, weight 300
- Color: `#313131`
- Margin Bottom: `8px`
- Display: Block

**Search Input (Header)**
- Background: `#FFFFFF`
- Text Color: `#000000`
- Font: Interstate, 16px, weight 400
- Padding: `12px 16px 12px 40px`
- Width: `400px`
- Border Radius: `0px`
- Border: `1px solid #CCCCCC`
- Height: `40px`
- Search icon: Position left, 12px from edge
- Focus: Border `2px solid #313131`

### Navigation

**Primary Navigation Bar**
- Background: `#000000`
- Text Color: `#FFFFFF`
- Font: Interstate, 16px, weight 400
- Padding: `0px 40px`
- Height: `60px`
- Display: Flex, items center, justify space-between
- Box Shadow: `0px 2px 8px rgba(0, 0, 0, 0.2)`

**Navigation Link**
- Font: Interstate, 16px, weight 400
- Color: `#FFFFFF`
- Text Transform: UPPERCASE
- Letter Spacing: `1px`
- Padding: `8px 16px`
- Border Radius: `0px`
- Hover: Background `#333333`, Color `#FFFFFF`
- Active: Border Bottom `4px solid #AADDDD`

**Dropdown Menu**
- Background: `#FFFFFF`
- Text Color: `#313131`
- Border: `1px solid #E5E5E5`
- Box Shadow: `rgba(49, 49, 49, 0.4) 0px 0px 8px 0px`
- Padding: `12px 0px`
- Position: Absolute, z-index 1000

**Dropdown Item**
- Font: Interstate, 14px, weight 300
- Padding: `12px 20px`
- Color: `#313131`
- Hover: Background `#F5F5F5`, Color `#000000`

### Badges & Labels

**Category Badge**
- Background: `#F0F0F0`
- Text Color: `#313131`
- Font: Interstate, 12px, weight 700
- Padding: `6px 12px`
- Border Radius: `20px`
- Border: `1px solid #E0E0E0`
- Text Transform: UPPERCASE
- Letter Spacing: `0.5px`

## 5. Layout Principles

### Spacing System
- **Base Unit:** `4px`
- **Scale:** `4px, 8px, 12px, 16px, 20px, 24px, 32px, 36px, 40px, 44px, 48px, 60px, 72px`
- **Usage:**
  - Component padding: `16px–32px`
  - Section margins: `48px–72px`
  - Card/container margins: `24px–40px`
  - Small element spacing: `4px–12px`

### Grid & Container
- **Max Width:** `1440px`
- **Grid Columns:** 12-column system
- **Gutter Width:** `24px` (12px on each side)
- **Content Padding:** `40px` (left/right on desktop)
- **Section Patterns:**
  - Hero section: Full-width image + 50/50 text overlay
  - Three-column card grid: Repeating card units with equal spacing
  - Navigation bar: Full-width, fixed positioning

### Whitespace Philosophy
Generous whitespace creates premium feel and guides user attention. Minimum spacing between elements is `12px`; major section breaks use `48px–72px`. Cards breathe with `32px` internal padding; sections have `60px` top/bottom margins. This spaciousness reinforces the "destination experience" positioning.

### Border Radius Scale
- **Sharp (0px):** Navigation, inputs, cards, containers—reflects modern retail aesthetic
- **Rounded Pill (50%):** Small button indicators, carousel controls—adds friendliness
- **Subtle (4px):** Primary buttons, focus states—minimal softening for hierarchy

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Base | No shadow | Flat backgrounds, cards at rest |
| Hover (1) | `0px 2px 8px rgba(49, 49, 49, 0.08)` | Card hover, dropdown open |
| Interaction (2) | `0px 4px 12px rgba(49, 49, 49, 0.12)` | Button active, input focus |
| Elevated (3) | `0px 6px 20px rgba(49, 49, 49, 0.15)` | Featured cards, modal shadows |
| Navigation | `0px 2px 8px rgba(0, 0, 0, 0.2)` | Persistent header bar |
| Dropdown | `rgba(49, 49, 49, 0.4) 0px 0px 8px 0px` | Menu overlays |

**Shadow Philosophy:** Subtle, dark shadows create depth without distraction. All shadows use charcoal with opacity shifts (8%–40%) rather than pure black. Shadows increase on interaction to provide tactile feedback. The dropdown shadow is intentionally heavier to establish clear layering for modal content.

## 7. Do's and Don'ts

### Do
- Use Bodoni (serif) for all headlines to establish editorial authority and luxury positioning
- Maintain high contrast between `#313131` text and `#FFFFFF` backgrounds for accessibility
- Apply padding in multiples of `4px` for consistent rhythm (`16px, 24px, 32px`, etc.)
- Use `#AADDDD` accent color sparingly—reserve for active states and CTAs
- Implement fully rounded buttons (`50%` radius) only for small indicator/pagination controls
- Left-align all body text and form labels for improved readability
- Stack navigation links vertically on mobile and use hamburger menus
- Test all interactive elements at `44px` minimum touch target height
- Use `#999999` for secondary/tertiary text (help text, metadata, disabled states)
- Include focus states with `4px` colored outline for keyboard navigation

### Don't
- Don't mix multiple serif fonts; Bodoni is the only headline typeface
- Don't reduce body text below `16px` on any device
- Don't use `#AADDDD` for body text or secondary content
- Don't apply rounded corners (`border-radius > 0`) to full-width sections or main containers
- Don't reduce line height below `1.2x` font size for body text
- Don't right-align navigation or major headings
- Don't use more than 2 font weights (300, 700) in any single component
- Don't apply shadows to navigation or persistent UI elements (use borders instead)
- Don't use color-only to convey status; pair with icons or text labels
- Don't center-align body text in paragraphs longer than 2 lines

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Mobile | 320px–599px | Single-column layout, hamburger navigation, `16px` padding, buttons full-width |
| Tablet | 600px–1023px | 2-column grid for cards, navigation menu collapses at `768px`, `24px` padding |
| Desktop | 1024px–1439px | 3-column card grid, fixed header navigation, `40px` padding |
| Large Desktop | 1440px+ | Max-width container `1440px` centered, 12-column grid |

### Touch Targets
- **Minimum interactive height:** `44px` (buttons, links, form controls)
- **Minimum interactive width:** `44px` (for small buttons, checkboxes)
- **Spacing between targets:** `8px–12px` minimum to prevent accidental activations
- **Links in body text:** `16px` height minimum with `4px` vertical padding

### Collapsing Strategy
- **Navigation:** Hamburger menu below `768px`; full horizontal menu on desktop
- **Cards:** 1 column (mobile, `<600px`) → 2 columns (tablet, `600–1023px`) → 3 columns (desktop, `>1024px`)
- **Hero Section:** Image above text on mobile; side-by-side 50/50 on desktop
- **Padding:** `16px` (mobile) → `24px` (tablet) → `40px` (desktop)
- **Font Sizes:** Reduce heading sizes by `4px–8px` on mobile; body text stays `16px` minimum
- **Modals:** Full-screen on mobile with `16px` padding; centered on desktop with max-width `600px`

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA / Active State:** Charcoal (`#313131`)
- **Secondary CTA / Inactive:** Light Gray (`#C7C8CA`)
- **Accent Highlight:** Teal (`#AADDDD`)
- **Background / Card Surface:** Off-White (`#FFFFFF`)
- **Primary Text / Heading:** Charcoal (`#313131`)
- **Secondary Text / Label:** Medium Gray (`#999999`)
- **Navigation Background:** Black (`#000000`)
- **Navigation Text:** Off-White (`#FFFFFF`)
- **Disabled / Placeholder:** Dim Gray (`#808080`)
- **Warning / Alert:** Warning Pale (`#FACEB0`)

### Iteration Guide

1. **Typography First:** All headlines use Bodoni (serif, 700 weight); body text uses Interstate (sans-serif, 300 weight). No exceptions.

2. **Spacing Discipline:** Padding always in multiples of `4px`. Common values: `12px, 16px, 24px, 32px, 40px`. Section breaks use `48px–72px`.

3. **High Contrast Always:** Ensure `#313131` or `#000000` text on `#FFFFFF` backgrounds, or vice versa. All text must pass WCAG AA accessibility.

4. **Accent Sparingly:** `#AADDDD` appears only on active navigation indicators, focus states, and primary CTAs—never on body text or secondary content.

5. **Button Consistency:** Primary buttons are `#313131` background with `#FFFFFF` text; secondary are `#FFFFFF` background with `#313131` border; ghost buttons have no background, text-only.

6. **Shadow Depth:** Use subtle shadows (`8%–15%` opacity) for hover/focus states. Dropdown shadows are heavier (`40%` opacity) to establish modal layering.

7. **Border Radius Zero:** Containers, cards, and inputs are sharp-cornered (`0px`). Only small interactive indicators (pagination, checkboxes) use `50%` radius.

8. **Responsive Mobile-First:** Start at `320px`, expand to tablet (`600px`), then desktop (`1024px+`). Cards stack 1→2→3 columns. Navigation hamburger on mobile.

9. **Navigation Fixed:** Header bar is always `#000000` background, `60px` height, full-width with `40px` padding. Links are uppercase `16px` Interstate, all-caps letter-spacing `1px`.

10. **Form Accessibility:** All inputs minimum `44px` height, `16px` font, `1px` black border. Labels inline or above, never placeholder-only. Focus states use `#AADDDD` outline `4px`.