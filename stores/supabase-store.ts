import { supabase } from "@/config/supabase";
import { Session, User } from "@supabase/supabase-js";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { create } from "zustand";

export type ProfileProps = {
  id: string;
  full_name: string;
  number_phone: string;
  gender: string;
  blood_group: string;
  address: string;
  wilaya: string;
  donor: boolean;
  onboarded: boolean;
  updated_at: Date;
  last_donation: Date;
  donations_count: number;
};

type SupabaseProps = {
  user: User | null;
  session: Session | null;
  profile: ProfileProps | null;
  prepare: () => Promise<void>;
  initialized?: boolean;
  appIsReady?: boolean;

  getProfile: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: ProfileProps) => void;
};
export const useSupabase = create<SupabaseProps>()((set, get) => ({
  user: null,
  session: null,
  profile: null,
  initialized: false,
  appIsReady: false,
  prepare: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      set(() => ({ session }));
      set(() => ({ user: session ? session.user : null }));

      set(() => ({ initialized: true }));

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        set(() => ({ session }));
        set(() => ({ user: session ? session.user : null }));
      });
    } catch (e) {
      console.warn(e);
    } finally {
      set(() => ({ appIsReady: true }));
    }
  },
  updateProfile: async (profile) => {
    // console.log("PROFILE UP--->", profile);
    set(() => ({ profile }));
  },

  getProfile: async () => {
    const session = get().session;
    if (session) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      set(() => ({ profile: profileData }));
    }
  },

  signUp: async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "com.bloodbank://sign-in",
        data: {
          onboarded: false,
        },
      },
    });

    if (error) {
      toast.error("Unable to Sign Up", {
        description: "Please try again later!",
        richColors: true,
      });
    }

    if (data.user?.identities?.length === 0) {
      toast.error("Email Already in Use", {
        description: "Try logging in or use a different email.",
        richColors: true,
      });
    }

    toast.success("Almost There! Check Your Email", {
      description: "Please check your inbox for email verification!",
      richColors: true,
    });

    // router.push("/(app)/onboarding");
  },

  signInWithPassword: async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const isOnboarded = data.session?.user?.user_metadata.onboarded;

    if (!isOnboarded) {
      router.replace("/(app)/onboarding");
    }

    if (error) {
      toast.error("Unable to Sign In", {
        description: "Invalid login credentials",
        richColors: true,
      });
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },
}));
