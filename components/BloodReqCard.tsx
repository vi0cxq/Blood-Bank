import { View, Text } from "react-native";
import { H4 } from "@/components/ui/typography";
import { formateTime } from "@/lib/formateTime";

type BloodReqProps = {
  phone_number: string;
  address: string;
  wilaya: string;
  blood_group: string;
  description: string;
  created_at: Date;
  user_name: string;
};

export default function BloodReqCard({
  description,
  phone_number,
  address,
  blood_group,
  created_at,
  user_name,
}: BloodReqProps) {
  return (
    <View className="flex  flex-row gap-4 h-64 rounded-md p-4 bg-secondary">
      <View className="h-full w-32 bg-destructive/50 flex items-center justify-center rounded-md">
        <View className="h-24 w-24 rounded-md bg-destructive/70 flex items-center justify-center">
          <Text className="text-background font-semibold text-4xl">
            {blood_group}
          </Text>
        </View>
      </View>
      <View className="flex-1 gap-2">
        <View className="flex pb-2 border-b border-foreground/10">
          <H4 className="-ml-1"> {user_name} </H4>
          <Text className="text-muted-foreground text-sm">
            {formateTime({
              hours: true,
              date: created_at,
            })}
          </Text>
        </View>
        <View className="flex justify-between flex-1">
          <View className="flex">
            <Text className="font-semibold text-sm uppercase">
              Looking For :
            </Text>
            <Text className="text-muted-foreground text-sm">{description}</Text>
          </View>
          <View className="flex flex-row justify-between">
            <View className="flex">
              <Text className="font-semibold text-sm uppercase">Contact</Text>
              <Text className="text-muted-foreground text-sm">
                {phone_number}
              </Text>
            </View>
            <View className="flex">
              <Text className="font-semibold text-sm uppercase">address</Text>
              <Text className="text-muted-foreground text-sm"> {address} </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
