import ProfileForm from "@/components/ProfileForm";
import { SafeAreaView } from "@/components/safe-area-view";

export default function onBoarding() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProfileForm title="Help Us Get to Know You" profile={null} />
    </SafeAreaView>
  );
}
