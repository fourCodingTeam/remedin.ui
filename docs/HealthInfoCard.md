# HealthInfoCard

## Location
`components/ui/HealthInfoCard/HealthInfoCard.tsx`

## Purpose
Displays a summarized health metric (weight, height, blood pressure, etc.) with configurable colors and icons. It’s the primary tile used on the Health overview screen.

## Props (`HealthInfoCardProps`)
| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | `string` | ✅ | Label displayed at the top. |
| `value` | `string` | ✅ | Primary metric shown in large font. |
| `unit` | `"kg" \| "cm" \| "mmHg" \| "mg" \| "mmol/L" \| "bpm" \| "mg/dL"` | ❌ | Unit text rendered next to the value. |
| `type` | `"weight" \| "height" \| "bloodPressure" \| "amountOfMedicine" \| "bloodSugar" \| "arterialPressure"` | ✅ | Determines default palette. |
| `icon` | `React.ReactNode` | ❌ | Optional icon rendered in a square background. |
| `color` / `backgroundColor` / `textColor` / `secondaryTextColor` / `borderColor` | `HealthInfoCardColor` | ❌ | Palette overrides (primary/secondary/danger/warning/info/light/dark). |
| `valueTextColor` | `StyledTextColor` | ❌ | Overrides the value color. |

## Behaviour
- Uses internal palette mapping for each `type` when explicit colors are not provided.
- Renders an icon container only when `icon` prop is passed.
- Uses `StyledText` for typography to match design tokens.
- Adapts to the `type` by default (e.g., weight uses secondary background).

## Example
```tsx
<HealthInfoCard
  title="Pressão Arterial"
  value="12 / 8"
  unit="mmHg"
  type="bloodPressure"
/>
```

