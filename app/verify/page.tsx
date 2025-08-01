"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, MessageCircle, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useAnalytics } from "@/hooks/use-analytics"
import { useTranslations } from "@/lib/hooks/use-translations"
import { useLanguage } from "@/lib/context/language-context"

export default function VerifyPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isNewUser, setIsNewUser] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const { trackAuth, trackError } = useAnalytics()
  const { t } = useTranslations()
  const { isRTL } = useLanguage()

  useEffect(() => {
    const storedPhone = sessionStorage.getItem("phoneNumber")
    if (!storedPhone) {
      router.push("/login")
      return
    }
    setPhoneNumber(storedPhone)

    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      handleVerify(newOtp.join(""))
    }
  }

  const handlePaste = (e: React.ClipboardEvent, index: number) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")

    // Check if pasted data is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      const newOtp = [...otp]

      // Fill from the current index
      for (let i = 0; i < 6 && index + i < 6; i++) {
        newOtp[index + i] = digits[i] || ""
      }

      setOtp(newOtp)

      // Focus the last filled input or the 6th input
      const lastIndex = Math.min(index + 5, 5)
      inputRefs.current[lastIndex]?.focus()

      // Auto-submit if all fields are filled
      if (newOtp.every((digit) => digit !== "")) {
        handleVerify(newOtp.join(""))
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join("")

    if (code.length !== 6) {
      trackAuth('OTP_VERIFICATION_VALIDATION_ERROR', { 
        otp_length: code.length,
        phoneNumber: phoneNumber 
      })
      toast({
        title: t('common.error', 'Erreur'),
        description: t('verify.errors.invalidOtp', 'Veuillez entrer un code OTP valide (6 chiffres).'),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp: code }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        if (data.isNewUser) {
          trackAuth('OTP_VERIFICATION_SUCCESS_NEW_USER', { phoneNumber })
          setIsNewUser(true)
          setSessionId(data.sessionId)
          sessionStorage.setItem("registrationSessionId", data.sessionId)
          router.push("/register/complete")
        } else {
          trackAuth('OTP_VERIFICATION_SUCCESS_EXISTING_USER', { phoneNumber })
          await login(data.sessionId, data.accessToken, data.refreshToken)
          sessionStorage.removeItem("phoneNumber")
          sessionStorage.removeItem("registrationSessionId")
          router.push("/dashboard")
        }
        toast({
          title: t('common.success', 'Succès'),
          description: data.isNewUser 
            ? t('verify.success.newUser', 'Numéro de téléphone vérifié avec succès! Complétez votre inscription.') 
            : t('verify.success.existingUser', 'Connexion réussie!'),
        })
      } else {
        trackError('API_ERROR', { 
          error_message: data.error || 'Unknown error',
          endpoint: '/api/verify-otp'
        })
        throw new Error(data.error || t('verify.errors.verificationFailed', 'Échec de la vérification'))
      }
    } catch (error) {
      toast({
        title: t('common.error', 'Erreur'),
        description: error instanceof Error ? error.message : t('common.unknownError', 'Une erreur est survenue.'),
        variant: "destructive",
      })
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      })

      if (response.ok) {
        setCanResend(false)
        setResendTimer(60)
        toast({
          title: t('verify.success.codeSent', 'Code Envoyé'),
          description: t('verify.success.newCodeSent', 'Un nouveau code de vérification a été envoyé sur votre WhatsApp'),
        })

        // Restart timer
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              setCanResend(true)
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    } catch (error) {
      toast({
        title: t('common.error', 'Erreur'),
        description: t('verify.errors.resendFailed', 'Échec de l\'envoi du code. Veuillez réessayer.'),
        variant: "destructive",
      })
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
            onClick={() => router.push("/login")}
          >
            <ArrowLeft className="w-3 h-3" />
          </Button>
          <CardTitle className="text-lg font-semibold">{t('verify.title', 'Vérifiez Votre Téléphone')}</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {t('verify.subtitle', 'Entrez le code à 6 chiffres envoyé sur votre WhatsApp')}
            <br />
            <span className="font-medium">{phoneNumber}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`flex justify-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onPaste={(e) => handlePaste(e, index)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-10 text-center text-sm font-semibold text-left"
                  dir="ltr"
                  disabled={isLoading}
                />
              ))}
            </div>

            <Button
              onClick={() => handleVerify()}
              className="w-full h-8 text-sm"
              disabled={isLoading || otp.some((digit) => digit === "")}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  {t('verify.verifying', 'Vérification...')}
                </>
              ) : (
                t('verify.verifyButton', 'Vérifier le Code')
              )}
            </Button>

            <div className="text-center">
              {canResend ? (
                <Button variant="link" onClick={handleResend} className="p-0 h-auto text-sm">
                  <MessageCircle className="mr-1 h-3 w-3" />
                  {t('verify.resendCode', 'Renvoyer le Code')}
                </Button>
              ) : (
                <p className="text-sm text-gray-500">{t('verify.resendTimer', 'Renvoyer le code dans')} {resendTimer}s</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
