# MultiSelectTag

## Location

`components/ui/MultiSelectTag/MultiSelectTag.tsx`

## Purpose

Pill-like chip component that can be toggled to represent selected filters or tags. Supports close icon and active styles.

## Props (`MultiSelectTagProps`)

| Prop         | Type         | Required | Description                                                         |
| ------------ | ------------ | -------- | ------------------------------------------------------------------- |
| `label`      | `string`     | ✅       | Text displayed inside the tag.                                      |
| `isSelected` | `boolean`    | ❌       | Highlights the tag when true.                                       |
| `onPress`    | `() => void` | ❌       | Handler for toggling selection.                                     |
| `onClose`    | `() => void` | ❌       | When provided, renders a close icon and calls handler when pressed. |
| `disabled`   | `boolean`    | ❌       | Disables touch interactions.                                        |

## Behaviour

- Uses `TouchableOpacity` to handle selection toggles.
- Applies styles from `MultiSelectTag.styles.ts` to display selected and unselected states.
- If `onClose` is provided, renders an inline close (×) button.

## Example

```tsx
<MultiSelectTag
  label="Hipertensão"
  isSelected={selectedTags.includes("hypertension")}
  onPress={() => toggleTag("hypertension")}
/>
```
