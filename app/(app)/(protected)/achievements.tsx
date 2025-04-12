import { Button } from "@/components/ui/button";
import { H3 } from "@/components/ui/typography";
import { supabase } from "@/config/supabase";
import { formateTime } from "@/lib/formateTime";
import { useSupabase } from "@/stores/supabase-store";
import { View, Text } from "react-native";
import { toast } from "sonner-native";

export default function Achievements() {
  const profile = useSupabase((state) => state.profile);
  const updateProfile = useSupabase((state) => state.updateProfile);

  const canDonateAgain = () => {
    const lastDonationDate = new Date(profile?.last_donation!);
    const today = new Date();

    const diffTime = today.getTime() - lastDonationDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 120;
  };

  const daysUntilNextDonation = (): number => {
    const lastDonationDate = new Date(profile?.last_donation!);
    const today = new Date();
    const diffTime = today.getTime() - lastDonationDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, 120 - diffDays);
  };

  const makeDonation = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .update({
          last_donation: new Date().toISOString(),
          donations_count: profile ? profile?.donations_count + 1 : 0,
        })
        .eq("id", user.id)
        .select("*")
        .single();

      updateProfile(data);

      toast.success("Donation Recorded", {
        description: "Thank you! Your donation has been successfully logged.",
        richColors: true,
      });
    } catch (error: Error | any) {
      toast.error("Update Failed", {
        description:
          "Something went wrong while recording your donation. Please try again.",
        richColors: true,
      });
    }
  };

  return (
    <View className="flex-1 bg-background p-4">
      {profile?.donations_count !== 0 && profile?.last_donation ? (
        <View className="gap-2">
          {
            <View className="border rounded-md border-destructive">
              <View className="p-4 border-b border-destructive">
                <Text className="font-semibold self-center">
                  {!canDonateAgain()
                    ? " You can donate blood again after"
                    : "Help Someone Again"}
                </Text>
              </View>
              <View className="flex items-center justify-center p-14">
                {!canDonateAgain() ? (
                  <Text className="text-4xl font-semibold text-destructive">
                    {daysUntilNextDonation()}
                  </Text>
                ) : (
                  <Button
                    variant={"destructive"}
                    className="w-3/4"
                    onPress={makeDonation}
                  >
                    <Text className="text-destructive-foreground">
                      I Just Donated Again!
                    </Text>
                  </Button>
                )}
              </View>
            </View>
          }
          <View className="border rounded-md border-destructive">
            <View className="p-4 border-b border-destructive">
              <Text className="font-semibold self-center">Last Donation</Text>
            </View>
            <View className="flex items-center justify-center p-14">
              <Text className="text-4xl font-semibold text-destructive">
                {profile?.last_donation &&
                  formateTime({
                    date: profile?.last_donation!,
                    hours: false,
                  })}
              </Text>
            </View>
          </View>
          <View className="border rounded-md border-destructive">
            <View className="p-4 border-b border-destructive">
              <Text className="font-semibold self-center">Total Donations</Text>
            </View>
            <View className="flex items-center justify-center p-14">
              <Text className="text-4xl font-semibold text-destructive">
                {profile?.donations_count}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View className="flex flex-1 justify-center items-center gap-2">
          <H3>You Haven't Donated Yet</H3>
          <Button
            variant={"destructive"}
            className="w-3/4"
            onPress={makeDonation}
          >
            <Text className="text-destructive-foreground">Record Donation</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
