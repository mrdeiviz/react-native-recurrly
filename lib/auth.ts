import { isClerkAPIResponseError } from '@clerk/expo'

export const AUTH_ROUTES = {
  home: '/(tabs)',
  signIn: '/(auth)/sign-in',
  signUp: '/(auth)/sign-up',
  onboarding: '/onboarding',
} as const

export type AuthFieldKey = 'emailAddress' | 'password' | 'confirmPassword' | 'code' | 'form'

export type AuthFieldErrors = Partial<Record<AuthFieldKey, string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const codePattern = /^\d{6}$/

const normalizeFieldName = (paramName?: string | null): AuthFieldKey | undefined => {
  switch (paramName) {
    case 'emailAddress':
    case 'email_address':
    case 'identifier':
      return 'emailAddress'
    case 'password':
      return 'password'
    case 'code':
      return 'code'
    default:
      return undefined
  }
}

const getFallbackMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return 'Something went wrong. Please try again.'
  }

  const candidate = error as { longMessage?: string; message?: string }

  return candidate.longMessage || candidate.message || 'Something went wrong. Please try again.'
}

export const validateEmailAddress = (emailAddress: string) => {
  const value = emailAddress.trim()

  if (!value) {
    return 'Enter your email address.'
  }

  if (!emailPattern.test(value)) {
    return 'Enter a valid email address.'
  }

  return undefined
}

export const validatePassword = (password: string) => {
  if (!password) {
    return 'Enter your password.'
  }

  if (password.length < 8) {
    return 'Use at least 8 characters.'
  }

  return undefined
}

export const validateVerificationCode = (code: string) => {
  if (!code.trim()) {
    return 'Enter the 6-digit code.'
  }

  if (!codePattern.test(code.trim())) {
    return 'Enter a valid 6-digit code.'
  }

  return undefined
}

export const validateSignInValues = (values: {
  emailAddress: string
  password: string
}): AuthFieldErrors => {
  const errors: AuthFieldErrors = {}
  const emailError = validateEmailAddress(values.emailAddress)
  const passwordError = validatePassword(values.password)

  if (emailError) {
    errors.emailAddress = emailError
  }

  if (passwordError) {
    errors.password = passwordError
  }

  return errors
}

export const validateSignUpValues = (values: {
  emailAddress: string
  password: string
  confirmPassword: string
}): AuthFieldErrors => {
  const errors = validateSignInValues(values)

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

export const getAuthErrorState = (error: unknown): AuthFieldErrors => {
  if (isClerkAPIResponseError(error)) {
    const fieldErrors: AuthFieldErrors = {}

    for (const issue of error.errors) {
      const fieldName = normalizeFieldName(issue.meta?.paramName)
      const message = issue.longMessage || issue.message

      if (fieldName) {
        fieldErrors[fieldName] ??= message
      } else {
        fieldErrors.form ??= message
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return fieldErrors
    }
  }

  return { form: getFallbackMessage(error) }
}

export const hasEmailCodeSecondFactor = (
  supportedSecondFactors: Array<{ strategy?: string | null }> | null | undefined
) => supportedSecondFactors?.some((factor) => factor.strategy === 'email_code') ?? false

export const getPendingTaskCopy = (taskKey?: string | null) => {
  switch (taskKey) {
    case 'setup-mfa':
      return 'Your account needs one final security step before you can continue.'
    case 'reset-password':
      return 'A password reset is required before your account can be used again.'
    case 'choose-organization':
      return 'Choose the workspace you want to continue with.'
    default:
      return 'There is one more account step to complete before opening Recurrly.'
  }
}
