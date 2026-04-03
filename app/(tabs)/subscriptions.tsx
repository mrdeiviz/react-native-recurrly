import { Ionicons } from '@expo/vector-icons'
import SubscriptionCard from '@/components/SubscriptionCard'
import { colors } from '@/constants/theme'
import { useSubscriptions } from '@/lib/subscriptions'
import { styled } from 'nativewind'
import React, { useMemo, useState } from 'react'
import { FlatList, Text, TextInput, View } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'

const SafeAreaView = styled(RNSafeAreaView)

const normalizeValue = (value?: string) => value?.trim().toLowerCase() || ''

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null)
  const { subscriptions } = useSubscriptions()

  const filteredSubscriptions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return subscriptions
    }

    return subscriptions.filter((subscription) => {
      const searchFields = [
        subscription.name,
        subscription.category,
        subscription.plan,
        subscription.paymentMethod,
        subscription.status,
        subscription.billing,
      ]

      return searchFields.some((field) => normalizeValue(field).includes(normalizedQuery))
    })
  }, [searchQuery, subscriptions])

  return (
    <SafeAreaView className='subscriptions-screen'>
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id
              )
            }
          />
        )}
        keyboardShouldPersistTaps='handled'
        contentContainerClassName='subscriptions-content'
        ItemSeparatorComponent={() => <View className='h-4' />}
        ListHeaderComponent={
          <>
            <View className='subscriptions-header'>
              <Text className='subscriptions-title'>Subscriptions</Text>
              <Text className='subscriptions-subtitle'>
                Search across your recurring services and expand any item for full details.
              </Text>
            </View>
            <View className='subscriptions-search-shell'>
              <Ionicons
                name='search'
                size={18}
                color={colors.mutedForeground}
                style={{ marginRight: 10 }}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder='Search subscriptions'
                placeholderTextColor={colors.mutedForeground}
                className='subscriptions-search-input'
                autoCapitalize='none'
                autoCorrect={false}
                clearButtonMode='while-editing'
              />
            </View>
          </>
        }
        ListEmptyComponent={
          <View className='subscriptions-empty-wrap'>
            <Text className='subscriptions-empty-title'>No subscriptions found</Text>
            <Text className='subscriptions-empty-copy'>
              Try a different search term or clear the search field to see all recurring services.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

export default Subscriptions
