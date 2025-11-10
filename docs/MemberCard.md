# MemberCard

## Location
`components/ui/MemberCard/MemberCard.tsx`

## Purpose
Touchable card used in the Members list to display user information (name, phone number, avatar) and navigate to member-specific screens. Highlights the logged-in user.

## Props (`MemberCardProps`)
| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `number` | ✅ | Member identifier. Used to check whether the card belongs to the signed-in user. |
| `name` | `string` | ✅ | Display name. |
| `phoneNumber` | `string \| null` | ❌ | Phone; formatted with `useFormatPhoneNumber`. |
| `avatar` | `ImageSourcePropType \| string` | ❌ | Photo to display inside `Avatar`. Accepts remote URL (string) or image source. |
| `onPress` | `() => void` | ❌ | Called when the card is tapped. |
| `isUser` | `boolean` | ❌ | Forces primary accent highlight when true. |

## Behaviour
- Uses `useUserStore()` to obtain the current user ID and adjust background color (`theme.colors.accent.primary` for the current user, otherwise secondary accent).
- Displays `Avatar` on the left and a `ChevronRight` icon on the right.
- Formats phone numbers with the `useFormatPhoneNumber` hook (`"(xx) xxxxx-xxxx"`).
- Accepts `isUser` prop to override highlight logic (useful when viewing self in lists).

## Example
```tsx
<MemberCard
  id={member.id}
  name={member.name}
  phoneNumber={member.phone}
  avatar={member.avatarUrl}
  onPress={() => router.push(`/member/${member.id}`)}
/>
```

