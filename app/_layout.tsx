import "react-native-reanimated";
import "../global.css";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";
import { router, Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { Toaster } from "sonner-native";

import { PortalHost } from "@rn-primitives/portal";

import { DefaultTheme, Theme, ThemeProvider } from "@react-navigation/native";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { NAV_THEME } from "@/lib/constants";

import { View } from "react-native";
import { useSupabase } from "@/stores/supabase-store";

import Mapbox from "@rnmapbox/maps";

const MAPBOX_API_KEY = process.env.EXPO_PUBLIC_MAPBOX_API_KEY as string;

Mapbox.setAccessToken(MAPBOX_API_KEY);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};

export default function RootLayout() {
  const hasMounted = useRef(false);
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  const appIsReady = useSupabase((state) => state.appIsReady);
  const initialized = useSupabase((state) => state.initialized);
  const prepare = useSupabase((state) => state.prepare);
  const session = useSupabase((state) => state.session);
  const user = useSupabase((state) => state.user);
  const getProfile = useSupabase((state) => state.getProfile);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (hasMounted.current) {
      return;
    }
    prepare();
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    if (!initialized || !appIsReady) return;
    const isOnboarded = user?.user_metadata.onboarded;

    getProfile();

    if (session) {
      if (!isOnboarded) {
        return router.replace("/(app)/onboarding");
      } else {
        return router.replace("/(app)/(protected)");
      }
    } else if (!session) {
      return router.replace("/(app)/sign-in");
    }
  }, [initialized, appIsReady, session]);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!loaded && !isColorSchemeLoaded && !appIsReady) {
    return null;
  }

  return (
    <ThemeProvider value={LIGHT_THEME}>
      <StatusBar style={"auto"} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Slot />
        </View>
        <Toaster style={{ borderRadius: 5 }} theme="light" />
        <PortalHost />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
