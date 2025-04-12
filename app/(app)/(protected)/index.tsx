import { Button } from "@/components/ui/button";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  ScrollView,
  InteractionManager,
} from "react-native";

import BloodReqCard from "@/components/BloodReqCard";
import { useCallback, useState } from "react";
import { supabase } from "@/config/supabase";
import { colors } from "@/constants/colors";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cities } from "@/lib/cities";
import { FunnelX, Plus } from "lucide-react-native";
import ZeroState from "@/components/ZeroState";
import { toast } from "sonner-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSupabase } from "@/stores/supabase-store";
import { router } from "expo-router";

const ItemSeparator = () => <View className="h-4" />;

type BloodRequestResponse = {
  id: string;
  phone_number: string;
  address: string;
  wilaya: string;
  blood_group: string;
  description: string;
  created_at: Date;
  profiles: {
    full_name: string;
  };
};

export default function Home() {
  const insets = useSafeAreaInsets();

  const { session } = useSupabase();

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const [requests, setRequests] = useState<BloodRequestResponse[]>();
  const [loading, setLoading] = useState(true);

  const [bloodGroup, setBloodGroup] = useState("");
  const [wilaya, setWilaya] = useState("");

  const getRequests = async () => {
    try {
      let query = supabase.from("blood_requests").select(`
        *,
        profiles (
          full_name
        )
      `);

      if (wilaya) query = query.eq("wilaya", wilaya);
      if (bloodGroup) query = query.eq("blood_group", bloodGroup);

      query = query.order("created_at", { ascending: false });

      const { data } = await query;

      setRequests(data as BloodRequestResponse[]);

      setLoading(false);
    } catch (error) {
      return toast.error("Failed to Fetch Blood Requests", {
        description: "An error occurred while retrieving blood requests.",
        richColors: true,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        getRequests();
      });

      return () => task.cancel();
    }, [wilaya, bloodGroup, session])
  );

  const handleResetFilters = () => {
    setBloodGroup("");
    setWilaya("");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.light.destructive} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-4">
      <View className="mb-4 flex flex-row gap-2">
        <View className="flex-1">
          <Select
            onValueChange={(option) => {
              setBloodGroup(option?.value!);
            }}
            key={bloodGroup}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                className="text-foreground text-sm native:text-lg"
                placeholder={bloodGroup ? bloodGroup : "Select Blood Group"}
                key={bloodGroup}
              />
            </SelectTrigger>
            <SelectContent insets={contentInsets} className="w-full">
              <ScrollView className="max-h-48">
                <SelectGroup>
                  <SelectItem label="A+" value="A+">
                    A+
                  </SelectItem>
                  <SelectItem label="A-" value="A-">
                    A-
                  </SelectItem>
                  <SelectItem label="B+" value="B+">
                    B+
                  </SelectItem>
                  <SelectItem label="B-" value="B-">
                    B-
                  </SelectItem>
                  <SelectItem label="AB+" value="AB+">
                    AB+
                  </SelectItem>
                  <SelectItem label="AB-" value="AB-">
                    AB-
                  </SelectItem>
                  <SelectItem label="O+" value="O+">
                    O+
                  </SelectItem>
                  <SelectItem label="O-" value="o-">
                    O-
                  </SelectItem>
                </SelectGroup>
              </ScrollView>
            </SelectContent>
          </Select>
        </View>
        <View className="flex-1">
          <Select
            onValueChange={(option) => {
              setWilaya(option?.value!);
            }}
            key={wilaya}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                className="text-foreground text-sm native:text-lg"
                placeholder={wilaya ? wilaya : "Select Wilaya"}
                key={wilaya}
              />
            </SelectTrigger>
            <SelectContent insets={contentInsets} className="w-full">
              <ScrollView className="max-h-48">
                <SelectGroup>
                  {cities.map((city) => (
                    <SelectItem label={city} value={city} key={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </ScrollView>
            </SelectContent>
          </Select>
        </View>
        <View>
          <Button
            variant={"outline"}
            className="flex flex-row items-center gap-2"
            onPress={handleResetFilters}
          >
            <FunnelX size={18} color={"black"} />
            <Text>Reset</Text>
          </Button>
        </View>
      </View>

      {requests?.length === 0 ? (
        <ZeroState resetFn={handleResetFilters} />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={ItemSeparator}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }: { item: BloodRequestResponse }) => (
            <BloodReqCard
              blood_group={item.blood_group}
              description={item.description}
              phone_number={item.phone_number}
              address={item.address}
              wilaya={item.wilaya}
              created_at={item.created_at}
              user_name={item.profiles.full_name}
            />
          )}
        />
      )}

      <Button
        variant={"destructive"}
        className="size-16 flex items-center justify-center absolute bottom-10 right-7 elevation-md rounded-full"
        size={"icon"}
        onPress={() => {
          router.push("/(app)/(protected)/create_blood_request");
        }}
      >
        <Plus size={24} color="white" />
      </Button>
    </View>
  );
}
