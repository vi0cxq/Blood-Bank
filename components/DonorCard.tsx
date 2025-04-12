import { Button } from "@/components/ui/button";
import { ProfileProps, useSupabase } from "@/context/supabase-provider";
import { View, Text } from "react-native";
import { H4 } from "@/components/ui/typography";
import { formateTime } from "@/lib/formateTime";

export default function DonorCard({ profile }: { profile: ProfileProps }) {
  const {
    blood_group,
    full_name,
    last_donation,
    donations_count,
    number_phone,
    wilaya,
  } = profile;

  return (
    <View className="flex  flex-row gap-4 h-52 rounded-md p-4 bg-secondary">
      <View className="h-full w-32 bg-destructive/50 flex items-center justify-center rounded-md">
        <View className="h-24 w-24 rounded-md bg-destructive/70 flex items-center justify-center">
          <Text className="text-background font-semibold text-4xl">
            {blood_group}
          </Text>
        </View>
      </View>
      <View className="flex-1 gap-2">
        <View className="flex pb-2 border-b border-foreground/10">
          <H4 className="-ml-1"> {full_name} </H4>

          <View className="flex flex-row gap-2">
            <Text className="text-sm uppercase text-muted-foreground">
              Total Donations :
            </Text>
            <Text className="font-semibold text-sm">{donations_count}</Text>
          </View>
        </View>
        <View className="flex flex-1 gap-2">
          <View className="flex">
            <Text className="font-semibold text-sm uppercase">
              Last Donation :
            </Text>
            <Text className="text-muted-foreground text-sm">
              {formateTime({
                hours: true,
                date: last_donation,
              })}
            </Text>
          </View>
          <View className="flex flex-row gap-2">
            <Text className="font-semibold text-sm uppercase">Contact :</Text>
            <Text className="text-muted-foreground text-sm">
              {number_phone}
            </Text>
          </View>
          <View className="flex flex-row gap-2">
            <Text className="font-semibold text-sm uppercase">Wilaya :</Text>
            <Text className="text-muted-foreground text-sm">{wilaya}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
