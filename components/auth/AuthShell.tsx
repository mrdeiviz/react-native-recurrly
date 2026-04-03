import images from '@/constants/images'
import { StatusBar } from 'expo-status-bar'
import { styled } from 'nativewind'
import React from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'

const SafeAreaView = styled(RNSafeAreaView)

type AuthShellProps = {
  title: string
  subtitle: string
  children: React.ReactNode
  footer?: React.ReactNode
}

const AuthShell = ({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) => {
  return (
    <SafeAreaView className='auth-safe-area'>
      <StatusBar style='dark' />
      <View className='auth-screen'>
        <View className='pointer-events-none absolute inset-x-0 top-0 h-72 rounded-b-[52px] bg-white/40' />
        <View className='pointer-events-none absolute -left-16 top-12 size-40 rounded-full bg-accent/10' />
        <View className='pointer-events-none absolute -right-14 top-24 size-32 rounded-full bg-subscription/20' />
        <Image
          source={images.splashPattern}
          className='pointer-events-none absolute right-0 top-0 h-60 w-52 opacity-15'
          resizeMode='contain'
        />

        <KeyboardAvoidingView
          className='flex-1'
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            className='auth-scroll'
            contentContainerClassName='auth-content'
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <View className='auth-brand-block'>
              <View className='auth-logo-wrap'>
                <View className='auth-logo-mark'>
                  <Text className='auth-logo-mark-text'>R</Text>
                </View>
                <View>
                  <Text className='auth-wordmark'>Recurrly</Text>
                  <Text className='auth-wordmark-sub'>Smart billing</Text>
                </View>
              </View>
              <Text className='auth-title text-center'>{title}</Text>
              <Text className='auth-subtitle'>{subtitle}</Text>
            </View>

            <View className='auth-card'>{children}</View>
            {footer}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default AuthShell
