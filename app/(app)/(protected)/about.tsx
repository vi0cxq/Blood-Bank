import { View, Text } from "react-native";
import { H3 } from "@/components/ui/typography";

export default function About() {
  return (
    <View className="flex-1 bg-background p-4">
      <H3 className="mb-3">About the App</H3>

      <Text className="leading-normal text-lg">
        This Blood Donation app was developed by{" "}
        <Text className="font-semibold">Boudiba Amani</Text> as part of an
        academic project. Built using Expo and powered by Supabase, the app is
        designed to make it easier for people to request and donate blood within
        their communities. It aims to support faster response times and better
        coordination during urgent medical situations.
      </Text>
    </View>
  );
}
