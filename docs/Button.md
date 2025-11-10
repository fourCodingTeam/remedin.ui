# Button

## Location

`components/ui/Common/Button/Button.tsx`

## Purpose

Primary button component used throughout the app. Provides size/variant theming, optional icons, loading state, and full-width display.

## Props (`ButtonProps`)

| Prop        | Type                                                                                   | Description                                             |
| ----------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `label`     | `string`                                                                               | Text content.                                           |
| `variant`   | `"primary" \| "secondary" \| "danger" \| "black" \| "neutral" \| "outline" \| "empty"` | Visual style. Defaults to `primary`.                    |
| `size`      | `"sm" \| "md" \| "lg"`                                                                 | Padding & font size configuration. Defaults to `md`.    |
| `fullWidth` | `boolean`                                                                              | Stretches to 100% width ("Confirmar" buttons).          |
| `icon`      | `LucideIcon`                                                                           | Optional leading icon.                                  |
| `textColor` | `StyledTextColor`                                                                      | Overrides the text color. Usually derived from variant. |
| `textSize`  | `StyledTextVariant`                                                                    | Typography variant for the label.                       |
| `isLoading` | `boolean`                                                                              | Displays `ActivityIndicator` instead of label.          |
| `disabled`  | `boolean`                                                                              | Disables press feedback.                                |
| `onPress`   | `() => void`                                                                           | Press handler.                                          |

## Behaviour

- Uses `Button.styles.ts` to set background/border colors based on `variant`.
- When `icon` provided, renders an icon sized by `size`.
- Loading state bypasses `onPress` and shows spinner.

## Example

```tsx
<Button label="Confirmar" variant="primary" fullWidth onPress={handleSubmit} />
```
