import { useState } from "react";

import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";

import { supabase } from "@/config/supabase";
import { colors } from "@/constants/colors";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import ZeroState from "@/components/ZeroState";

import { toast } from "sonner-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cities } from "@/lib/cities";
import { Search } from "lucide-react-native";
import DonorCard from "@/components/DonorCard";
import { ProfileProps } from "@/stores/supabase-store";

const ItemSeparator = () => <View className="h-4" />;

export default function Donors() {
  const insets = useSafeAreaInsets();

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const [donors, setDonors] = useState<ProfileProps[]>();
  const [loading, setLoading] = useState(false);

  const [bloodGroup, setBloodGroup] = useState("AB-");
  const [wilaya, setWilaya] = useState("Oran");

  const getDonors = async () => {
    try {
      setLoading(true);

      let query = supabase.from("profiles").select("*").eq("donor", true);

      if (wilaya) query = query.eq("wilaya", wilaya);
      if (bloodGroup) query = query.eq("blood_group", bloodGroup);

      const { data, error } = await query;

      setDonors(data as ProfileProps[]);

      setLoading(false);
    } catch (error) {
      return toast.error("Failed to Fetch Blood Requests", {
        description: "An error occurred while retrieving blood requests.",
        richColors: true,
      });
    }
  };

  const handleResetFilters = () => {
    setBloodGroup("");
    setWilaya("");
  };

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
            onPress={getDonors}
          >
            <Search size={18} color={"black"} />
            <Text> Search </Text>
          </Button>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.light.destructive} />
        </View>
      ) : donors?.length === 0 && (wilaya !== "" || bloodGroup !== "") ? (
        <ZeroState resetFn={handleResetFilters} />
      ) : (
        <FlatList
          data={donors}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={ItemSeparator}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }: { item: ProfileProps }) => (
            <DonorCard profile={item} />
          )}
        />
      )}
    </View>
  );
}
