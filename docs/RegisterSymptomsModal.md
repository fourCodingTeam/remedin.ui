# RegisterSymptomsModal

## Location
`components/layout/Health/modals/RegisterSymptomsModal.tsx`

## Purpose
Reusable modal for logging current symptoms from the health dashboard. Currently keeps data client-side for future integration.

## Props
| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `isVisible` | `boolean` | ✅ | Determines if the modal is displayed. |
| `onClose` | `() => void` | ✅ | Function invoked to close the modal on confirm or cancel. |

## Behaviour
- Provides text inputs for symptom description and optional notes, plus a date picker for the onset time.
- Confirmation logic currently acts as a placeholder (ready for API integration). After potential persistence, `onClose` is executed.
- Cancel button simply closes the modal without side effects.

## Layout
- `InputBase` – “Quais sintomas?”
- `InputDate` – “Quando começou?”
- `InputBase` – “Observações adicionais”
- Action buttons: “Confirmar” (primary) and “Cancelar” (outline).

## Usage
```tsx
<RegisterSymptomsModal
  isVisible={activeModal === "symptoms"}
  onClose={closeModal}
/>

