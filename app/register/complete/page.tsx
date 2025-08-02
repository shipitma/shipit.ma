"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, User, Mail, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useAnalytics } from "@/hooks/use-analytics"
import { useTranslations } from "@/lib/hooks/use-translations"

interface FormData {
  firstName: string
  lastName: string
  email: string
  address: {
    line: string
    city: string
    state: string
    zip: string
    country: string
  }
}

export default function CompleteRegistrationPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    address: {
      line: "",
      city: "",
      state: "",
      zip: "",
      country: "Morocco"
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const { trackAuth, trackError } = useAnalytics()
  const { t } = useTranslations()

  useEffect(() => {
    // Get stored data from session storage
    const storedSessionId = sessionStorage.getItem("registrationSessionId")
    const storedPhone = sessionStorage.getItem("phoneNumber")
    const storedFirstName = sessionStorage.getItem("firstName")
    const storedLastName = sessionStorage.getItem("lastName")

    if (!storedSessionId) {
      router.push("/register")
      return
    }

    setSessionId(storedSessionId)
    setPhoneNumber(storedPhone || "")
    
    // Pre-fill form with stored data
    setFormData(prev => ({
      ...prev,
      firstName: storedFirstName || "",
      lastName: storedLastName || ""
    }))
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const missingFields = []
    if (!formData.firstName.trim()) missingFields.push('firstName')
    if (!formData.lastName.trim()) missingFields.push('lastName')
    if (!formData.address.line.trim()) missingFields.push('address.line')
    if (!formData.address.city.trim()) missingFields.push('address.city')

    if (missingFields.length > 0) {
      trackAuth('REGISTRATION_COMPLETION_VALIDATION_ERROR', { missing_fields: missingFields })
      toast({
        title: t('common.error', 'Error'),
        description: t('register.complete.validationError', 'Please fill all required fields.'),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email || undefined,
          address: formData.address
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        trackAuth('REGISTRATION_COMPLETED', { 
          phoneNumber,
          hasEmail: !!formData.email,
          country: formData.address.country
        })
        
        // Clear session storage
        sessionStorage.removeItem("registrationSessionId")
        sessionStorage.removeItem("phoneNumber")
        sessionStorage.removeItem("firstName")
        sessionStorage.removeItem("lastName")

        // Login the user
        await login(data.sessionId, data.accessToken, data.refreshToken)

        toast({
          title: t('register.complete.successTitle', 'Registration Successful'),
          description: t('register.complete.successDescription', 'Your account has been created successfully!'),
        })

        router.push("/dashboard")
      } else {
        trackError('API_ERROR', { 
          error_message: data.error || 'Unknown error',
          endpoint: '/api/register'
        })
        throw new Error(data.error || t('common.error', 'Registration failed'))
      }
    } catch (error) {
      toast({
        title: t('common.error', 'Error'),
        description: error instanceof Error ? error.message : t('common.error', 'An error occurred.'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      if (parent === 'address') {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value
          }
        }))
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-200">
        <CardHeader className="text-center pb-4">
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-4 h-7 text-sm"
            onClick={() => router.push("/verify")}
          >
            <ArrowLeft className="w-3 h-3" />
          </Button>
          <CardTitle className="text-lg font-semibold">{t('register.complete.title', 'Complete Registration')}</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {t('register.complete.subtitle', 'Add your personal information to finalize your account')}
            <br />
            <span className="font-medium" dir="ltr">{phoneNumber}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="firstName" className="text-sm flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {t('register.complete.firstName', 'First Name')} *
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder={t('register.complete.firstName', 'First Name')}
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="h-9 text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName" className="text-sm flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {t('register.complete.lastName', 'Last Name')} *
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder={t('register.complete.lastName', 'Last Name')}
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="h-9 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {t('register.complete.email', 'Email (optional)')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {t('register.complete.shippingAddress', 'Shipping Address')} *
              </Label>
              
              <div className="space-y-1">
                <Input
                  type="text"
                  placeholder={t('register.complete.addressLinePlaceholder', 'Complete address')}
                  value={formData.address.line}
                  onChange={(e) => handleInputChange("address.line", e.target.value)}
                  className="h-9 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Input
                    type="text"
                    placeholder={t('register.complete.cityPlaceholder', 'City')}
                    value={formData.address.city}
                    onChange={(e) => handleInputChange("address.city", e.target.value)}
                    className="h-9 text-sm"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Input
                    type="text"
                    placeholder={t('register.complete.statePlaceholder', 'Region')}
                    value={formData.address.state}
                    onChange={(e) => handleInputChange("address.state", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Input
                    type="text"
                    placeholder={t('register.complete.zipPlaceholder', 'ZIP Code')}
                    value={formData.address.zip}
                    onChange={(e) => handleInputChange("address.zip", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Input
                    type="text"
                    placeholder={t('register.complete.countryPlaceholder', 'Country')}
                    value={formData.address.country}
                    onChange={(e) => handleInputChange("address.country", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-9 text-sm" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('register.complete.creatingAccount', 'Creating account...')}
                </>
              ) : (
                t('register.complete.createAccountButton', 'Create My Account')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 