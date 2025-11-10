# TabBarIcon

## Location
`components/ui/TabBarIcon/TabBarIcon.tsx`

## Purpose
Wrapper around Expo Router’s bottom tab icon rendering. Aligns icons + labels horizontally and applies theme colors.

## Props (`TabBarIconProps`)
| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `focused` | `boolean` | ✅ | Whether the tab is active. |
| `title` | `string` | ✅ | Label displayed under the icon. |
| `icon` | `LucideIcon` | ✅ | Icon component from `lucide-react-native`. |

## Behaviour
- Chooses color based on the `focused` flag (active uses `theme.colors.accent.primary`, otherwise `theme.colors.text.muted`).
- Renders the icon above the label with spacing defined in `TabBarIcon.styles.ts`.

## Example
```tsx
<TabBarIcon
  focused={isFocused}
  icon={HomeIcon}
  title="Início"
/>

