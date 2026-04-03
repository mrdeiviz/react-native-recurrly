import { useClerk, useUser } from '@clerk/expo';
import AuthButton from '@/components/auth/AuthButton';
import images from '@/constants/images';
import { AUTH_ROUTES } from '@/lib/auth';
import { useRouter } from 'expo-router';
import { styled } from 'nativewind';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
    || user?.username
    || 'Recurrly member';
  const emailAddress = user?.primaryEmailAddress?.emailAddress || 'No email available';
  const avatarSource = user?.imageUrl ? { uri: user.imageUrl } : images.avatar;
  const joinedDate = user?.createdAt
    ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(user.createdAt)
    : 'Recently joined';

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-5 pb-24"
      >
        <View>
          <Text className="text-3xl font-sans-bold text-primary">Profile</Text>
          <Text className="mt-2 text-base font-sans-medium text-muted-foreground">
            Keep your account details up to date and manage your access.
          </Text>
        </View>

        <View className="rounded-3xl border border-border bg-card p-5">
          <View className="flex-row items-center gap-4">
            <Image source={avatarSource} className="size-20 rounded-full" />
            <View className="flex-1">
              <Text className="text-xl font-sans-bold text-primary">{displayName}</Text>
              <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
                {emailAddress}
              </Text>
              <Text className="mt-2 text-xs font-sans-semibold uppercase tracking-[1px] text-accent">
                Member since {joinedDate}
              </Text>
            </View>
          </View>
        </View>

        <View className="rounded-3xl border border-border bg-card p-5">
          <Text className="text-lg font-sans-bold text-primary">Account</Text>
          <View className="mt-4 gap-4">
            <View className="rounded-2xl bg-background px-4 py-4">
              <Text className="text-xs font-sans-semibold uppercase tracking-[1px] text-muted-foreground">
                Full name
              </Text>
              <Text className="mt-2 text-base font-sans-bold text-primary">{displayName}</Text>
            </View>
            <View className="rounded-2xl bg-background px-4 py-4">
              <Text className="text-xs font-sans-semibold uppercase tracking-[1px] text-muted-foreground">
                Email
              </Text>
              <Text className="mt-2 text-base font-sans-bold text-primary">{emailAddress}</Text>
            </View>
          </View>
        </View>

        <View className="rounded-3xl border border-border bg-card p-5">
          <Text className="text-lg font-sans-bold text-primary">Session</Text>
          <Text className="mt-2 text-sm font-sans-medium leading-6 text-muted-foreground">
            Sign out from this device at any time to keep your account secure.
          </Text>

          <View className="mt-5">
            <AuthButton
              label="Sign out"
              variant="secondary"
              onPress={async () => {
                await signOut();
                router.replace(AUTH_ROUTES.signIn);
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Settings
