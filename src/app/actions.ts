"use server";

import { encodedRedirect } from "@/lib/supabase/utils";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppState } from "@/lib/storage";
import { Subscription } from "@/lib/subscriptions";
import { revalidatePath } from "next/cache";

// Create a mechanism to communicate with client-side code
const SIGN_IN_SUCCESS_KEY = 'subtrack_sign_in_success';

export const signUpAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    if (!email || !password) {
        return encodedRedirect(
            "error",
            "/sign-up",
            "Email and password are required",
        );
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        console.error(error.code + " " + error.message);
        return encodedRedirect("error", "/sign-up", error.message);
    } else {
        return encodedRedirect(
            "success",
            "/sign-up",
            "Thanks for signing up! Please check your email for a verification link.",
        );
    }
};

export const signInAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    
    if (error) {
        return encodedRedirect("error", "/sign-in", error.message);
    }
    
    // Get user session to get the user ID for migration
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        // Instead of using a custom Response, use URLSearchParams to add our flag
        const params = new URLSearchParams({
            'signed_in': 'true'
        });
        return redirect(`/subscriptions?${params.toString()}`);
    }
    
    return redirect("/subscriptions");
};

export const forgotPasswordAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get("origin");
    const callbackUrl = formData.get("callbackUrl")?.toString();

    if (!email) {
        return encodedRedirect("error", "/forgot-password", "Email is required");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
    });

    if (error) {
        console.error(error.message);
        return encodedRedirect(
            "error",
            "/forgot-password",
            "Could not reset password",
        );
    }

    if (callbackUrl) {
        return redirect(callbackUrl);
    }

    return encodedRedirect(
        "success",
        "/forgot-password",
        "Check your email for a link to reset your password.",
    );
};

export const resetPasswordAction = async (formData: FormData) => {
    const supabase = await createClient();

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "Password and confirm password are required",
        );
    }

    if (password !== confirmPassword) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "Passwords do not match",
        );
    }

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "Password update failed",
        );
    }

    encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
};

// New actions for handling user data in Supabase
export const migrateUserDataAction = async (
    userId: string,
    appState: AppState
) => {
    const supabase = await createClient();

    try {
        // Save subscriptions to Supabase
        if (appState.subscriptions.length > 0) {
            // Transform subscriptions to use snake_case
            const subscriptionsToMigrate = appState.subscriptions.map(sub => {
                return {
                    ...sub,
                    user_id: userId
                };
            });

            const { error: subsError } = await supabase
                .from('user_subscriptions')
                .insert(subscriptionsToMigrate);

            if (subsError) throw subsError;
        }

        // Save settings to Supabase
        const { error: settingsError } = await supabase
            .from('user_settings')
            .upsert({
                user_id: userId,
                settings: appState.settings
            });

        if (settingsError) throw settingsError;

        return { success: true, message: "Data migrated successfully" };
    } catch (error: any) {
        console.error("Error migrating user data:", error);
        return { success: false, error: error.message };
    }
};

export const getUserSubscriptions = async (userId: string): Promise<Subscription[]> => {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;

        return data || [];
    } catch (error: any) {
        console.error("Error fetching user subscriptions:", error);
        return [];
    }
};

export const getUserSettings = async (userId: string): Promise<AppState['settings'] | null> => {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('user_settings')
            .select('settings')
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No settings found for this user
                return null;
            }
            throw error;
        }

        return data?.settings || null;
    } catch (error: any) {
        console.error("Error fetching user settings:", error);
        return null;
    }
};

export const saveUserSubscription = async (userId: string, subscription: Subscription) => {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from('user_subscriptions')
            .insert({
                ...subscription,
                user_id: userId
            });

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error("Error saving subscription:", error);
        return { success: false, error: error.message };
    }
};

export const updateUserSubscription = async (userId: string, subscription: Subscription) => {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from('user_subscriptions')
            .update({
                ...subscription
            })
            .eq('id', subscription.id)
            .eq('user_id', userId);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error("Error updating subscription:", error);
        return { success: false, error: error.message };
    }
};

export const deleteUserSubscription = async (userId: string, subscriptionId: string) => {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from('user_subscriptions')
            .delete()
            .eq('id', subscriptionId)
            .eq('user_id', userId);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error("Error deleting subscription:", error);
        return { success: false, error: error.message };
    }
};

export const saveUserSettings = async (userId: string, settings: AppState['settings']) => {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from('user_settings')
            .upsert({
                user_id: userId,
                settings
            });

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error("Error saving settings:", error);
        return { success: false, error: error.message };
    }
};