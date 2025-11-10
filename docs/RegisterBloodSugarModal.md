# RegisterBloodSugarModal

## Location

`components/layout/Health/modals/RegisterBloodSugarModal.tsx`

## Purpose

Modal used on the health screen to register a new glucose measurement. It updates the global `MemberStore` with the latest blood sugar value.

## Props

Inherits `HealthFormModalProps`:

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `isVisible` | `boolean` | ✅ | Controls modal visibility. |
| `onClose` | `() => void` | ✅ | Called when the modal should be dismissed (confirm or cancel). |

## Behaviour

- Wraps content with `ModalPageWrapper`, providing title, description and icon.
- Local state stores the measurement (`value`), measurement time (`measuredAt` as a formatted string) and optional notes.
- On confirm:
  - Parses the value to a float (accepts comma or dot).
  - When valid, calls `useMemberStore().setBloodSugar(parsedValue)`.
  - Always calls `onClose` afterwards.
- On cancel the modal simply calls `onClose`.

## UI Structure

- `InputBase` for the numeric glucose value (required).
- `InputDate` with calendar picker to capture the measurement timestamp.
- `InputBase` for optional observations.
- `ButtonsWrapper` with “Confirmar” (primary) and “Cancelar” (outline) buttons.

## Usage

The health page toggles this modal by setting `activeModal` to `"bloodSugar"` and renders it inside the shared modal stack:

```tsx
<RegisterBloodSugarModal
  isVisible={activeModal === "bloodSugar"}
  onClose={closeModal}
/>
```
