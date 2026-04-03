import { useAuth } from '@clerk/expo'
import { Redirect } from "expo-router";
import { AUTH_ROUTES } from '@/lib/auth'

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return null
  }

  return <Redirect href={isSignedIn ? AUTH_ROUTES.home : AUTH_ROUTES.signIn} />;
}
