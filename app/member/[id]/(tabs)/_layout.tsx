import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/ui";
import { theme } from "@/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.common.black,
        headerShown: false,
        tabBarStyle: {
          height: 72,
          display: "flex",
          justifyContent: "space-between",
          paddingHorizontal: 3,
          backgroundColor: theme.colors.background.default,
          elevation: 0,
        },
        tabBarIconStyle: {
          width: "100%",
          height: 48,
          marginTop: 7,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              isActive={focused}
              name="home"
              route="Home"
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="membros"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              isActive={focused}
              name="users"
              route="Membros"
              size={20}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saude"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              isActive={focused}
              name="heart"
              route="Saúde"
              size={20}
            />
          ),
        }}
      />
    </Tabs>
  );
}
