# TDCalendar (ClickableThreeDayCalendar)

## Location
`components/ui/ClickableThreeDayCalendar/TDCalendar.tsx`

## Purpose
Renders a horizontally scrollable three-day calendar widget used on the home and health screens to quickly pick nearby dates. Displays the selected day with a distinct background.

## Props (`TDCalendarProps`)
| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `date` | `Date` | ✅ | Current selected date. |
| `onDateChange` | `(date: Date) => void` | ✅ | Called when the user taps a day tile. |

## Behaviour
- Creates a list of day objects centered on the given `date`.
- Allows swiping to navigate forward/backward by one day.
- Highlights the active item (`isSelected`) and applies a press effect via `TouchableOpacity`.
- Relies on `TDCalendar.styles.ts` for layout/styling.

## Usage
```tsx
<TDCalendar
  date={selectedDate}
  onDateChange={setSelectedDate}
/>

