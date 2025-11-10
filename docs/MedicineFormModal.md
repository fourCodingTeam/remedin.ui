# MedicineFormModal

## Location
`components/layout/MedicineFormModal/MedicineFormModal.tsx`

## Purpose
Full-screen modal that captures data for a new medication schedule (name, dosage, frequency, dates). Triggered from both the member and caregiver views in the Home screen.

## Props
`MedicineFormModalProps`:

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `isVisible` | `boolean` | ✅ | Whether the modal is rendered. |
| `onClose` | `() => void` | ✅ | Called after confirming or cancelling. |

## Behaviour
- Uses `ModalPageWrapper` to mirror the shared form layout.
- Includes inputs for medication name, dosage + dosage unit (`InputSelect`), start/end dates (`InputDate`), frequency and free-text notes.
- `handleAdd` is currently a stub awaiting integration; after future persistence the modal closes via `onClose`.
- `handleCancel` closes immediately without touching navigation (no router usage).

## Layout
- `InputBase` for basic text fields.
- `SideBySideInputsWrapper` to show dosage + select side by side.
- Two `InputDate` pickers for start and end dates.
- Buttons row with “Adicionar” (primary) and “Cancelar” (outline).

## Usage
```tsx
<MedicineFormModal
  isVisible={isMedicineFormModalVisible}
  onClose={() => setIsMedicineFormModalVisible(false)}
/>

