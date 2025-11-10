# MedicineCheckboxCard

## Location
`components/ui/Common/CheckboxCard/MedicineCheckboxCard.tsx`

## Purpose
Concrete implementation of `CheckboxCard` tailored for medicines. Renders title, schedule label, optional extra lines and status.

## Props (`MedicineCheckboxCardProps`)
Inherits base props plus:

| Prop | Type | Description |
| --- | --- | --- |
| `title` | `string` | Medicine name (e.g. “Dipirona - 1g”). |
| `scheduleLabel` | `string` | Subtitle shown under the title (e.g. “Hoje às 14h”). |
| `statusLabel` | `string` | Optional trailing status (e.g. “Esquecida”). |
| `extraLines` | `string[]` | Additional info lines. |
| `isForgotten` | `boolean` | Adjusts tone to danger by default. |
| `isCompleted` | `boolean` | Adjusts tone to primary when completed. |

## Behaviour
- Determines tone by precedence: explicit `tone` prop > `isForgotten` > `isCompleted` > default `secondary`.
- Uses `StyledText` for typography; adjusts status/text colors when checked.

## Example
```tsx
<MedicineCheckboxCard
  value="medicine-1"
  title="Dipirona - 1g"
  scheduleLabel="Hoje às 14h"
  statusLabel="Esquecida"
  isForgotten
/>
```

