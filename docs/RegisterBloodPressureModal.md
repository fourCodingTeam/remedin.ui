# RegisterBloodPressureModal

## Location

`components/layout/Health/modals/RegisterBloodPressureModal.tsx`

## Purpose

Collects systolic/diastolic pressure readings and saves them to the shared `MemberStore`. Presented from the health screen register tiles.

## Props

| Prop        | Type         | Required | Description                                     |
| ----------- | ------------ | -------- | ----------------------------------------------- |
| `isVisible` | `boolean`    | ✅       | Whether the modal is open.                      |
| `onClose`   | `() => void` | ✅       | Invoked to close the sheet (confirm or cancel). |

## Behaviour

- Uses `ModalPageWrapper` for a consistent form layout.
- Captures systolic/diastolic values, measurement time (via `InputDate`) and optional notes.
- On confirm:
  - Concatenates systolic/diastolic (if both non-empty) and calls `setBloodPressure("120/80")` on `useMemberStore`.
  - Always triggers `onClose`.
- Cancel simply invokes `onClose`.

## Structure

- `SideBySideInputs` row with two `InputBase` controls (systolic/diastolic).
- `InputDate` for time-of-measurement (stored as formatted string).
- `InputBase` for additional notes.
- Buttons row with confirm (primary) and cancel (outline).

## Usage

```tsx
<RegisterBloodPressureModal
  isVisible={activeModal === "bloodPressure"}
  onClose={closeModal}
/>
```
