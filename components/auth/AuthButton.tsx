import { clsx } from 'clsx'
import React from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'

type AuthButtonProps = {
  label: string
  onPress: () => void | Promise<void>
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary'
}

const AuthButton = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}: AuthButtonProps) => {
  const isPrimary = variant === 'primary'

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={clsx(
        isPrimary ? 'auth-button' : 'auth-secondary-button',
        isPrimary
          ? (disabled || loading) && 'auth-button-disabled'
          : (disabled || loading) && 'auth-secondary-button-disabled'
      )}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <View className='flex-row items-center justify-center gap-2'>
        {loading && (
          <ActivityIndicator
            size='small'
            color={isPrimary ? '#081126' : '#ea7a53'}
          />
        )}
        <Text className={isPrimary ? 'auth-button-text' : 'auth-secondary-button-text'}>
          {label}
        </Text>
      </View>
    </Pressable>
  )
}

export default AuthButton
