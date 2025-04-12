import { supabase } from "@/config/supabase";

export const updateUserMetadata = async ({
  onboarded,
}: {
  onboarded: boolean;
}) => {
  const { data, error } = await supabase.auth.updateUser({
    data: { onboarded: onboarded },
  });

  if (error) {
    console.error("Error updating user metadata:", error);
    return;
  }

  console.log("Updated user metadata:", data.user.user_metadata);
};
