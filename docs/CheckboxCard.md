# CheckboxCard

## Location
`components/ui/Common/CheckboxCard/CheckboxCard.tsx`

## Purpose
Base wrapper for checkbox-styled cards used in medication lists. Exposes render props for custom content while handling pressed/checked states and tone theming.

## Props (`CheckboxCardProps`)
| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string` | ✅ | Identifier passed to `onChange` / `onPress`. |
| `tone` | `"neutral" \| "primary" \| "secondary" \| "danger"` | ❌ | Determines color palette; default `neutral`. |
| `checked` | `boolean` | ❌ | Controlled checked state. |
| `defaultChecked` | `boolean` | ❌ | Initial value for uncontrolled usage. |
| `disabled` | `boolean` | ❌ | Disables press interactions. |
| `onChange` | `(value: string, checked: boolean) => void` | ❌ | Fired when the checkbox toggles. |
| `onPress` | `(value: string, checked: boolean) => void` | ❌ | Called alongside `onChange`. |
| `renderRightAccessory` | `(ctx: CheckboxCardRenderProps) => React.ReactNode` | ❌ | Custom trailing content; defaults to square checkbox. |
| `children` | `(ctx: CheckboxCardRenderProps) => React.ReactNode` | ✅ | Render prop for card body (receives `checked`, `textColor`, `secondaryTextColor`). |

## Behaviour
- Maintains internal state when `checked` prop omitted.
- Applies tone-specific background/border/text colors defined in `CheckboxCard.styles.ts`.
- Default accessory is a square checkbox that fills when active.

## Example
```tsx
<CheckboxCard value="medicine-1" tone="secondary" onChange={handleChange}>
  {({ textColor, secondaryTextColor }) => (
    <View>
      <StyledText color={textColor}>Dipirona - 1g</StyledText>
      <StyledText color={secondaryTextColor}>Hoje às 14h</StyledText>
    </View>
  )}
</CheckboxCard>
```

