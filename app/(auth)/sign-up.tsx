import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const SingUp = () => {
  return (
    <View>
      <Text>SingUp</Text>
      <Link href='/(auth)/sign-in'>Sign In</Link>
    </View>
  )
}

export default SingUp
