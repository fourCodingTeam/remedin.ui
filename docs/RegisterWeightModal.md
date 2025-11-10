# RegisterWeightModal

## Location

`components/layout/Health/modals/RegisterWeightModal.tsx`

## Purpose

Modal invoked from the health dashboard to update the member’s weight. Writes the value to `useMemberStore().setWeight`.

## Props

| Prop        | Type         | Required | Description                          |
| ----------- | ------------ | -------- | ------------------------------------ |
| `isVisible` | `boolean`    | ✅       | Controls visibility.                 |
| `onClose`   | `() => void` | ✅       | Closes the modal (confirm + cancel). |

## Behaviour

- Prefills the weight field with the current value from the store (if any).
- Stores local state for weight, measurement timestamp and notes (timestamp kept as formatted string from `InputDate`).
- On confirm parses the numeric field (accepts comma or dot). When valid, calls `setWeight(parsedValue)` and closes.
- Cancel simply calls `onClose`.

## Structure

- `InputBase` fields for weight and optional observations.
- `InputDate` for “Data e horário da medição”.
- Buttons row with “Confirmar” (primary) and “Cancelar”.

## Usage

```tsx
<RegisterWeightModal
  isVisible={activeModal === "weight"}
  onClose={closeModal}
/>
```
