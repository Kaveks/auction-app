"use client";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import { useSupabase } from "./supabase-provider";
import useSWR from "swr";
import { profileType } from "@/types/collections";

interface ContextI {
  user: profileType | null | undefined;
  error: any;
  isLoading: boolean;
  mutate: any;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
}
const Context = createContext<ContextI>({
  user: null,
  error: null,
  isLoading: true,
  mutate: null,
  signOut: async () => {},
  signInWithGoogle: async () => {},
  signInWithEmail: async (email: string, password: string) => null,
});

export default function SupabaseAuthProvider({
  serverSession,
  children,
}: {
  serverSession?: Session | null;
  children: React.ReactNode;
}) {
  const { supabase } = useSupabase();
  const router = useRouter();

  // Get USER
  const getUser = async () => {
    const { data: user, error } = await supabase
      .from("user_profile")
      .select("*")
      .eq("id", serverSession ?.user ?.id)
      .single();
    if (error) {
      console.log(error);
      return null;
    } else {
      return user
    }
  };

  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR(serverSession ? "profile-context" : null, getUser);


  // Sign-In with Google
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          // emailRedirectTo:`${location.origin}/auth/callback`
          // hd: 'domain.com //google will also allowo OAuth logins to be restricted to a specified domain using the 'hd' parameter
        },
      },
    })
    if(error){
      console.log("Google Auth Error",error)
    }else{
      console.log("Auth Provider data",data)
    }
   
};

  // Sign-In with Email
  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return error.message;
    }

    return null;
  };


    //signOut
    const signOut=async()=>{
      await supabase.auth.signOut();
      router.refresh();
      router.push('/login');
  };
  // Refresh the Page to Sync Server and Client
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session ?.access_token !== serverSession ?.access_token) {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase, serverSession ?.access_token]);

  const exposed: ContextI = {
    user,
    error,
    isLoading,
    mutate,
    signOut,
    signInWithGoogle,
    signInWithEmail,
  };

  return (
    <Context.Provider value={exposed}>{children}</Context.Provider>
  )
}

export const useAuth = () => {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error("useAuth must be used inside SupabaseAuthProvider");
  } else {
    return context;
  }
};