# OmniShop 360 Design System Reference

This document details the visual specifications and design tokens for OmniShop 360.

## Color Palette (Design Tokens)

The following CSS variables must be used for theming:

```css
:root {
  --color-primary: #2F7EDA;
  --color-primary-hover: #1A5FB4;
  --color-primary-light: #EBF3FC;
  --color-success: #51BC8F;
  --color-success-light: #E8F8F0;
  --color-warning: #FCA103;
  --color-warning-light: #FFF5E0;
  --color-error: #D93E3E;
  --color-error-light: #FDECEC;
  --color-surface: #FFFFFF;
  --color-background: #FCFDFD;
  --color-sidebar: #F8F9FA;
  --color-border: #C6D1D7;
  --color-text-primary: #555663;
  --color-text-secondary: #676C73;
}
```

## Typography

**Primary Font:** Inter (Fallback: Roboto)

| Level | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Heading 1** | 32px | SemiBold (600) | 40px | Page Titles |
| **Heading 2** | 24px | Medium (500) | 32px | Card or Section Titles |
| **Heading 3** | 20px | Medium (500) | 28px | Subtitles, Table Headers |
| **Body** | 16px | Regular (400) | 24px | Standard text, descriptions |
| **Small** | 14px | Medium (500) | 20px | Labels, badges |
| **Caption** | 12px | Regular (400) | 16px | Help text, timestamps |

## Spacing

| Token | Value | Usage |
| :--- | :--- | :--- |
| `space-1` | 4px | Minimal spacing |
| `space-2` | 8px | Badge padding |
| `space-3` | 12px | Compact button padding |
| `space-4` | 16px | Standard card/input padding |
| `space-5` | 20px | Form section spacing |
| `space-6` | 24px | Main card padding |
| `space-8` | 32px | Major section spacing |
| `space-10`| 40px | Page title top margin |

## Components

### Buttons
- **Primary:** Gradient fill, `border-radius: 8px` (12px for `md` corners in Atelier style), min height 60px for POS. Hover: `scale(1.02)` or upward shift.
- **Secondary:** Transparent background, primary border, primary text.
- **Ghost:** Transparent background, no border, primary text.

### Cards
- `border-radius: 12px`
- Background: `#FCFDFD`
- Border: `1px solid #C6D1D7`
- Shadow: `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06)`

### Inputs (Glass Style)
- Background: Semi-transparent `surface_container_low`.
- Border: 1px "Ghost Border" (`outline-variant` at 20% opacity).
- Focus: Solid `#ffffff` background, primary border (`2px solid #2F7EDA`), outer shadow ring.

### DataTables
- Use PrimeNG DataTables.
- Sticky header, pagination (20 rows), global filter.
- Striped rows with light background (`#FAFBFC`).
- On mobile (< 640px), replace with vertically stacked cards.

### Modals
- Backdrop: `rgba(0, 0, 0, 0.4)`
- Border radius: 16px
- Animation: Fade in + slight upward translation (150ms).
- Mobile: Bottom Sheet pattern.
