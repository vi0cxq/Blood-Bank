import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1, H3, P } from "@/components/ui/typography";

import { makeRedirectUri } from "expo-auth-session";
import { useSupabase } from "@/stores/supabase-store";
import { router } from "expo-router";

const redirectTo = makeRedirectUri();

const formSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Please enter at least 8 characters.")
      .max(64, "Please enter fewer than 64 characters.")
      .regex(
        /^(?=.*[a-z])/,
        "Your password must have at least one lowercase letter."
      )
      .regex(
        /^(?=.*[A-Z])/,
        "Your password must have at least one uppercase letter."
      )
      .regex(/^(?=.*[0-9])/, "Your password must have at least one number.")
      .regex(
        /^(?=.*[!@#$%^&*])/,
        "Your password must have at least one special character."
      ),
    confirmPassword: z.string().min(8, "Please enter at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Your passwords do not match.",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const { signUp } = useSupabase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const res = await signUp(data.email, data.password);

      console.log("SIGN UP RES:", res);

      form.reset();
    } catch (error: Error | any) {
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background pt-32 px-4">
      <View className="gap-4 mb-8">
        <H3 className="self-start">Sign Up</H3>

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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormInput
                  label="Password"
                  placeholder="Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormInput
                  label="Confirm Password"
                  placeholder="Confirm password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  {...field}
                />
              )}
            />
          </View>
        </Form>
      </View>
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
          <Text>Sign Up</Text>
        )}
      </Button>
      <View className="flex-row mt-4 items-center justify-center gap-2">
        <P>Already have an account?</P>
        <Button
          variant={"link"}
          className="native:h-fit native:px-0 native:py-0"
          onPress={() => {
            router.navigate("/sign-in");
          }}
        >
          <Text>Sign In</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
