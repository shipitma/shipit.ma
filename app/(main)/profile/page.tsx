"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Phone, Mail, MapPin, Save, Edit, X, Check } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTranslations } from "@/lib/hooks/use-translations"
import { useToast } from "@/hooks/use-toast"
import { useAnalytics } from "@/hooks/use-analytics"
import { useLanguage } from "@/lib/context/language-context"

interface PersonalFormData {
  firstName: string
  lastName: string
  email: string
}

interface AddressFormData {
  addressLine: string
  city: string
  state: string
  zip: string
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const { t } = useTranslations()
  const { toast } = useToast()
  const { trackError } = useAnalytics()
  const { isRTL } = useLanguage()
  
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [isLoadingPersonal, setIsLoadingPersonal] = useState(false)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [personalData, setPersonalData] = useState<PersonalFormData>({
    firstName: "",
    lastName: "",
    email: ""
  })
  const [addressData, setAddressData] = useState<AddressFormData>({
    addressLine: "",
    city: "",
    state: "",
    zip: ""
  })

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setPersonalData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || ""
      })
      setAddressData({
        addressLine: user.address_line || "",
        city: user.city || "",
        state: user.state || "",
        zip: user.zip || ""
      })
    }
  }, [user])

  const handlePersonalInputChange = (field: keyof PersonalFormData, value: string) => {
    setPersonalData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddressInputChange = (field: keyof AddressFormData, value: string) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSavePersonal = async () => {
    if (!user?.id) {
      toast({
        title: t('common.error', 'Error'),
        description: t('profile.errors.userNotFound', 'User not found'),
        variant: "destructive",
      })
      return
    }

    setIsLoadingPersonal(true)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: personalData.firstName,
          lastName: personalData.lastName,
          email: personalData.email || null,
          addressLine: addressData.addressLine || null,
          city: addressData.city || null,
          state: addressData.state || null,
          zip: addressData.zip || null,
          country: "Morocco"
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update personal information')
      }

      const updatedUser = await response.json()
      
      // Refresh user data in context
      await refreshUser()
      
      setIsEditingPersonal(false)
      toast({
        title: t('profile.success.title', 'Profile Updated'),
        description: t('profile.success.personalInfo', 'Your personal information has been updated successfully'),
      })
    } catch (error) {
      console.error('Personal info update error:', error)
      trackError('API_ERROR', { 
        error_message: error instanceof Error ? error.message : 'Unknown error',
        endpoint: '/api/users/[id]'
      })
      toast({
        title: t('common.error', 'Error'),
        description: t('profile.errors.updateFailed', 'Failed to update personal information. Please try again.'),
        variant: "destructive",
      })
    } finally {
      setIsLoadingPersonal(false)
    }
  }

  const handleSaveAddress = async () => {
    if (!user?.id) {
      toast({
        title: t('common.error', 'Error'),
        description: t('profile.errors.userNotFound', 'User not found'),
        variant: "destructive",
      })
      return
    }

    setIsLoadingAddress(true)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: personalData.firstName,
          lastName: personalData.lastName,
          email: personalData.email || null,
          addressLine: addressData.addressLine || null,
          city: addressData.city || null,
          state: addressData.state || null,
          zip: addressData.zip || null,
          country: "Morocco"
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update shipping address')
      }

      const updatedUser = await response.json()
      
      // Refresh user data in context
      await refreshUser()
      
      setIsEditingAddress(false)
      toast({
        title: t('profile.success.title', 'Profile Updated'),
        description: t('profile.success.shippingAddress', 'Your shipping address has been updated successfully'),
      })
    } catch (error) {
      console.error('Address update error:', error)
      trackError('API_ERROR', { 
        error_message: error instanceof Error ? error.message : 'Unknown error',
        endpoint: '/api/users/[id]'
      })
      toast({
        title: t('common.error', 'Error'),
        description: t('profile.errors.updateFailed', 'Failed to update shipping address. Please try again.'),
        variant: "destructive",
      })
    } finally {
      setIsLoadingAddress(false)
    }
  }

  const handleCancelPersonal = () => {
    // Reset personal form data to original user data
    if (user) {
      setPersonalData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || ""
      })
    }
    setIsEditingPersonal(false)
  }

  const handleCancelAddress = () => {
    // Reset address form data to original user data
    if (user) {
      setAddressData({
        addressLine: user.address_line || "",
        city: user.city || "",
        state: user.state || "",
        zip: user.zip || ""
      })
    }
    setIsEditingAddress(false)
  }

  const isPersonalFormValid = personalData.firstName.trim() && personalData.lastName.trim()

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">{t('profile.title', 'Profile Settings')}</h1>
            <p className="text-sm text-gray-600">{t('profile.subtitle', 'Manage your personal information and shipping address')}</p>
          </div>
        </div>

        {/* Personal Information Form */}
        <Card className="border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <User className="w-4 h-4" />
              {t('profile.personalInfo.title', 'Personal Information')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-6 pt-0 space-y-3">
            {/* Name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">{t('profile.personalInfo.firstName', 'First Name')} *</Label>
                <Input
                  value={personalData.firstName}
                  onChange={(e) => handlePersonalInputChange('firstName', e.target.value)}
                  disabled={!isEditingPersonal}
                  placeholder={t('profile.personalInfo.firstNamePlaceholder', 'Enter your first name')}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">{t('profile.personalInfo.lastName', 'Last Name')} *</Label>
                <Input
                  value={personalData.lastName}
                  onChange={(e) => handlePersonalInputChange('lastName', e.target.value)}
                  disabled={!isEditingPersonal}
                  placeholder={t('profile.personalInfo.lastNamePlaceholder', 'Enter your last name')}
                  className="h-8 text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-sm">{t('profile.personalInfo.email', 'Email')}</Label>
              <Input
                type="email"
                value={personalData.email}
                onChange={(e) => handlePersonalInputChange('email', e.target.value)}
                disabled={!isEditingPersonal}
                placeholder={t('profile.personalInfo.emailPlaceholder', 'Enter your email address')}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {t('profile.personalInfo.phone', 'Phone Number')}
              </Label>
              <Input
                value={user?.phone_number ? (isRTL ? user.phone_number : user.phone_number) : ""}
                disabled
                className={`bg-gray-50 h-8 text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'ltr' : 'auto'}
              />
              <p className="text-xs text-gray-500">
                {t('profile.personalInfo.phoneNote', 'Phone number cannot be changed')}
              </p>
            </div>

            {/* Personal Information Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              {!isEditingPersonal ? (
                <Button 
                  onClick={() => setIsEditingPersonal(true)}
                  variant="outline" 
                  className="flex-1 h-8 text-sm"
                >
                  <Edit className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  {t('profile.actions.edit', 'Edit')}
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleCancelPersonal}
                    variant="outline" 
                    disabled={isLoadingPersonal}
                    className={`h-8 text-sm ${isRTL ? 'order-2' : 'order-1'}`}
                  >
                    {t('profile.actions.cancel', 'Cancel')}
                  </Button>
                  <Button 
                    onClick={handleSavePersonal}
                    disabled={!isPersonalFormValid || isLoadingPersonal}
                    className={`flex-1 h-8 text-sm ${isRTL ? 'order-1' : 'order-2'}`}
                  >
                    {isLoadingPersonal ? (
                      <>
                        <div className={`w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {t('profile.actions.saving', 'Saving...')}
                      </>
                    ) : (
                      <>
                        <Check className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {t('profile.actions.save', 'Save')}
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address Form */}
        <Card className="border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <MapPin className="w-4 h-4" />
              {t('profile.shippingAddress.title', 'Shipping Address')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-6 pt-0 space-y-3">
            <div className="space-y-1">
              <Label className="text-sm">{t('profile.shippingAddress.addressLine', 'Address')}</Label>
              <Input
                value={addressData.addressLine}
                onChange={(e) => handleAddressInputChange('addressLine', e.target.value)}
                disabled={!isEditingAddress}
                placeholder={t('profile.shippingAddress.addressLinePlaceholder', 'Enter your street address')}
                className="h-8 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">{t('profile.shippingAddress.city', 'City')}</Label>
                <Input
                  value={addressData.city}
                  onChange={(e) => handleAddressInputChange('city', e.target.value)}
                  disabled={!isEditingAddress}
                  placeholder={t('profile.shippingAddress.cityPlaceholder', 'City')}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">{t('profile.shippingAddress.state', 'Region/State')}</Label>
                <Input
                  value={addressData.state}
                  onChange={(e) => handleAddressInputChange('state', e.target.value)}
                  disabled={!isEditingAddress}
                  placeholder={t('profile.shippingAddress.statePlaceholder', 'Region or State')}
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-sm">{t('profile.shippingAddress.zip', 'Postal Code')}</Label>
              <Input
                value={addressData.zip}
                onChange={(e) => handleAddressInputChange('zip', e.target.value)}
                disabled={!isEditingAddress}
                placeholder={t('profile.shippingAddress.zipPlaceholder', 'Postal code')}
                className="h-8 text-sm"
              />
            </div>

            {/* Shipping Address Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              {!isEditingAddress ? (
                <Button 
                  onClick={() => setIsEditingAddress(true)}
                  variant="outline" 
                  className="flex-1 h-8 text-sm"
                >
                  <Edit className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  {t('profile.actions.edit', 'Edit')}
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleCancelAddress}
                    variant="outline" 
                    disabled={isLoadingAddress}
                    className={`h-8 text-sm ${isRTL ? 'order-2' : 'order-1'}`}
                  >
                    {t('profile.actions.cancel', 'Cancel')}
                  </Button>
                  <Button 
                    onClick={handleSaveAddress}
                    disabled={isLoadingAddress}
                    className={`flex-1 h-8 text-sm ${isRTL ? 'order-1' : 'order-2'}`}
                  >
                    {isLoadingAddress ? (
                      <>
                        <div className={`w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {t('profile.actions.saving', 'Saving...')}
                      </>
                    ) : (
                      <>
                        <Check className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {t('profile.actions.save', 'Save')}
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
