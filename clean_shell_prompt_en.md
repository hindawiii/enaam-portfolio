# Clean UI/UX Shell Architecture Prompt (English Master Prompt)

> **How to Use:** Copy this entire prompt into any state-of-the-art AI builder (e.g., Cursor, Claude 3.7 Sonnet, v0 by Vercel, Bolt.new, Windsurf, or ChatGPT) to produce a clean-slate, production-grade documentary photography and editorial storytelling UI shell with zero filler data.

---

```markdown
You are a Principal Software Engineer and Staff UI/UX Architect specializing in luxury editorial digital portfolios, documentary storytelling platforms, and fine-art photography web applications.

OBJECTIVE:
Construct a complete, pristine, and clean-slate UI/UX Architecture (Clean Shell Codebase) for a high-end Documentary Photography & Visual Storytelling Portfolio. The application must feature empty structural slots, clean injection contracts, and zero placeholder/mock junk data, ready for immediate backend or static data hydration.

### 1. Architectural & Technical Foundations
1. **Tech Stack & Standards:**
   - Semantic HTML5, modern CSS3 leveraging CSS Custom Properties (CSS variables), and pristine vanilla ES6+ JavaScript. No unnecessary heavy external UI frameworks.
   - Ultra-fast Express.js static file server configured with long-term immutable caching headers for media assets (`Cache-Control: public, max-age=2592000, immutable`).
   - Clean alias / symlink routing layer for image asset directories to guarantee zero broken encodings on non-ASCII paths.

2. **Native Dynamic Bilingual System (i18n):**
   - Seamless, concurrent support for Arabic (RTL) and English (LTR).
   - Smart automatic browser language detection (`navigator.language`) with fallback and persistent storage in `localStorage`.
   - Single-click elegant language switch trigger in the navigation bar (`lang-toggle`) that dynamically updates document attributes (`dir="rtl"` vs `dir="ltr"` and `lang="ar"` vs `lang="en"`).
   - **STRICT Logical Properties Mandate:** Absolute prohibition of physical CSS directions (`left`, `right`, `margin-left`, `padding-right`, `float: left`). All layout spacing and positioning MUST exclusively use logical CSS properties (`margin-inline-start`, `margin-inline-end`, `padding-inline`, `inset-inline-start`, `inset-inline-end`).
   - Standardized `translations = { ar: { ...keys }, en: { ...keys } }` dictionary binding to UI elements via `data-key` attributes with zero hardcoded visual strings.

### 2. Luxe Pro Editorial Fine-Art Aesthetic
1. **Color System (Warm Charcoal, Champagne Gold, & Ivory):**
   - Deep background canvas: Luxurious warm charcoal (`#0c0f12`).
   - Surface & Card Elevators: Muted dark tones (`#14181c` and `#1b2126`).
   - Accent & Brand Highlight: Understated desert champagne gold (`#c5a059` with subtle glow `rgba(197, 160, 89, 0.2)`).
   - Text Hierarchy: Primary warm ivory (`#f6f3eb`), secondary metallic gray (`#b6bec7`), muted metadata (`#737f8d`).
   - Strict Anti-Slop Directive: Never use stark pure black (`#000000`), glaring neon outlines, or generic saturated gradients.

2. **Typography Hierarchy & Rhythm:**
   - Arabic: 'Cairo' font family (weights 300, 400, 600, 700) with generous line heights (`leading-relaxed` / 1.625) to preserve Arabic diacritics and eliminate vertical clipping.
   - English: Editorial serif/sans combination ('Playfair Display' for editorial emphasis, 'Inter' for UI clarity, and 'Bebas Neue' for bold photographic series indices).

3. **Spatial Cadence & Touch Ergonomics:**
   - Strict 8pt spatial grid (`gap-4`, `p-6`, `p-8`).
   - All interactive touch targets (buttons, links, controls) must satisfy the strict minimum 44px–48px ergonomic touch guideline.
   - Smart Floating Navigation Bar: Automatically translates out of viewport on downward scroll to maximize photo immersion; re-emerges with fluid cubic-bezier transition upon the slightest upward scroll. Includes glassmorphic frost (`backdrop-filter: blur(20px)`).
   - Mobile Off-Canvas Drawer: Cohesive mobile menu containing navigation links, language switcher, and social channels.

### 3. Structural Clean UI Shell Components
Implement the following pristine, empty section shells with semantic containers and shimmer skeleton loaders:
1. **Smart Header & Brand Bar:**
   - Editorial text mark brand logo.
   - Navigation links (Home, About, Portfolio, Mission, Services, Contact).
   - Action cluster (Language Switcher button + Accessible Mobile Hamburger toggle).

2. **Hero Presentation Section:**
   - Semantic taxonomy subtitle slot.
   - Primary bilingual typographic display titles.
   - Action group with primary solid button and secondary ghost button.
   - Smooth scroll indicator with subtle CSS breathing animation.

3. **Editorial About & Profile Section:**
   - Fine-art Passe-partout Matting frame for artist portrait (museum-style layered bevels and deep soft ambient shadows without garish neon borders).
   - Biography narrative copy slots.
   - Numerical impact & statistical grid with separated quantitative metrics.

4. **Dual-Mode Visual Storytelling Portfolio (Core Component):**
   - Live interactive series category filter tabs (Humanitarian, Community, Documentary, Workshops, All).
   - Dual-mode view switcher toggle:
     * **Mode A: Cinematic Story Slider:** High-performance horizontal stage with smooth touch-drag and mouse gestures, ambient backdrop diffusion, dedicated filmstrip thumbnail timeline, digital series counter, and quote caption display.
     * **Mode B: Asymmetric Editorial Bento Mosaic Grid:** Asymmetric hierarchy inspired by bentogrids.com and world-class museum exhibitions (featured Tall Hero Card, square balance cards, panoramic horizontal spans), integrated with smooth skeleton shimmer placeholders, zero-pill metadata, and fluid hover caption reveals.
   - Shimmer skeleton placeholder states on all image containers preventing cumulative layout shifts (CLS).

5. **Pro Lightbox Studio Modal:**
   - Fullscreen darkroom lightbox modal with keyboard navigation (Esc, Arrow Left, Arrow Right), touch swipe, hardware-accelerated zoom controls, and metadata drawer.

6. **Institutional Mission, Professional Services, & Secure Contact:**
   - 4-card mission statement grid.
   - 6-service organizational capability matrix.
   - Accessible contact form with clean input fields, explicit labels, error state styling, and direct mail action.
   - Editorial footer with copyright notice and social links.

### 4. Injection-Ready Clean Data Model
Provide a typed, empty data structure ready for dynamic population:
```javascript
const photoSeriesData = [
  // Ready for hydration:
  // {
  //   id: 'series-slug',
  //   number: '01',
  //   category: 'humanitarian',
  //   tags: ['humanitarian', 'community'],
  //   titleAr: '',
  //   titleEn: '',
  //   subtitleAr: '',
  //   subtitleEn: '',
  //   locationAr: '',
  //   locationEn: '',
  //   date: '2024 - 2025',
  //   folder: 'images/s1',
  //   images: [
  //     { file: 'img 1.jpg', captionAr: '', captionEn: '' }
  //   ]
  // }
];
```

Deliver the code in a single pristine, impeccably organized, and fully functional codebase.
```
