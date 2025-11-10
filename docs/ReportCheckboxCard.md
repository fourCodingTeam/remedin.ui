# ReportCheckboxCard

## Location

`components/ui/Common/CheckboxCard/ReportCheckboxCard.tsx`

## Purpose

Specialized `CheckboxCard` used for selecting reports. Displays title, description and an optional badge (status).

## Props

| Prop                                                          | Type     | Required                            | Description                           |
| ------------------------------------------------------------- | -------- | ----------------------------------- | ------------------------------------- |
| `value`                                                       | `string` | ✅                                  | Identifier passed to callbacks.       |
| `title`                                                       | `string` | ✅                                  | Report name.                          |
| `description`                                                 | `string` | ✅                                  | Supporting text under the title.      |
| `badge`                                                       | `string` | ❌                                  | Optional label rendered on the right. |
| `onPress` / `onChange` / `checked` / `tone` / `disabled` etc. | –        | Inherited from `CheckboxCardProps`. |

## Behaviour

- Uses the `CheckboxCard` render prop to structure content with `StyledText`.
- When `badge` provided, shows inline `StyledText` aligned to the right.
- Tone defaults to `"neutral"` but can be overridden.

## Example

```tsx
<ReportCheckboxCard
  value="report-summary"
  title="Relatórios Semanais"
  description="Receba seu resumo semanal por e-mail"
  badge="Novo"
  onPress={handleSelect}
/>
```
