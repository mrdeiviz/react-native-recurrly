import { HOME_SUBSCRIPTIONS } from '@/constants/data'
import { createContext, ReactNode, useContext, useMemo, useState } from 'react'

interface SubscriptionContextValue {
  subscriptions: Subscription[]
  addSubscription: (subscription: Subscription) => void
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null)

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS)

  const value = useMemo(
    () => ({
      subscriptions,
      addSubscription: (subscription: Subscription) => {
        setSubscriptions((currentSubscriptions) => [subscription, ...currentSubscriptions])
      },
    }),
    [subscriptions],
  )

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext)

  if (!context) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider')
  }

  return context
}
