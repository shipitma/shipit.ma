// Authentication utility functions for OTP and session management with Neon Auth

import { neon } from "@neondatabase/serverless"
import { randomBytes, createHash } from "crypto"

// Initialize database connection
function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!databaseUrl) {
    throw new Error("No database URL found. Please set DATABASE_URL or POSTGRES_URL environment variable")
  }
  return neon(databaseUrl)
}

// Types
export interface OTPCode {
  id: number
  phone_number: string
  code: string
  purpose: "login" | "register"
  expires_at: string
  verified: boolean
  attempts: number
  max_attempts: number
  created_at: string
  verified_at?: string
}

export interface Session {
  id: string
  user_id?: string
  phone_number: string
  session_type: "authenticated" | "pending_registration"
  expires_at: string
  created_at: string
  last_accessed: string
  user_agent?: string
  ip_address?: string
  refresh_token?: string
  access_token?: string
}

export interface User {
  id: string
  phone_number: string
  first_name?: string
  last_name?: string
  email?: string
  address_line?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  created_at: string
  updated_at: string
  email_verified: boolean
  phone_verified: boolean
  last_login?: string
}

// JWT-like token generation for Neon Auth compatibility
function generateAccessToken(userId: string, phoneNumber: string): string {
  const payload = {
    sub: userId,
    phone: phoneNumber,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    iss: "shipit.ma",
    aud: "shipit-users",
  }

  // Simple token encoding (in production, use proper JWT)
  const token = Buffer.from(JSON.stringify(payload)).toString("base64")
  return `neon_${token}`
}

function generateRefreshToken(): string {
  return `refresh_${randomBytes(32).toString("hex")}`
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

// OTP Functions
export async function createOTPCode(phoneNumber: string, purpose: "login" | "register"): Promise<string> {
  const sql = getDatabase()

  // Generate 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  // Set expiration to 10 minutes from now
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  // Invalidate any existing OTP codes for this phone number and purpose
  await sql`
    UPDATE otp_codes 
    SET verified = true 
    WHERE phone_number = ${phoneNumber} 
    AND purpose = ${purpose} 
    AND verified = false
  `

  // Create new OTP code
  await sql`
    INSERT INTO otp_codes (phone_number, code, purpose, expires_at)
    VALUES (${phoneNumber}, ${code}, ${purpose}, ${expiresAt.toISOString()})
  `

  return code
}

export async function verifyOTPCode(
  phoneNumber: string,
  code: string,
  purpose: "login" | "register",
): Promise<{ success: boolean; message: string; otpId?: number }> {
  const sql = getDatabase()

  // Find the OTP code
  const [otpRecord] = await sql`
    SELECT * FROM otp_codes 
    WHERE phone_number = ${phoneNumber} 
    AND purpose = ${purpose} 
    AND verified = false
    AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
  `

  if (!otpRecord) {
    return { success: false, message: "Code OTP invalide ou expiré" }
  }

  // Check if max attempts exceeded
  if (otpRecord.attempts >= otpRecord.max_attempts) {
    return { success: false, message: "Nombre maximum de tentatives dépassé" }
  }

  // Increment attempts
  await sql`
    UPDATE otp_codes 
    SET attempts = attempts + 1 
    WHERE id = ${otpRecord.id}
  `

  // Check if code matches
  if (otpRecord.code !== code) {
    return { success: false, message: "Code OTP incorrect" }
  }

  // Mark as verified
  await sql`
    UPDATE otp_codes 
    SET verified = true, verified_at = NOW() 
    WHERE id = ${otpRecord.id}
  `

  return { success: true, message: "Code OTP vérifié avec succès", otpId: otpRecord.id }
}

// Neon Auth Session Functions
export async function createNeonSession(
  phoneNumber: string,
  sessionType: "authenticated" | "pending_registration",
  userId?: string,
  userAgent?: string,
  ipAddress?: string,
): Promise<{ sessionId: string; accessToken: string; refreshToken: string }> {
  const sql = getDatabase()

  // Generate session ID and tokens
  const sessionId = randomBytes(32).toString("hex")
  const accessToken = userId ? generateAccessToken(userId, phoneNumber) : ""
  const refreshToken = generateRefreshToken()

  // Hash tokens for storage
  const hashedRefreshToken = hashToken(refreshToken)

  // Set expiration times
  const sessionExpiry = sessionType === "authenticated" ? 24 * 30 : 1 // 30 days or 1 hour
  const expiresAt = new Date(Date.now() + sessionExpiry * 60 * 60 * 1000)

  // Create session with Neon Auth compatibility
  await sql`
    INSERT INTO sessions (
      id, user_id, phone_number, session_type, expires_at, 
      user_agent, ip_address, access_token, refresh_token
    )
    VALUES (
      ${sessionId}, ${userId || null}, ${phoneNumber}, ${sessionType}, 
      ${expiresAt.toISOString()}, ${userAgent || null}, ${ipAddress || null},
      ${accessToken}, ${hashedRefreshToken}
    )
  `

  return { sessionId, accessToken, refreshToken }
}

export async function getNeonSession(sessionId: string): Promise<Session | null> {
  const sql = getDatabase()

  const [session] = await sql`
    SELECT * FROM sessions 
    WHERE id = ${sessionId} 
    AND expires_at > NOW()
  `

  if (!session) return null

  // Update last accessed time
  await sql`
    UPDATE sessions 
    SET last_accessed = NOW() 
    WHERE id = ${sessionId}
  `

  return session as Session
}

export async function refreshNeonSession(
  refreshToken: string,
): Promise<{ accessToken: string; sessionId: string } | null> {
  const sql = getDatabase()

  const hashedToken = hashToken(refreshToken)

  const [session] = await sql`
    SELECT s.*, u.id as user_id, u.phone_number 
    FROM sessions s
    LEFT JOIN users u ON s.user_id = u.id
    WHERE s.refresh_token = ${hashedToken}
    AND s.expires_at > NOW()
    AND s.session_type = 'authenticated'
  `

  if (!session) return null

  // Generate new access token
  const newAccessToken = generateAccessToken(session.user_id, session.phone_number)

  // Update session with new access token
  await sql`
    UPDATE sessions 
    SET access_token = ${newAccessToken}, last_accessed = NOW()
    WHERE id = ${session.id}
  `

  return { accessToken: newAccessToken, sessionId: session.id }
}

export async function isTokenExpired(token: string): Promise<boolean> {
  if (!token.startsWith("neon_")) {
    return true // Non-Neon tokens are considered expired
  }

  try {
    const payload = JSON.parse(Buffer.from(token.substring(5), "base64").toString())
    
    // Check if token expires within the next 5 minutes
    const currentTime = Math.floor(Date.now() / 1000)
    const expiresIn = payload.exp - currentTime
    
    return expiresIn <= 300 // 5 minutes
  } catch (error) {
    return true // Invalid token is considered expired
  }
}

export async function validateNeonToken(
  token: string,
): Promise<{ valid: boolean; userId?: string; phoneNumber?: string }> {
  if (!token.startsWith("neon_")) {
    return { valid: false }
  }

  try {
    const payload = JSON.parse(Buffer.from(token.substring(5), "base64").toString())

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false }
    }

    return {
      valid: true,
      userId: payload.sub,
      phoneNumber: payload.phone,
    }
  } catch (error) {
    return { valid: false }
  }
}

export async function invalidateNeonSession(sessionId: string): Promise<void> {
  const sql = getDatabase()

  await sql`
    DELETE FROM sessions WHERE id = ${sessionId}
  `
}

export async function invalidateUserNeonSessions(userId: string): Promise<void> {
  const sql = getDatabase()

  await sql`
    DELETE FROM sessions WHERE user_id = ${userId}
  `
}

export async function cleanupPendingRegistrationSessions(phoneNumber: string, excludeSessionId?: string): Promise<void> {
  const sql = getDatabase()

  if (excludeSessionId) {
    await sql`
      UPDATE sessions 
      SET expires_at = NOW() 
      WHERE phone_number = ${phoneNumber} 
      AND session_type = 'pending_registration' 
      AND id != ${excludeSessionId}
    `
  } else {
    await sql`
      UPDATE sessions 
      SET expires_at = NOW() 
      WHERE phone_number = ${phoneNumber} 
      AND session_type = 'pending_registration'
    `
  }
}

// Enhanced User Functions with Neon Auth
export async function createNeonUser(userData: {
  phoneNumber: string
  firstName: string
  lastName: string
  email?: string
  addressLine: string
  city: string
  state?: string
  zip?: string
  country?: string
}): Promise<string> {
  const sql = getDatabase()

  // Generate user ID with Neon Auth format
  const userId = `neon_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  await sql`
    INSERT INTO users (
      id, phone_number, first_name, last_name, email, 
      address_line, city, state, zip, country, phone_verified
    )
    VALUES (
      ${userId}, ${userData.phoneNumber}, ${userData.firstName}, ${userData.lastName}, 
      ${userData.email || null}, ${userData.addressLine}, ${userData.city}, 
      ${userData.state || null}, ${userData.zip || null}, ${userData.country || "Morocco"}, true
    )
  `

  return userId
}

export async function getNeonUserByPhone(phoneNumber: string): Promise<User | null> {
  const sql = getDatabase()

  const [user] = await sql`
    SELECT * FROM users WHERE phone_number = ${phoneNumber}
  `

  return (user as User) || null
}

export async function getNeonUserById(userId: string): Promise<User | null> {
  const sql = getDatabase()

  const [user] = await sql`
    SELECT * FROM users WHERE id = ${userId}
  `

  return (user as User) || null
}

export async function updateUserLastLogin(userId: string): Promise<void> {
  const sql = getDatabase()

  await sql`
    UPDATE users 
    SET last_login = NOW(), updated_at = NOW()
    WHERE id = ${userId}
  `
}

// Cleanup function for expired data
export async function cleanupExpiredNeonAuthData(): Promise<void> {
  const sql = getDatabase()

  // Clean up expired OTP codes
  await sql`
    DELETE FROM otp_codes WHERE expires_at < NOW()
  `

  // Clean up expired sessions
  await sql`
    DELETE FROM sessions WHERE expires_at < NOW()
  `
}

// Helper functions
export async function userExists(phoneNumber: string): Promise<boolean> {
  const user = await getNeonUserByPhone(phoneNumber)
  return !!user
}

export async function createUser(userData: {
  phoneNumber: string
  firstName: string
  lastName: string
  email?: string
  addressLine: string
  city: string
  state?: string
  zip?: string
  country?: string
}): Promise<string> {
  return createNeonUser(userData)
}

export async function getUserByPhone(phoneNumber: string): Promise<User | null> {
  return getNeonUserByPhone(phoneNumber)
}

export async function getUserById(userId: string): Promise<User | null> {
  return getNeonUserById(userId)
}

export async function createSession(
  phoneNumber: string,
  sessionType: "authenticated" | "pending_registration",
  userId?: string,
  userAgent?: string,
  ipAddress?: string,
): Promise<string> {
  const { sessionId } = await createNeonSession(phoneNumber, sessionType, userId, userAgent, ipAddress)
  return sessionId
}

export async function getSession(sessionId: string): Promise<Session | null> {
  return getNeonSession(sessionId)
}

export async function invalidateSession(sessionId: string): Promise<void> {
  return invalidateNeonSession(sessionId)
}

export async function invalidateUserSessions(userId: string): Promise<void> {
  return invalidateUserNeonSessions(userId)
}
