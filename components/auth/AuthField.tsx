import { colors } from '@/constants/theme'
import { clsx } from 'clsx'
import React, { useState } from 'react'
import { Pressable, Text, TextInput, type TextInputProps, View } from 'react-native'

type AuthFieldProps = TextInputProps & {
  label: string
  error?: string
  hint?: string
}

const AuthField = ({ label, error, hint, secureTextEntry, ...props }: AuthFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isPasswordField = Boolean(secureTextEntry)

  return (
    <View className='auth-field'>
      <Text className='auth-label'>{label}</Text>
      <View className={clsx('auth-input-shell', error && 'auth-input-shell-error')}>
        <TextInput
          className='auth-input'
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry={isPasswordField && !isPasswordVisible}
          autoCorrect={false}
          {...props}
        />
        {isPasswordField && (
          <Pressable
            className='auth-input-toggle'
            onPress={() => setIsPasswordVisible((current) => !current)}
            accessibilityRole='button'
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            <Text className='auth-input-toggle-text'>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
          </Pressable>
        )}
      </View>
      {error ? <Text className='auth-error'>{error}</Text> : hint ? <Text className='auth-helper'>{hint}</Text> : null}
    </View>
  )
}

export default AuthField
