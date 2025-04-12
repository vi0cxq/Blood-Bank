import React from "react";
import { Drawer } from "expo-router/drawer";

import {
  CircleUser,
  HomeIcon,
  Hospital,
  Medal,
  UsersRound,
} from "lucide-react-native";
import { Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { colors } from "@/constants/colors";
import { CustomDrawer } from "@/components/CustomDrawer";

export default function ProtectedLayout() {
  const iconSize = 20;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawer}
        detachInactiveScreens={false}
        screenOptions={{
          drawerActiveTintColor: colors.light.destructive,
          drawerType: "front",
          drawerStyle: {
            width: Dimensions.get("window").width / 1.3,
            borderRadius: 0,
            paddingTop: 15,
          },
          drawerContentStyle: {
            borderRadius: 0,
          },
          drawerItemStyle: {
            borderRadius: 0,
          },
          headerStyle: {
            backgroundColor: colors.light.destructive,
          },
          headerTintColor: colors.light.background,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Home",
            title: "Blood Bank",

            drawerIcon: ({ color }) => (
              <HomeIcon color={color} size={iconSize} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: "Profile",
            title: "Profile",
            drawerIcon: ({ color }) => (
              <CircleUser color={color} size={iconSize} />
            ),
          }}
        />
        <Drawer.Screen
          name="achievements"
          options={{
            drawerLabel: "Achievements",
            title: "Achievements",
            drawerIcon: ({ color }) => <Medal color={color} size={iconSize} />,
          }}
        />
        <Drawer.Screen
          name="hospitals"
          options={{
            drawerLabel: "Hospitals",
            title: "Hospitals",
            drawerIcon: ({ color }) => (
              <Hospital color={color} size={iconSize} />
            ),
          }}
        />
        <Drawer.Screen
          name="donors"
          options={{
            drawerLabel: "Donors",
            title: "Donors",
            drawerIcon: ({ color }) => (
              <UsersRound color={color} size={iconSize} />
            ),
          }}
        />
        <Drawer.Screen
          name="about"
          options={{
            drawerLabel: "About",
            title: "About",
            drawerIcon: ({ color }) => (
              <UsersRound color={color} size={iconSize} />
            ),
            drawerItemStyle: {
              display: "none",
            },
          }}
        />
        <Drawer.Screen
          name="create_blood_request"
          options={{
            drawerLabel: "Post Blood Request",
            title: "Post Blood Request",
            drawerIcon: ({ color }) => (
              <UsersRound color={color} size={iconSize} />
            ),
            drawerItemStyle: {
              display: "none",
            },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
