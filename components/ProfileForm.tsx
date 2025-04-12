import { ActivityIndicator, ScrollView, View } from "react-native";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { toast } from "sonner-native";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { phoneNumberSchema } from "@/lib/mobileValidation";
import { cities } from "@/lib/cities";

import { supabase } from "@/config/supabase";
import { updateUserMetadata } from "@/lib/updateUserMetaData";
import { ProfileProps, useSupabase } from "@/stores/supabase-store";
import { colors } from "@/constants/colors";

const formSchema = z.object({
  full_name: z.string().min(2, "Please enter at least 8 characters."),
  gender: z.string().min(2, "Please select your Gender"),
  number_phone: phoneNumberSchema,
  blood_group: z.string(),
  address: z.string().min(2, "Please enter at least 8 characters."),
  wilaya: z.string().min(2, "Please select your Wilaya."),
  donor: z.boolean(),
});

type ProfileFormProps = {
  title: string;
  profile: ProfileProps | null;
};

export default function ProfileForm({ title, profile }: ProfileFormProps) {
  const insets = useSafeAreaInsets();

  const updateProfile = useSupabase((state) => state.updateProfile);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profile?.full_name,
      gender: profile?.gender,
      number_phone: profile?.number_phone,
      blood_group: profile?.blood_group,
      address: profile?.address,
      wilaya: profile?.wilaya,
      donor: profile?.donor,
    },
  });

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select("*")
        .single();

      if (profile) {
        toast.success("Profile Updated", {
          description:
            "Your profile information has been successfully updated.",
          richColors: true,
        });
      } else {
        toast.success("Welcome Aboard! 🎉", {
          description: "Your donor profile is ready to help save lives.",
          richColors: true,
        });

        updateUserMetadata({
          onboarded: true,
        });
      }

      updateProfile(data);

      router.replace("/(app)/(protected)");
    } catch (error: Error | any) {
      console.log(error.message);

      toast.success("Setup Failed", {
        description: "Something went wrong. Please try again.",
        richColors: true,
      });
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.light.background,
        paddingHorizontal: 16,
        paddingTop: profile ? 18 : 64,
      }}
    >
      <ScrollView>
        <H3 className="mb-4"> {title} </H3>

        <Form {...form}>
          <View className="gap-2 mb-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormInput
                  label="Full Name"
                  placeholder="Full Name"
                  autoCapitalize="none"
                  autoCorrect={false}
                  defaultValue={profile ? profile.full_name : undefined}
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <View>
                  <Label nativeID="gender" className="mb-2">
                    Gender
                  </Label>

                  <Select
                    onValueChange={(option) => {
                      field.onChange(option?.value);
                    }}
                    defaultValue={
                      profile
                        ? {
                            value: profile.gender,
                            label: profile.gender,
                          }
                        : undefined
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        className="text-foreground text-sm native:text-lg"
                        placeholder="Select gender"
                      />
                    </SelectTrigger>
                    <SelectContent insets={contentInsets} className="w-full">
                      <SelectGroup>
                        <SelectItem label="Male" value="Male">
                          Male
                        </SelectItem>
                        <SelectItem label="Female" value="Female">
                          Female
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </View>
              )}
            />
            <FormField
              control={form.control}
              name="number_phone"
              render={({ field }) => (
                <FormInput
                  label="Phone"
                  placeholder="05586987"
                  autoCapitalize="none"
                  autoCorrect={false}
                  inputMode="numeric"
                  defaultValue={profile ? profile.number_phone : undefined}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="blood_group"
              render={({ field }) => (
                <View>
                  <Label nativeID="gender" className="mb-2">
                    Blood Group
                  </Label>

                  <Select
                    onValueChange={(option) => {
                      field.onChange(option?.value);
                    }}
                    defaultValue={
                      profile
                        ? {
                            value: profile.blood_group,
                            label: profile.blood_group,
                          }
                        : undefined
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        className="text-foreground text-sm native:text-lg"
                        placeholder="Select Blood Group"
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
              )}
            />

            <FormField
              control={form.control}
              name="wilaya"
              render={({ field }) => (
                <View>
                  <Label nativeID="wilaya" className="mb-2">
                    Wilaya
                  </Label>

                  <Select
                    onValueChange={(option) => {
                      field.onChange(option?.value);
                    }}
                    defaultValue={
                      profile
                        ? {
                            value: profile.wilaya,
                            label: profile.wilaya,
                          }
                        : undefined
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        className="text-foreground text-sm native:text-lg"
                        placeholder="Select Wilaya"
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
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormInput
                  label="Address"
                  placeholder="Address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  defaultValue={profile ? profile.address : undefined}
                  {...field}
                />
              )}
            />
          </View>

          <FormField
            control={form.control}
            name="donor"
            render={({ field }) => (
              <View className="flex-row gap-3 items-center mt-2 mb-6">
                <Checkbox
                  aria-labelledby="donor"
                  checked={field.value}
                  onCheckedChange={(e) => {
                    field.onChange(e);
                  }}
                />
                <Label nativeID="donor">
                  Yes, I'm open to donating blood when needed.
                </Label>
              </View>
            )}
          />
        </Form>
        <Button
          size="default"
          variant="destructive"
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
          className="web:m-4"
        >
          {form.formState.isSubmitting ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text> {profile ? "Update" : "Complete Onboarding"} </Text>
          )}
        </Button>
      </ScrollView>
    </View>
  );
}
