# InputBase

## Location
`components/ui/Common/Input/InputBase.tsx`

## Purpose
Reusable text input wrapper that sets default font styling, padding and optional prefix/suffix icons. Used by all modal forms.

## Props (`InputBaseProps`)
Extends `TextInputProps` plus:

| Prop | Type | Description |
| --- | --- | --- |
| `prefixIcon` | `IconName` | Optional left icon name (lucide). |
| `suffixIcon` | `IconName` | Optional right icon name (usually calendar/eye). |
| `compact` | `boolean` | Applies reduced vertical padding. |
| `enableFlexOne` | `boolean` | Useful when composing side-by-side layouts. |

## Behaviour
- Renders icons via `StyledIcon` component in `InputBase.styles.ts`.
- Forwards all text input props to React Native `TextInput`.
- Supports disabled and error states through style updates (see styles file).

## Example
```tsx
<InputBase
  placeholder="Peso (kg)"
  value={weight}
  onChangeText={setWeight}
/>
```

