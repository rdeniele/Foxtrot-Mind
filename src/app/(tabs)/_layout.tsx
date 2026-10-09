import { Tabs } from 'expo-router';
import React from 'react';

import { BottomNav } from '@/components/ui';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <BottomNav state={props.state} navigation={props.navigation} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="talk" />
      <Tabs.Screen name="library" />
      <Tabs.Screen name="progress" />
    </Tabs>
  );
}
