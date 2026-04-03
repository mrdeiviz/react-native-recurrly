import { useClerk, useSession } from '@clerk/expo'
import AuthButton from '@/components/auth/AuthButton'
import AuthShell from '@/components/auth/AuthShell'
import { AUTH_ROUTES, getPendingTaskCopy } from '@/lib/auth'
import { Redirect, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { usePostHog } from 'posthog-react-native'

const Onboarding = () => {
  const router = useRouter()
  const { signOut } = useClerk()
  const { isLoaded, session } = useSession()
  const posthog = usePostHog()
  const taskKey = session?.currentTask?.key

  useEffect(() => {
    if (isLoaded && taskKey) {
      posthog.capture('onboarding_viewed', { task_key: taskKey })
    }
  }, [isLoaded, taskKey, posthog])

  if (!isLoaded) {
    return null
  }

  if (!taskKey) {
    return <Redirect href={AUTH_ROUTES.home} />
  }

  return (
    <AuthShell
      title='One more step'
      subtitle={getPendingTaskCopy(taskKey)}
    >
      <View className='gap-4'>
        <View className='auth-banner'>
          <Text className='auth-banner-text'>
            Finish the requested account step, then you&apos;ll be brought back into your dashboard automatically.
          </Text>
        </View>

        <View className='gap-3'>
          <Text className='auth-label'>Pending task</Text>
          <View className='rounded-2xl border border-border bg-background px-4 py-4'>
            <Text className='font-sans-bold text-primary'>{taskKey}</Text>
          </View>
        </View>

        <AuthButton
          label='Back to dashboard'
          onPress={() => {
            posthog.capture('onboarding_completed', { task_key: taskKey })
            router.replace(AUTH_ROUTES.home)
          }}
        />
        <AuthButton
          label='Sign out'
          variant='secondary'
          onPress={async () => {
            await signOut()
            router.replace(AUTH_ROUTES.signIn)
          }}
        />
      </View>
    </AuthShell>
  )
}

export default Onboarding
