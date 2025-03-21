import { createClient } from "@/lib/supabase/server";
import { AuthMenu } from "@/components/auth-menu";
import { signOutAction } from "@/app/actions";

export async function AuthButton() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let profile = null;

    if (user) {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', user.id)
                .single();
            profile = data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }

    return (
        <AuthMenu user={user} profile={profile} />
    )
}