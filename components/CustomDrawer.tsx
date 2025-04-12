import { colors } from "@/constants/colors";

import { formateTime } from "@/lib/formateTime";
import { useSupabase } from "@/stores/supabase-store";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";

import { router } from "expo-router";
import { CalendarClock, Droplets, Info, LogOut } from "lucide-react-native";
import { View, Text } from "react-native";

export const CustomDrawer = (props: DrawerContentComponentProps) => {
  const profile = useSupabase((state) => state.profile);
  const signOut = useSupabase((state) => state.signOut);

  const formattedDate = profile?.last_donation
    ? formateTime({
        hours: false,
        date: profile.last_donation,
      })
    : "Not Yet!";

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        marginLeft: 0,
        paddingStart: 0,
        paddingEnd: 0,
        justifyContent: "space-between",
        flex: 1,
        borderRadius: 0,
      }}
    >
      <View className="justify-start">
        <View className="w-full h-fit flex gap-2 pb-2 border-b border-muted-foreground/35">
          <View className="h-28 bg-destructive w-28 rounded-full self-center"></View>
          <View className="flex">
            <Text className="self-center text-lg font-semibold ">
              {profile?.full_name}
            </Text>
            <View className="flex flex-row mt-2 px-4">
              <View className="flex-1 flex-row px-2 py-2 items-center gap-1.5">
                <Droplets color={colors.light.destructive} size={28} />

                <View className="flex">
                  <Text className="font-semibold">
                    {profile?.donations_count}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    Donation
                  </Text>
                </View>
              </View>
              <View className="flex-1 flex-row px-2 items-center gap-1.5">
                <CalendarClock color={colors.light.destructive} size={26} />

                <View className="flex">
                  <Text className="font-semibold -ml-1"> {formattedDate} </Text>
                  <Text className="text-xs text-muted-foreground">
                    Last Donation
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="mt-2">
          <DrawerItemList {...props} />
        </View>
      </View>
      <View>
        <DrawerItem
          label="About"
          icon={() => <Info size={20} color={colors.light.foreground} />}
          onPress={() => {
            router.push("/(app)/(protected)/about");
          }}
          focused={props.state.index === 5}
          activeTintColor={colors.light.destructive}
          style={{
            borderRadius: 0,
          }}
        />
        <DrawerItem
          label="Logout"
          icon={() => <LogOut size={20} color={colors.light.destructive} />}
          onPress={async () => {
            await signOut();
          }}
          activeTintColor={colors.light.destructive}
          style={{
            borderRadius: 0,
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
};
