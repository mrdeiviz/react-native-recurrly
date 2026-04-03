import '@/global.css';
import { useAuth } from '@clerk/expo'
import { Redirect, Stack } from "expo-router";
import { AUTH_ROUTES } from '@/lib/auth'

export default function RootLayout() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    return <Redirect href={AUTH_ROUTES.home} />
  }

  return <Stack screenOptions={{ headerShown: false}}/>;
}
