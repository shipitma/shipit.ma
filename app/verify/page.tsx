"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"

export default function VerifyPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const { loading: authLoading } = useAuthRedirect()

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

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

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
      toast({
        title: "Erreur",
        description: "Veuillez entrer le code complet à 6 chiffres",
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
          // Store session ID for registration completion
          sessionStorage.setItem("registrationSessionId", data.sessionId)
          router.push("/register/complete")
        } else {
          // Use the auth context login method with prefetching
          await login(data.sessionId, data.accessToken, data.refreshToken)
          sessionStorage.removeItem("phoneNumber")
          router.push("/dashboard")
        }
        toast({
          title: "Succès",
          description: "Numéro de téléphone vérifié avec succès",
        })
      } else {
        throw new Error(data.error || "Invalid verification code")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Verification failed",
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
          title: "Code Envoyé",
          description: "Un nouveau code de vérification a été envoyé sur votre WhatsApp",
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
        title: "Error",
        description: "Failed to resend code. Please try again.",
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
            className="absolute left-4 top-4 h-7 text-xs"
            onClick={() => router.push("/login")}
          >
            <ArrowLeft className="w-3 h-3" />
          </Button>
          <CardTitle className="text-lg font-semibold">Vérifiez Votre Téléphone</CardTitle>
          <CardDescription className="text-xs text-gray-600">
            Entrez le code à 6 chiffres envoyé sur votre WhatsApp
            <br />
            <span className="font-medium">{phoneNumber}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onPaste={(e) => handlePaste(e, index)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-10 text-center text-sm font-semibold"
                  disabled={isLoading}
                />
              ))}
            </div>

            <Button
              onClick={() => handleVerify()}
              className="w-full h-8 text-xs"
              disabled={isLoading || otp.some((digit) => digit === "")}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Vérification...
                </>
              ) : (
                "Vérifier le Code"
              )}
            </Button>

            <div className="text-center">
              {canResend ? (
                <Button variant="link" onClick={handleResend} className="p-0 h-auto text-xs">
                  <MessageCircle className="mr-1 h-3 w-3" />
                  Renvoyer le Code
                </Button>
              ) : (
                <p className="text-xs text-gray-500">Renvoyer le code dans {resendTimer}s</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
