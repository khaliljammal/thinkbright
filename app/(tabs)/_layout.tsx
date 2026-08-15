import React from 'react';
import { View, StyleSheet, ColorValue } from 'react-native';
import { Tabs } from 'expo-router';
import { color, font } from '../../src/theme/tokens';

/** The design system's tab icon is a rounded square in the label's own colour. */
function TabMark({ color: c, focused }: { color: ColorValue; focused: boolean }) {
  return <View style={[s.mark, { backgroundColor: c, opacity: focused ? 1 : 0.38 }]} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.ink,
        tabBarInactiveTintColor: color.ink3,
        tabBarStyle: {
          backgroundColor: color.card,
          borderTopColor: color.line,
          borderTopWidth: 1,
          height: 76,
          paddingTop: 9,
        },
        tabBarLabelStyle: { fontFamily: font.sans, fontSize: 10, marginTop: 2 },
        sceneStyle: { backgroundColor: color.paper },
      }}>
      <Tabs.Screen
        name="play"
        options={{ title: 'Play', tabBarIcon: ({ color: c, focused }) => <TabMark color={c} focused={focused} /> }}
      />
      <Tabs.Screen
        name="progress"
        options={{ title: 'Progress', tabBarIcon: ({ color: c, focused }) => <TabMark color={c} focused={focused} /> }}
      />
      <Tabs.Screen
        name="mindage"
        options={{ title: 'Mind Age', tabBarIcon: ({ color: c, focused }) => <TabMark color={c} focused={focused} /> }}
      />
      <Tabs.Screen
        name="you"
        options={{ title: 'You', tabBarIcon: ({ color: c, focused }) => <TabMark color={c} focused={focused} /> }}
      />
    </Tabs>
  );
}

const s = StyleSheet.create({
  mark: { width: 17, height: 17, borderRadius: 5 },
});
