import { ActivityIndicator, ScrollView, View } from "react-native";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { Textarea } from "~/components/ui/textarea";
import { phoneNumberSchema } from "@/lib/mobileValidation";
import { cities } from "@/lib/cities";

import { supabase } from "@/config/supabase";

import { useSupabase } from "@/stores/supabase-store";
import { router } from "expo-router";

const formSchema = z.object({
  description: z
    .string()
    .max(160, "Please make it short.")
    .min(10, "Please enter at least 10 characters."),
  number_phone: phoneNumberSchema,
  blood_group: z.string(),
  address: z.string().min(2, "Please enter at least 8 characters."),
  wilaya: z.string().min(2, "Please select your Wilaya."),
});

export default function BloodRequestForm() {
  const insets = useSafeAreaInsets();

  const { profile } = useSupabase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      number_phone: "",
      blood_group: "",
      address: "",
      wilaya: "",
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

      await supabase.from("blood_requests").insert([
        {
          profile_id: user.id,
          created_at: new Date().toISOString(),
          blood_group: formData.blood_group,
          address: formData.address,
          wilaya: formData.wilaya,
          description: formData.description,
          phone_number: formData.number_phone,
        },
      ]);

      toast.success("Request Posted", {
        description: "Your blood request has been successfully submitted.",
        richColors: true,
      });

      form.reset();

      router.replace("/(app)/(protected)");
    } catch (error: Error | any) {
      console.log(error.message);

      toast.error("Submission Failed", {
        description:
          "There was a problem submitting your blood request. Please try again.",
        richColors: true,
      });
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background pt-8 px-4">
      <ScrollView>
        <H3 className="mb-4"> Create Blood Request </H3>

        <Form {...form}>
          <View className="gap-2 mb-4">
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

            <View>
              <Label nativeID="wilaya" className="mb-2">
                Tell Us About the Patient
              </Label>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <Textarea
                    placeholder="Enter a short note about the patient (up to 160 characters)"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(v) => {
                      field.onChange(v);
                    }}
                    value={field.value}
                    // {...field}
                  />
                )}
              />
            </View>
          </View>
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
            <Text> Submit Request </Text>
          )}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
