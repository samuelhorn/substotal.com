'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function AccountPreferences() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setIsAuthenticated(!!user);

            if (user) {
                setUser(user);

                try {
                    // Check if profiles table exists by attempting to query it
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    // If there was no error, we have a profile table and maybe profile data
                    if (profileData) {
                        setFullName(profileData.full_name || '');
                        setAvatarUrl(profileData.avatar_url || '');
                    } else if (!profileError) {
                        // Table exists but no profile for this user - we'll create one when they save
                        console.log('No profile found for user, will create on save');
                    }
                } catch (err) {
                    console.error('Error with profiles table:', err);
                }

                // Check if avatars bucket exists, create if not
                try {
                    const { data: buckets } = await supabase.storage.getBucket('avatars');
                    if (!buckets) {
                        // Create the avatars bucket if it doesn't exist
                        await supabase.storage.createBucket('avatars', {
                            public: true,
                            fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
                        });
                    }
                } catch (err) {
                    console.error('Error with avatars bucket:', err);
                }
            }
        };

        checkAuth();
    }, []);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file size (less than 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError('Avatar image must be less than 2MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('File must be an image');
                return;
            }

            setError(null);
            setAvatarFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && e.target.result) {
                    setAvatarUrl(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async () => {
        if (!user) return;

        setIsLoading(true);
        setError(null);

        try {
            const supabase = createClient();

            // Check if profiles table exists, create if it doesn't
            try {
                const { error: tableError } = await supabase.rpc('create_profiles_if_not_exists');
                if (tableError) {
                    // If RPC doesn't exist, try direct SQL (this requires extra permissions)
                    // This is a fallback and might not work depending on your Supabase setup
                    console.error('Could not create profiles table via RPC:', tableError);
                }
            } catch (err) {
                console.error('Error creating profiles table:', err);
            }

            // Upload avatar if new file was selected
            let newAvatarUrl = avatarUrl;
            if (avatarFile) {
                const fileExt = avatarFile.name.split('.').pop();
                const filePath = `${user.id}/avatar.${fileExt}`;

                // Ensure avatars bucket exists
                try {
                    const { data: buckets } = await supabase.storage.getBucket('avatars');
                    if (!buckets) {
                        await supabase.storage.createBucket('avatars', {
                            public: true,
                            fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
                        });
                    }
                } catch (bucketErr) {
                    console.error('Error ensuring avatars bucket exists:', bucketErr);
                }

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, avatarFile, { upsert: true });

                if (uploadError) {
                    throw new Error(`Error uploading avatar: ${uploadError.message}`);
                }

                const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
                newAvatarUrl = data.publicUrl;
            }

            // Update profile in profiles table
            const { error: upsertError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: fullName,
                    avatar_url: newAvatarUrl,
                    updated_at: new Date().toISOString(),
                });

            if (upsertError) {
                throw new Error(`Error updating profile: ${upsertError.message}`);
            }

            setUpdateSuccess(true);
            setTimeout(() => setUpdateSuccess(false), 3000);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setError(error.message || 'Error updating profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-medium">Change Your Details</CardTitle>
            </CardHeader>
            {isAuthenticated ? (
                <>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="flex gap-4 items-center">
                            <div className="relative">
                                <Avatar className="w-16 h-16">
                                    <AvatarImage src={avatarUrl} alt={fullName} />
                                    <AvatarFallback>{fullName?.charAt(0) || user?.email?.charAt(0) || '?'}</AvatarFallback>
                                </Avatar>
                                <Label htmlFor="avatar" className="absolute flex items-center justify-center inset-0 cursor-pointer text-xs font-bold bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                                    Change
                                </Label>
                                <Input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>
                            <div className="space-y-2 w-full">
                                <Label htmlFor="fullName" className="text-muted-foreground">Full Name</Label>
                                <Input
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        setFullName(e.target.value);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    placeholder="Your full name"
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 justify-end mt-4">
                            {updateSuccess && (
                                <span className="text-sm text-muted-foreground">Profile updated successfully!</span>
                            )}
                            <Button
                                size="sm"
                                onClick={handleProfileUpdate}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : 'Save Changes'}
                            </Button>

                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-between pt-4 border-t">
                        <p className="text-sm text-muted-foreground">Sign out of your account</p>
                        <Button size="sm" onClick={handleSignOut}>
                            Sign out
                        </Button>
                    </CardFooter>
                </>
            ) : (
                <CardFooter className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Sign in to sync your data across devices</p>
                    <Button asChild size="sm">
                        <Link href="/sign-in" className={buttonVariants()}>
                            Sign in
                        </Link>
                    </Button>
                </CardFooter>
            )}

        </Card>
    );
}