import { TabBarIcon } from "@/components/ui";
import { theme } from "@/constants/theme";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.accent.primary,
        headerShown: false,
        tabBarStyle: {
          height: 99,
          display: "flex",
          justifyContent: "space-between",
          paddingHorizontal: 3,
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
          bottom: -1, // o borderRadius faz ele adicionar uma linha invisível embaixo, por isso o bottom -1
          backgroundColor: theme.colors.common.black,
        },
        tabBarIconStyle: {
          width: "100%",
          height: 36,
          marginTop: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="home"
              color={color}
              isActive={focused}
              route="Home"
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
              name="users"
              color={color}
              isActive={focused}
              route="Membros"
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
              name="heart"
              color={color}
              isActive={focused}
              route="Saúde"
            />
          ),
        }}
      />
    </Tabs>
  );
}
