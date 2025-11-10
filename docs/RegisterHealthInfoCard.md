# RegisterHealthInfoCard

## Location

`components/ui/Common/RegisterHealthInfoCard`

## Purpose

Call-to-action card used on the health dashboard to open the various health measurement modals. Designed for quick registration actions such as “Registrar Sintomas” or “Registrar Glicose”.

## Props

| Prop              | Type         | Required | Description                                                                                             |
| ----------------- | ------------ | -------- | ------------------------------------------------------------------------------------------------------- |
| `title`           | `string`     | ✅       | Primary label shown in bold.                                                                            |
| `description`     | `string`     | ❌       | Optional short helper text rendered under the title.                                                    |
| `backgroundColor` | `string`     | ❌       | Card background color (defaults to `theme.colors.background.light`).                                    |
| `borderColor`     | `string`     | ❌       | Outline color. Falls back to `backgroundColor` when omitted.                                            |
| `textColor`       | `string`     | ❌       | CSS color applied to the title (and description when present). Defaults to `theme.colors.text.default`. |
| `iconColor`       | `string`     | ❌       | Color used for the trailing chevron icon. Defaults to `theme.colors.text.default`.                      |
| `onPress`         | `() => void` | ❌       | Callback fired when the user taps the card.                                                             |

## Behaviour

- Internally renders a `TouchableOpacity`.
- Always shows a trailing `ChevronRight` icon.
- Background, border, text and icon colors are fully customizable through props, allowing the card to mimic the coloured tiles shown in the health mocks.

## Example

```tsx
<RegisterHealthInfoCard
  title="Registrar Sintomas"
  backgroundColor={theme.colors.accent.secondary}
  textColor={theme.colors.background.light}
  iconColor={theme.colors.background.light}
  onPress={() => setActiveModal("symptoms")}
/>
```
