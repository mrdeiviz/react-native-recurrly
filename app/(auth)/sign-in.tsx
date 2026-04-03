import { useSignIn } from '@clerk/expo'
import AuthButton from '@/components/auth/AuthButton'
import AuthField from '@/components/auth/AuthField'
import AuthShell from '@/components/auth/AuthShell'
import {
  AUTH_ROUTES,
  getAuthErrorState,
  hasEmailCodeSecondFactor,
  validateSignInValues,
  validateVerificationCode,
  type AuthFieldErrors,
} from '@/lib/auth'
import * as ExpoLinking from 'expo-linking'
import { Link, type Href, useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Text, View } from 'react-native'

type FinalizeNavigateContext = {
  session?: { currentTask?: { key?: string | null } }
  decorateUrl: (url: string) => string
}

const SignIn = () => {
  const router = useRouter()
  const { signIn } = useSignIn()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [errors, setErrors] = useState<AuthFieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResendingCode, setIsResendingCode] = useState(false)

  const needsEmailCode = useMemo(() => {
    if (!signIn) {
      return false
    }

    return (
      signIn.status === 'needs_client_trust' ||
      (signIn.status === 'needs_second_factor' &&
        hasEmailCodeSecondFactor(signIn.supportedSecondFactors))
    )
  }, [signIn])

  const navigateAfterFinalize = async ({ session, decorateUrl }: FinalizeNavigateContext) => {
    const destination = session?.currentTask ? AUTH_ROUTES.onboarding : AUTH_ROUTES.home
    const url = decorateUrl(destination)

    if (url.startsWith('http')) {
      await ExpoLinking.openURL(url)
      return
    }

    router.replace(url as Href)
  }

  const handleFinalize = async () => {
    if (!signIn) {
      return
    }

    const { error } = await signIn.finalize({
      navigate: navigateAfterFinalize,
    })

    if (error) {
      setErrors(getAuthErrorState(error))
      return
    }

    router.replace(AUTH_ROUTES.home)
  }

  const handleSubmit = async () => {
    if (!signIn) {
      return
    }

    const nextErrors = validateSignInValues({ emailAddress, password })
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    const { error } = await signIn.password({
      emailAddress: emailAddress.trim(),
      password,
    })

    if (error) {
      setErrors(getAuthErrorState(error))
      setIsSubmitting(false)
      return
    }

    if (signIn.status === 'complete') {
      await handleFinalize()
      setIsSubmitting(false)
      return
    }

    if (
      signIn.status === 'needs_client_trust' ||
      (signIn.status === 'needs_second_factor' &&
        hasEmailCodeSecondFactor(signIn.supportedSecondFactors))
    ) {
      const codeRequest = await signIn.emailCode.sendCode({
        emailAddress: emailAddress.trim(),
      })

      if (codeRequest.error) {
        setErrors(getAuthErrorState(codeRequest.error))
      }
    } else {
      setErrors({
        form: 'We could not finish signing you in. Please try again.',
      })
    }

    setIsSubmitting(false)
  }

  const handleVerify = async () => {
    if (!signIn) {
      return
    }

    const codeError = validateVerificationCode(code)
    if (codeError) {
      setErrors({ code: codeError })
      return
    }

    setIsSubmitting(true)
    setErrors({})

    const { error } = await signIn.emailCode.verifyCode({
      code: code.trim(),
    })

    if (error) {
      setErrors(getAuthErrorState(error))
      setIsSubmitting(false)
      return
    }

    if (signIn.status === 'complete') {
      await handleFinalize()
    } else {
      setErrors({
        form: 'The verification code was accepted, but the session is not ready yet.',
      })
    }

    setIsSubmitting(false)
  }

  const handleResendCode = async () => {
    if (!signIn) {
      return
    }

    setIsResendingCode(true)
    setErrors({})

    const { error } = await signIn.emailCode.sendCode({
      emailAddress: emailAddress.trim(),
    })

    if (error) {
      setErrors(getAuthErrorState(error))
    }

    setIsResendingCode(false)
  }

  const handleReset = async () => {
    if (!signIn) {
      return
    }

    await signIn.reset()
    setCode('')
    setPassword('')
    setErrors({})
  }

  if (!signIn) {
    return null
  }

  if (needsEmailCode) {
    return (
      <AuthShell
        title='Verify your device'
        subtitle={`Enter the 6-digit code sent to ${emailAddress.trim() || 'your inbox'} to finish securely.`}
      >
        <View className='auth-form'>
          {errors.form ? (
            <View className='auth-banner auth-banner-error'>
              <Text className='auth-banner-text'>{errors.form}</Text>
            </View>
          ) : null}

          <AuthField
            label='Verification code'
            value={code}
            onChangeText={setCode}
            error={errors.code}
            placeholder='Enter the 6-digit code'
            keyboardType='number-pad'
            textContentType='oneTimeCode'
            autoComplete='one-time-code'
            maxLength={6}
          />

          <Text className='auth-helper'>
            Keep this device trusted so your billing activity stays protected.
          </Text>

          <AuthButton
            label='Verify and continue'
            onPress={handleVerify}
            loading={isSubmitting}
          />
          <AuthButton
            label='Resend code'
            onPress={handleResendCode}
            loading={isResendingCode}
            variant='secondary'
          />
          <AuthButton
            label='Start over'
            onPress={handleReset}
            variant='secondary'
          />
        </View>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title='Welcome back'
      subtitle='Sign in to keep your renewals, spending, and billing history in sync.'
    >
      <View className='auth-form'>
        {errors.form ? (
          <View className='auth-banner auth-banner-error'>
            <Text className='auth-banner-text'>{errors.form}</Text>
          </View>
        ) : null}

        <AuthField
          label='Email'
          value={emailAddress}
          onChangeText={setEmailAddress}
          error={errors.emailAddress}
          placeholder='Enter your email'
          autoCapitalize='none'
          keyboardType='email-address'
          autoComplete='email'
          textContentType='emailAddress'
        />
        <AuthField
          label='Password'
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          placeholder='Enter your password'
          secureTextEntry
          autoCapitalize='none'
          autoComplete='password'
          textContentType='password'
        />

        <AuthButton
          label='Sign in'
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!emailAddress.trim() || !password}
        />

        <Text className='auth-helper'>
          Your session is encrypted and stored securely on this device.
        </Text>
      </View>

      <View className='auth-link-row'>
        <Text className='auth-link-copy'>New to Recurrly?</Text>
        <Link href={AUTH_ROUTES.signUp} replace>
          <Text className='auth-link'>Create an account</Text>
        </Link>
      </View>
    </AuthShell>
  )
}

export default SignIn
