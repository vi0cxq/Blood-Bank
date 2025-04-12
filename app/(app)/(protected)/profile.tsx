import ProfileForm from "@/components/ProfileForm";
import { useSupabase } from "@/stores/supabase-store";

export default function Profile() {
  const { profile } = useSupabase();

  return <ProfileForm title="Update Your Profile" profile={profile} />;
}
