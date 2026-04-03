import { formatCurrency, formatStatusLabel, formatSubscriptionDateTime } from '@/lib/utils'
import { clsx } from 'clsx'
import React from 'react'
import { Image, Pressable, Text, View } from 'react-native'

const SubscriptionCard = ({ name, price, currency, icon, billing, category, plan, color, onPress, expanded, renewalDate, paymentMethod, startDate ,status}: SubscriptionCardProps) => {
  const paymentDisplayValue = paymentMethod?.trim()
  const categoryDisplayValue = category?.trim() || plan?.trim()
  const startDateDisplayValue = formatSubscriptionDateTime(startDate)
  const renewalDateDisplayValue = formatSubscriptionDateTime(renewalDate)
  const statusDisplayValue = formatStatusLabel(status)

  return (
    <Pressable onPress={onPress} className={
      clsx('sub-card', expanded ? 'sub-card-expanded' : 'bg-card')}
      style={!expanded && color ? { backgroundColor: color } : undefined}>
      <View className='sub-head'>
        <View className='sub-main'>
          <Image source={icon} className='sub-icon' />
          <View className='sub-copy'>
            <Text numberOfLines={1} className='sub-title'>
              {name}
            </Text>
            <Text numberOfLines={1} ellipsizeMode='tail' className='sub-meta'>
              {categoryDisplayValue || renewalDateDisplayValue}
            </Text>
          </View>
        </View>
        <View className='sub-price-box'>
          <Text className='sub-price'>{formatCurrency(price, currency)}</Text>
          <Text className='sub-billing'>{billing}</Text>
        </View>
      </View>
      {expanded && (
        <View className='sub-bdy'>
          <View className='sub-details'>
            {paymentDisplayValue && (
              <View className='sub-row'>
                <View className='sub-row-copy'>
                  <Text className='sub-label'>Payment:</Text>
                  <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>{paymentDisplayValue}</Text>
                </View>
              </View>
            )}
            {categoryDisplayValue && (
              <View className='sub-row'>
                <View className='sub-row-copy'>
                  <Text className='sub-label'>Category:</Text>
                  <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>{categoryDisplayValue}</Text>
                </View>
              </View>
            )}
            <View className='sub-row'>
              <View className='sub-row-copy'>
                <Text className='sub-label'>Started:</Text>
                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>{startDateDisplayValue}</Text>
              </View>
            </View>
            <View className='sub-row'>
              <View className='sub-row-copy'>
                <Text className='sub-label'>Renewal date:</Text>
                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>{renewalDateDisplayValue}</Text>
              </View>
            </View>
            <View className='sub-row'>
              <View className='sub-row-copy'>
                <Text className='sub-label'>Status:</Text>
                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>{statusDisplayValue}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  )
}

export default SubscriptionCard
