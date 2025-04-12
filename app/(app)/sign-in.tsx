import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H3, P } from "@/components/ui/typography";

import { SafeAreaView } from "@/components/safe-area-view";
import { router } from "expo-router";
import { useSupabase } from "@/stores/supabase-store";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Please enter at least 8 characters.")
    .max(64, "Please enter fewer than 64 characters."),
});

export default function SignIn() {
  const { signInWithPassword } = useSupabase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await signInWithPassword(data.email, data.password);
    } catch (error: Error | any) {
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView
      className="flex-1 bg-background px-4 pt-32"
      // edges={["bottom"]}
    >
      <View className="gap-2 mb-8">
        <H3 className="self-start mb-6">Sign In</H3>
        <Form {...form}>
          <View className="gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormInput
                  label="Email"
                  placeholder="bloodbank@gmail.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  {...field}
                />
              )}
            />
            <View>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormInput
                    label="Password"
                    placeholder="*********"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    {...field}
                  />
                )}
              />
              {/* <Button
                variant={"link"}
                className="native:h-fit native:px-0 native:py-0 self-end"
                onPress={() => {
                  router.navigate("/sign-in");
                }}
              >
                <Text>Forgot password</Text>
              </Button> */}
            </View>
          </View>
        </Form>
      </View>
      <Button
        size="default"
        variant="destructive"
        onPress={form.handleSubmit(onSubmit)}
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text>Sign In</Text>
        )}
      </Button>
      <View className="flex-row mt-4 items-center justify-center gap-2">
        <P>Don't have an account?</P>
        <Button
          variant={"link"}
          className="native:h-fit native:px-0 native:py-0"
          onPress={() => {
            router.navigate("/sign-up");
          }}
        >
          <Text>Sign Up</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
