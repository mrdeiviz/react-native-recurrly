import { icons } from '@/constants/icons'
import '@/global.css'
import { clsx } from 'clsx'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native'

interface CreateSubscriptionModalProps {
  visible: boolean
  onClose: () => void
  onCreate: (subscription: Subscription) => void
}

const FREQUENCY_OPTIONS = ['Monthly', 'Yearly'] as const

const CATEGORY_OPTIONS = [
  'Entertainment',
  'AI Tools',
  'Developer Tools',
  'Design',
  'Productivity',
  'Cloud',
  'Music',
  'Other',
] as const

const CATEGORY_COLORS: Record<(typeof CATEGORY_OPTIONS)[number], string> = {
  Entertainment: '#f5c542',
  'AI Tools': '#b8d4e3',
  'Developer Tools': '#e8def8',
  Design: '#b8e8d0',
  Productivity: '#ffd7a8',
  Cloud: '#b8d7f5',
  Music: '#f3bfd3',
  Other: '#d8d4cc',
}

const INITIAL_FREQUENCY = FREQUENCY_OPTIONS[0]
const INITIAL_CATEGORY = CATEGORY_OPTIONS[0]

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [frequency, setFrequency] = useState<(typeof FREQUENCY_OPTIONS)[number]>(INITIAL_FREQUENCY)
  const [category, setCategory] = useState<(typeof CATEGORY_OPTIONS)[number]>(INITIAL_CATEGORY)
  const [error, setError] = useState('')

  const resetForm = () => {
    setName('')
    setPrice('')
    setFrequency(INITIAL_FREQUENCY)
    setCategory(INITIAL_CATEGORY)
    setError('')
  }

  useEffect(() => {
    if (!visible) {
      resetForm()
    }
  }, [visible])

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = () => {
    const trimmedName = name.trim()
    const normalizedPrice = Number.parseFloat(price.replace(',', '.'))

    if (!trimmedName) {
      setError('Enter a subscription name.')
      return
    }

    if (Number.isNaN(normalizedPrice) || normalizedPrice <= 0) {
      setError('Enter a valid price greater than 0.')
      return
    }

    const intervalUnit = frequency === 'Monthly' ? 'month' : 'year'
    const startDate = dayjs().startOf('day')
    const renewalDate = startDate.add(1, intervalUnit)

    onCreate({
      id: `subscription-${Date.now()}`,
      icon: icons.wallet,
      name: trimmedName,
      price: Number(normalizedPrice.toFixed(2)),
      billing: frequency,
      category,
      status: 'active',
      startDate: startDate.format('YYYY-MM-DD'),
      renewalDate: renewalDate.format('YYYY-MM-DD'),
      color: CATEGORY_COLORS[category],
    })

    handleClose()
  }

  const isSubmitDisabled = !name.trim() || !price.trim()

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="modal-overlay"
      >
        <Pressable className="flex-1" onPress={handleClose} />
        <View className="modal-container">
          <View className="modal-header">
            <Text className="modal-title">New Subscription</Text>
            <Pressable className="modal-close" onPress={handleClose}>
              <Text className="modal-close-text">×</Text>
            </Pressable>
          </View>

          <View className="modal-body">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <View className="auth-input-shell">
                  <TextInput
                    value={name}
                    onChangeText={(value) => {
                      setName(value)
                      if (error) {
                        setError('')
                      }
                    }}
                    placeholder="Enter subscription name"
                    placeholderTextColor="#8A8578"
                    className="auth-input"
                    returnKeyType="done"
                  />
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <View className="auth-input-shell">
                  <TextInput
                    value={price}
                    onChangeText={(value) => {
                      setPrice(value)
                      if (error) {
                        setError('')
                      }
                    }}
                    placeholder="0.00"
                    placeholderTextColor="#8A8578"
                    keyboardType="decimal-pad"
                    className="auth-input"
                    returnKeyType="done"
                  />
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  {FREQUENCY_OPTIONS.map((option) => {
                    const isActive = option === frequency

                    return (
                      <Pressable
                        key={option}
                        className={clsx('picker-option', isActive && 'picker-option-active')}
                        onPress={() => setFrequency(option)}
                      >
                        <Text
                          className={clsx(
                            'picker-option-text',
                            isActive && 'picker-option-text-active',
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORY_OPTIONS.map((option) => {
                    const isActive = option === category

                    return (
                      <Pressable
                        key={option}
                        className={clsx('category-chip', isActive && 'category-chip-active')}
                        onPress={() => setCategory(option)}
                      >
                        <Text
                          className={clsx(
                            'category-chip-text',
                            isActive && 'category-chip-text-active',
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>
              </View>

              {error ? <Text className="auth-error">{error}</Text> : null}

              <Pressable
                className={clsx('auth-button', isSubmitDisabled && 'auth-button-disabled')}
                onPress={handleSubmit}
              >
                <Text className="auth-button-text">Create subscription</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default CreateSubscriptionModal
