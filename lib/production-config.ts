// Production configuration and environment validation
export const productionConfig = {
  // Database
  database: {
    url: process.env.DATABASE_URL!,
    poolSize: Number.parseInt(process.env.DB_POOL_SIZE || "10"),
    connectionTimeout: Number.parseInt(process.env.DB_TIMEOUT || "30000"),
  },

  // WhatsApp API
  whatsapp: {
    apiUrl: process.env.WHATSAPP_API_URL || "https://wasenderapi.com/api/send-message",
    token: process.env.WHATSAPP_API_TOKEN!,
    rateLimitPerMinute: Number.parseInt(process.env.WHATSAPP_RATE_LIMIT || "60"),
  },

  // Security
  security: {
    otpExpiryMinutes: Number.parseInt(process.env.OTP_EXPIRY_MINUTES || "10"),
    sessionExpiryHours: Number.parseInt(process.env.SESSION_EXPIRY_HOURS || "720"), // 30 days
    maxOtpAttempts: Number.parseInt(process.env.MAX_OTP_ATTEMPTS || "3"),
    rateLimitWindowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW || "900000"), // 15 minutes
    rateLimitMaxRequests: Number.parseInt(process.env.RATE_LIMIT_MAX || "5"),
  },

  // File Storage
  storage: {
    maxFileSize: Number.parseInt(process.env.MAX_FILE_SIZE || "10485760"), // 10MB
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || "image/jpeg,image/png,image/webp,application/pdf").split(","),
  },

  // Business Settings
  business: {
    serviceFeePercentage: Number.parseFloat(process.env.SERVICE_FEE_PERCENTAGE || "5"),
    shippingRatePerKg: Number.parseFloat(process.env.SHIPPING_RATE_PER_KG || "50"),
    insuranceRatePercentage: Number.parseFloat(process.env.INSURANCE_RATE_PERCENTAGE || "2"),
  },
}

// Validate required environment variables
export function validateProductionConfig() {
  const required = ["DATABASE_URL", "WHATSAPP_API_TOKEN", "NEXTAUTH_SECRET"]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}
