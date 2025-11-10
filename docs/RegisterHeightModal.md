# RegisterHeightModal

## Location
`components/layout/Health/modals/RegisterHeightModal.tsx`

## Purpose
Allows the user to change their recorded height within the health flow. Updates `useMemberStore().setHeight`.

## Props
Same `HealthFormModalProps` contract:

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `isVisible` | `boolean` | ✅ | Shows or hides the modal. |
| `onClose` | `() => void` | ✅ | Callback used to close the sheet. |

## Behaviour
- Prefills the height input with the current stored value (if present).
- Persists height as a floating-point value (accepts comma or dot) via `setHeight`.
- Captures measurement date (string from `InputDate`) and optional notes for future use.
- Confirm or cancel always triggers `onClose`.

## Layout
- `InputBase` → “Altura em cm”.
- `InputDate` → “Data da medição”.
- `InputBase` → “Observações”.
- Buttons row with confirm/cancel actions.

## Usage
```tsx
<RegisterHeightModal
  isVisible={activeModal === "height"}
  onClose={closeModal}
/>

