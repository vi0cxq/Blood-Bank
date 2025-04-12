import { colors } from "@/constants/colors";

import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName="sign-in"
    >
      <Stack.Screen name="(protected)" />

      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: false,
          headerTitle: "Sign Up",
          headerStyle: {
            backgroundColor: colors.light.background,
          },
          headerTintColor: colors.light.foreground,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="sign-in"
        options={{
          presentation: "modal",
          headerShown: false,
          headerTitle: "Sign In",
          headerStyle: {
            backgroundColor: colors.light.background,
          },
          headerTintColor: colors.light.foreground,
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
