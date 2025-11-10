# EditPersonalInformationModal

## Location
`components/layout/Health/modals/EditPersonalInformationModal.tsx`

## Purpose
Modal used to update personal information (name, age, weight, height) from the health management screen. Synchronises changes with `useMemberStore`.

## Props
| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `isVisible` | `boolean` | ✅ | Indicates if the modal is open. |
| `onClose` | `() => void` | ✅ | Closes the modal after confirm/cancel. |

## Behaviour
- Prefills form fields with data fetched from `MemberStore` (`member.name`, `weight`, `height`).
- On confirm:
  - Calls `setMember` with an updated name.
  - Parses weight/height fields (comma or dot allowed) and persists via `setWeight` / `setHeight`.
  - Triggers `onClose`.
- Cancel also calls `onClose` without persisting changes.

## Layout
- `InputBase` controls for name, age, weight (kg) and height (cm).
- Buttons row with “Confirmar” (primary) and “Cancelar”.

## Example
```tsx
<EditPersonalInformationModal
  isVisible={activeModal === "personal"}
  onClose={closeModal}
/>

