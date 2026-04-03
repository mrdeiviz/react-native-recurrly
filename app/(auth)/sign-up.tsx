import { useSignUp } from '@clerk/expo'
import AuthButton from '@/components/auth/AuthButton'
import AuthField from '@/components/auth/AuthField'
import AuthShell from '@/components/auth/AuthShell'
import {
  AUTH_ROUTES,
  getAuthErrorState,
  validateSignUpValues,
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

const SignUp = () => {
  const router = useRouter()
  const { signUp } = useSignUp()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [errors, setErrors] = useState<AuthFieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResendingCode, setIsResendingCode] = useState(false)
  const [verificationRequested, setVerificationRequested] = useState(false)

  const isVerificationStep = useMemo(() => {
    if (!signUp) {
      return false
    }

    return (
      verificationRequested ||
      (signUp.status === 'missing_requirements' &&
        signUp.unverifiedFields.includes('email_address') &&
        signUp.missingFields.length === 0)
    )
  }, [signUp, verificationRequested])

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
    if (!signUp) {
      return
    }

    const { error } = await signUp.finalize({
      navigate: navigateAfterFinalize,
    })

    if (error) {
      setErrors(getAuthErrorState(error))
      return
    }
  }

  const handleSubmit = async () => {
    if (!signUp) {
      return
    }

    const nextErrors = validateSignUpValues({
      emailAddress,
      password,
      confirmPassword,
    })

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    const { error } = await signUp.password({
      emailAddress: emailAddress.trim(),
      password,
    })

    if (error) {
      setErrors(getAuthErrorState(error))
      setIsSubmitting(false)
      return
    }

    const verificationResult = await signUp.verifications.sendEmailCode()

    if (verificationResult.error) {
      setErrors(getAuthErrorState(verificationResult.error))
      setIsSubmitting(false)
      return
    }

    setVerificationRequested(true)
    setIsSubmitting(false)
  }

  const handleVerify = async () => {
    if (!signUp) {
      return
    }

    const codeError = validateVerificationCode(code)
    if (codeError) {
      setErrors({ code: codeError })
      return
    }

    setIsSubmitting(true)
    setErrors({})

    const { error } = await signUp.verifications.verifyEmailCode({
      code: code.trim(),
    })

    if (error) {
      setErrors(getAuthErrorState(error))
      setIsSubmitting(false)
      return
    }

    if (signUp.status === 'complete') {
      setIsSubmitting(false)
      await handleFinalize()
      return
    } else {
      setErrors({
        form: 'Your code was accepted, but the account is not ready yet.',
      })
    }

    setIsSubmitting(false)
  }

  const handleResendCode = async () => {
    if (!signUp) {
      return
    }

    setIsResendingCode(true)
    setErrors({})

    const { error } = await signUp.verifications.sendEmailCode()

    if (error) {
      setErrors(getAuthErrorState(error))
    }

    setIsResendingCode(false)
  }

  const handleReset = async () => {
    if (!signUp) {
      return
    }

    await signUp.reset()
    setVerificationRequested(false)
    setCode('')
    setPassword('')
    setConfirmPassword('')
    setErrors({})
  }

  if (!signUp) {
    return null
  }

  if (isVerificationStep) {
    return (
      <AuthShell
        title='Check your inbox'
        subtitle={`Enter the 6-digit code we sent to ${emailAddress.trim() || 'your email'} to activate your account.`}
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
            Verifying your email keeps account access private and prevents billing changes from landing in the wrong hands.
          </Text>

          <AuthButton
            label='Verify and continue'
            onPress={handleVerify}
            loading={isSubmitting}
          />
          <AuthButton
            label='Send a new code'
            onPress={handleResendCode}
            loading={isResendingCode}
            variant='secondary'
          />
          <AuthButton
            label='Use a different email'
            onPress={handleReset}
            variant='secondary'
          />
        </View>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title='Create your account'
      subtitle='Start tracking renewals, spend, and billing history from one polished workspace.'
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
          hint='Use at least 8 characters.'
          placeholder='Create a password'
          secureTextEntry
          autoCapitalize='none'
          autoComplete='new-password'
          textContentType='newPassword'
        />
        <AuthField
          label='Confirm password'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={errors.confirmPassword}
          placeholder='Repeat your password'
          secureTextEntry
          autoCapitalize='none'
          autoComplete='new-password'
          textContentType='newPassword'
        />

        <AuthButton
          label='Create account'
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!emailAddress.trim() || !password || !confirmPassword}
        />

        <Text className='auth-helper'>
          By continuing, you&apos;re creating a secure Recurrly workspace for your billing activity.
        </Text>

        <View nativeID='clerk-captcha' className='auth-captcha' />
      </View>

      <View className='auth-link-row'>
        <Text className='auth-link-copy'>Already have an account?</Text>
        <Link href={AUTH_ROUTES.signIn} replace>
          <Text className='auth-link'>Sign in</Text>
        </Link>
      </View>
    </AuthShell>
  )
}

export default SignUp
