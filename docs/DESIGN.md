# Design System Strategy: The Digital Atelier

## 1. Overview & Creative North Star: "The Digital Atelier"
This design system moves away from the rigid, boxy constraints of traditional B2B SaaS. Our Creative North Star is **The Digital Atelier**: a space that feels curated, bespoke, and high-end, yet possesses the industrial strength required for multi-tenant retail operations. 

We achieve a "signature" look by rejecting standard grid-and-line layouts. Instead, we use **intentional asymmetry**, **glassmorphism**, and **tonal depth**. The UI should feel like a series of layered, frosted panes floating in a clean, airy gallery. We prioritize breathing room over information density, ensuring that even the most complex retail data feels manageable and premium.

---

## 2. Color & Tonal Architecture
The palette is rooted in "Blue Jeans" Primary (`#005cad`) and sophisticated neutrals. We do not use color merely for decoration; we use it to define architecture.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off the UI. 
*   **How to define boundaries:** Use background color shifts. A `surface-container-low` section sitting on a `surface` background provides enough contrast to define a zone without the "cheapening" effect of a stroke.
*   **The Exception:** Only use the `outline-variant` token at 15% opacity when absolute containment is required for high-density POS data.

### Surface Hierarchy & Nesting
Treat the UI as physical layers. Use the following tiers to create depth:
1.  **Background (`#fbf8ff`):** The canvas.
2.  **Surface-Container-Low (`#f4f2ff`):** Secondary areas like sidebars or inactive panels.
3.  **Surface-Container-Lowest (`#ffffff`):** The primary workspace or "active" cards. This creates a natural "pop" against the lower tiers.

### The Glass & Gradient Rule
To achieve the "Modern SaaS" signature:
*   **Glassmorphism:** For floating modals, dropdowns, and navigation overlays, use `surface` with 80% opacity and a `20px` backdrop-blur. 
*   **Signature Textures:** Main CTAs and high-level Analytics Cards should use a subtle linear gradient from `primary` (`#005cad`) to `primary_container` (`#2075d0`) at a 135-degree angle. This adds "soul" and depth that a flat hex code cannot provide.

---

## 3. Typography: Editorial Authority
We use **Inter** to create a high-contrast, editorial feel. The hierarchy is aggressive to ensure clarity in fast-paced retail environments.

*   **Display & Headline Scales:** Used for high-level store metrics and branding. These should have tight letter-spacing (-0.02em) to look "custom."
*   **Title Scales:** Used for product names and section headers. Bold weights are mandatory here to anchor the user's eye.
*   **Body & Labels:** Optimized for legibility. Use `on-surface-variant` (`#414752`) for secondary body text to maintain a soft, high-end contrast.

**Hierarchy Note:** Always pair a `headline-lg` with a `body-md` secondary description. This "Large-Small" pairing mimics premium fashion magazines and removes the "standard dashboard" feel.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often messy. We use **Tonal Layering** to convey importance.

*   **The Layering Principle:** Instead of a shadow, place a `surface_container_lowest` (`#ffffff`) card on top of a `surface_dim` (`#d9d9e8`) background. The color difference provides the elevation.
*   **Ambient Shadows:** For "Floating" elements (like a POS payment trigger), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(25, 27, 38, 0.05);`. The shadow must be a tinted version of our `on-surface` color, never pure black.
*   **The Ghost Border:** If a border is required for accessibility, it must be the `outline-variant` token at 20% opacity. High-contrast, 100% opaque borders are forbidden.

---

## 5. Signature Components

### Buttons & Touch Targets
*   **Primary:** Gradient fill (`primary` to `primary_container`), 12px (`md`) corners. 
*   **POS Optimization:** For mobile/tablet POS interfaces, buttons must have a **minimum height of 60px**.
*   **Micro-interaction:** On hover, buttons should shift +2px upward with a subtle increase in shadow spread to simulate physical "lift."

### Cards & Lists
*   **The Anti-Divider Rule:** Forbid the use of horizontal rules (`<hr>`). Separate list items using 12px of vertical white space or a very subtle toggle between `surface` and `surface-container-low` backgrounds.
*   **Interaction:** Cards should utilize a `scale(1.02)` transition on hover to feel responsive and "alive."

### Glass Input Fields
*   **Style:** Inputs should use a semi-transparent `surface_container_low` background with a 1px "Ghost Border." 
*   **Focus State:** On focus, the border transitions to `primary` and the background becomes solid `#ffffff`.

### POS Action Chips
*   **Context:** Selection of sizes, colors, or quantities.
*   **Style:** Large (`lg` 1rem corner radius), using `primary_fixed` (`#d5e3ff`) for inactive states and `primary` with white text for active states.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use white space as a structural element. If a screen feels cluttered, add 24px of padding rather than a divider line.
*   **Do** use asymmetrical layouts for dashboards (e.g., a wide 2/3 column for main data and a slim 1/3 column for "Quick Actions").
*   **Do** prioritize "Mobile-First" logic. If a component doesn't work at a 60px touch-target size, it must be redesigned.

### Don’t
*   **Don't** use pure black (`#000000`) for text or shadows. It breaks the "Atelier" softness.
*   **Don't** use standard "out-of-the-box" Tailwind shadows (`shadow-md`). Use our custom Ambient Shadow values.
*   **Don't** clutter the sidebar. Use `surface-container-low` and hide secondary nav items behind a "More" trigger to maintain minimalism.