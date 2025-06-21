// Database utility functions for the package forwarding application
// This replaces the mock data with actual database queries

import { neon } from "@neondatabase/serverless"
import { validateNeonToken } from "@/lib/auth"

// Initialize database connection
function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!databaseUrl) {
    throw new Error("No database URL found. Please set DATABASE_URL or POSTGRES_URL environment variable")
  }
  return neon(databaseUrl)
}

// Types (keeping the same interfaces for consistency)
export interface User {
  id: string
  phone_number: string
  first_name: string
  last_name: string
  email?: string
  address_line: string
  city: string
  state?: string
  zip?: string
  country: string
  created_at: string
  updated_at: string
}

export interface Attachment {
  id: number
  user_id: string
  file_url: string
  file_name: string
  file_size?: number
  file_type?: string
  attachment_type: "photo" | "receipt" | "document"
  related_type?: string
  related_id?: string
  uploaded_at: string
  created_at: string
  updated_at: string
}

export interface PurchaseRequestItem {
  id: number
  purchase_request_id: string
  name: string
  url?: string
  price: number
  quantity: number
  image_url?: string
  specifications?: string
  variant?: string
  attachments?: Attachment[]
}

export interface PurchaseRequest {
  id: string
  user_id: string
  date: string
  status: "pending_review" | "pending_payment" | "confirmed" | "purchasing" | "completed" | "cancelled"
  total_amount: number
  payment_due?: number | null
  items_cost?: number
  shipping_fee?: number
  service_fee?: number
  processing_fee?: number
  taxes?: number
  admin_notes?: string
  created_at: string
  updated_at: string
  items?: PurchaseRequestItem[]
  timeline?: PurchaseRequestTimeline[]
}

export interface PurchaseRequestTimeline {
  id: number
  purchase_request_id: string
  status: string
  date: string
  time: string
  completed: boolean
  description?: string
}

export interface PackageItem {
  id: number
  package_id: string
  name: string
  quantity: number
  value?: number
  image_url?: string
}

export interface PackageTimeline {
  id: number
  package_id: string
  status: string
  location?: string
  date: string
  time: string
  completed: boolean
  description?: string
  icon?: string
}

export interface PackageType {
  id: string
  user_id: string
  description: string
  status: "expected" | "processing" | "arrived" | "in_transit" | "delivered"
  tracking_number?: string
  weight?: string
  dimensions?: string
  estimated_value?: number
  shipping_cost?: number
  insurance?: number
  progress?: number
  eta?: string
  carrier?: string
  origin?: string
  destination?: string
  retailer?: string
  shipping_method?: string
  service?: string
  transit_time?: string
  tracking_url?: string
  insurance_details?: string
  created_at: string
  updated_at: string
  items?: PackageItem[]
  timeline?: PackageTimeline[]
  attachments?: Attachment[]
}

export interface PaymentRequest {
  id: string
  user_id: string
  type: "purchase" | "shipping"
  related_id: string
  amount: number
  due_date: string
  status: "pending" | "paid" | "overdue" | "processing"
  paid_date?: string
  receipt_url?: string
  created_at: string
  updated_at: string
  breakdown?: Record<string, number>
  payment_methods?: string[]
}

// ID Generation functions
export async function getNextPurchaseRequestId(): Promise<string> {
  const sql = getDatabase()
  const result = await sql`
    SELECT id FROM purchase_requests 
    WHERE id LIKE 'PR-%' 
    ORDER BY CAST(SUBSTRING(id FROM 4) AS INTEGER) DESC 
    LIMIT 1
  `

  if (result.length === 0) {
    return "PR-001"
  }

  const lastId = result[0].id
  const lastNumber = Number.parseInt(lastId.split("-")[1])
  const nextNumber = lastNumber + 1
  return `PR-${nextNumber.toString().padStart(3, "0")}`
}

export async function getNextPackageId(): Promise<string> {
  const sql = getDatabase()
  const result = await sql`
    SELECT id FROM packages 
    WHERE id LIKE 'PKG-%' 
    ORDER BY CAST(SUBSTRING(id FROM 5) AS INTEGER) DESC 
    LIMIT 1
  `

  if (result.length === 0) {
    return "PKG-001"
  }

  const lastId = result[0].id
  const lastNumber = Number.parseInt(lastId.split("-")[1])
  const nextNumber = lastNumber + 1
  return `PKG-${nextNumber.toString().padStart(3, "0")}`
}

export async function getNextPaymentId(): Promise<string> {
  const sql = getDatabase()
  const result = await sql`
    SELECT id FROM payment_requests 
    WHERE id LIKE 'PAY-%' 
    ORDER BY CAST(SUBSTRING(id FROM 5) AS INTEGER) DESC 
    LIMIT 1
  `

  if (result.length === 0) {
    return "PAY-001"
  }

  const lastId = result[0].id
  const lastNumber = Number.parseInt(lastId.split("-")[1])
  const nextNumber = lastNumber + 1
  return `PAY-${nextNumber.toString().padStart(3, "0")}`
}

// User functions
export async function getUserById(id: string): Promise<User | null> {
  const sql = getDatabase()
  const result = await sql`
    SELECT * FROM users WHERE id = ${id}
  `
  return result[0] || null
}

export async function getUserByPhone(phoneNumber: string): Promise<User | null> {
  const sql = getDatabase()
  const result = await sql`
    SELECT * FROM users WHERE phone_number = ${phoneNumber}
  `
  return result[0] || null
}

// Attachment functions
export async function getAttachmentsByRelated(relatedType: string, relatedId: string): Promise<Attachment[]> {
  const sql = getDatabase()
  const result = await sql`
    SELECT * FROM attachments 
    WHERE related_type = ${relatedType} AND related_id = ${relatedId}
    ORDER BY uploaded_at DESC
  `
  return result as Attachment[]
}

export async function getAttachmentsByUser(userId: string, attachmentType?: string): Promise<Attachment[]> {
  const sql = getDatabase()
  let result

  if (attachmentType) {
    result = await sql`
      SELECT * FROM attachments 
      WHERE user_id = ${userId} AND attachment_type = ${attachmentType}
      ORDER BY uploaded_at DESC
    `
  } else {
    result = await sql`
      SELECT * FROM attachments 
      WHERE user_id = ${userId}
      ORDER BY uploaded_at DESC
    `
  }

  return result as Attachment[]
}

// Purchase Request functions
export async function getPurchaseRequests(userId: string): Promise<PurchaseRequest[]> {
  if (!userId) return []

  const sql = getDatabase()
  const result = await sql`
    SELECT * FROM purchase_requests 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `
  return result as PurchaseRequest[]
}

export async function getPurchaseRequestById(id: string): Promise<PurchaseRequest | null> {
  const sql = getDatabase()
  const [request] = await sql`
    SELECT * FROM purchase_requests WHERE id = ${id}
  `

  if (!request) return null

  // Get items with their attachments
  const items = await sql`
    SELECT * FROM purchase_request_items 
    WHERE purchase_request_id = ${id}
    ORDER BY id
  `

  // Get attachments for each item
  for (const item of items) {
    const attachments = await sql`
      SELECT * FROM attachments 
      WHERE related_type = 'purchase_request_item' AND related_id = ${item.id.toString()}
      ORDER BY uploaded_at
    `
    item.attachments = attachments
  }

  // Get timeline
  const timeline = await sql`
    SELECT * FROM purchase_request_timeline 
    WHERE purchase_request_id = ${id}
    ORDER BY date, time
  `

  return {
    ...request,
    items,
    timeline,
  } as PurchaseRequest
}

export async function getPurchaseRequestStats(userId: string) {
  const sql = getDatabase()
  const result = await sql`
    SELECT 
      status,
      COUNT(*) as count
    FROM purchase_requests 
    WHERE user_id = ${userId}
    GROUP BY status
  `

  const stats = {
    pending_review: 0,
    pending_payment: 0,
    purchasing: 0,
    completed: 0,
  }

  result.forEach((row: any) => {
    if (row.status === "pending_review") stats.pending_review = Number.parseInt(row.count)
    if (row.status === "pending_payment") stats.pending_payment = Number.parseInt(row.count)
    if (row.status === "purchasing") stats.purchasing = Number.parseInt(row.count)
    if (row.status === "completed" || row.status === "confirmed") stats.completed += Number.parseInt(row.count)
  })

  return stats
}

// Package functions
export async function getPackages(userId: string): Promise<PackageType[]> {
  if (!userId) return []

  const sql = getDatabase()
  const result = await sql`
    SELECT * FROM packages 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `
  return result as PackageType[]
}

export async function getPackageById(id: string): Promise<PackageType | null> {
  const sql = getDatabase()
  const [pkg] = await sql`
    SELECT * FROM packages WHERE id = ${id}
  `

  if (!pkg) return null

  // Get items
  const items = await sql`
    SELECT * FROM package_items 
    WHERE package_id = ${id}
    ORDER BY id
  `

  // Get attachments (receipts)
  const attachments = await sql`
    SELECT * FROM attachments 
    WHERE related_type = 'package' AND related_id = ${id}
    ORDER BY uploaded_at DESC
  `

  // Get timeline
  const timeline = await sql`
    SELECT * FROM package_timeline 
    WHERE package_id = ${id}
    ORDER BY date, time
  `

  return {
    ...pkg,
    items,
    attachments,
    timeline,
  } as PackageType
}

export async function getPackageStats(userId: string) {
  const sql = getDatabase()
  const result = await sql`
    SELECT 
      status,
      COUNT(*) as count
    FROM packages 
    WHERE user_id = ${userId}
    GROUP BY status
  `

  const stats = {
    expected: 0,
    arrived: 0,
    in_transit: 0,
    delivered: 0,
  }

  result.forEach((row: any) => {
    if (row.status === "expected") stats.expected = Number.parseInt(row.count)
    if (row.status === "arrived") stats.arrived = Number.parseInt(row.count)
    if (row.status === "in_transit") stats.in_transit = Number.parseInt(row.count)
    if (row.status === "delivered") stats.delivered = Number.parseInt(row.count)
  })

  return stats
}

// Payment Request functions
export async function getPaymentRequests(userId: string): Promise<PaymentRequest[]> {
  if (!userId) return []

  const sql = getDatabase()
  const payments = await sql`
    SELECT * FROM payment_requests 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `

  // Get breakdown and handle payment methods for each payment
  for (const payment of payments) {
    try {
      const breakdown = await sql`
        SELECT item_key, item_value FROM payment_breakdowns 
        WHERE payment_request_id = ${payment.id}
      `

      payment.breakdown = {}
      breakdown.forEach((item: any) => {
        payment.breakdown![item.item_key] = Number(item.item_value)
      })

      // Handle payment_methods column
      if (typeof payment.payment_methods === "string") {
        try {
          payment.payment_methods = JSON.parse(payment.payment_methods)
        } catch {
          payment.payment_methods = []
        }
      } else if (!Array.isArray(payment.payment_methods)) {
        payment.payment_methods = []
      }
    } catch (error) {
      console.error(`Error processing payment ${payment.id}:`, error)
      payment.breakdown = {}
      payment.payment_methods = []
    }
  }

  return payments as PaymentRequest[]
}

export async function getPaymentRequestById(id: string): Promise<PaymentRequest | null> {
  const sql = getDatabase()
  const [payment] = await sql`
    SELECT * FROM payment_requests WHERE id = ${id}
  `

  if (!payment) return null

  try {
    // Get breakdown
    const breakdown = await sql`
      SELECT item_key, item_value FROM payment_breakdowns 
      WHERE payment_request_id = ${id}
    `

    payment.breakdown = {}
    breakdown.forEach((item: any) => {
      payment.breakdown![item.item_key] = Number(item.item_value)
    })

    // Handle payment_methods column
    if (typeof payment.payment_methods === "string") {
      try {
        payment.payment_methods = JSON.parse(payment.payment_methods)
      } catch {
        payment.payment_methods = []
      }
    } else if (!Array.isArray(payment.payment_methods)) {
      payment.payment_methods = []
    }
  } catch (error) {
    console.error(`Error processing payment ${id}:`, error)
    payment.breakdown = {}
    payment.payment_methods = []
  }

  return payment as PaymentRequest
}

export async function getPaymentStats(userId: string) {
  const sql = getDatabase()
  const result = await sql`
    SELECT 
      status,
      COUNT(*) as count
    FROM payment_requests 
    WHERE user_id = ${userId}
    GROUP BY status
  `

  const stats = {
    pending: 0,
    overdue: 0,
    paid: 0,
    processing: 0,
  }

  result.forEach((row: any) => {
    if (row.status === "pending") stats.pending = Number.parseInt(row.count)
    if (row.status === "overdue") stats.overdue = Number.parseInt(row.count)
    if (row.status === "paid") stats.paid = Number.parseInt(row.count)
    if (row.status === "processing") stats.processing = Number.parseInt(row.count)
  })

  return stats
}

// Dashboard stats
export async function getDashboardStats(userId: string) {
  const sql = getDatabase()

  try {
    const packageStats = await sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM packages 
      WHERE user_id = ${userId}
      GROUP BY status
    `

    const purchaseStats = await sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM purchase_requests 
      WHERE user_id = ${userId}
      GROUP BY status
    `

    let expected_packages = 0
    let warehouse_packages = 0
    let shipped_packages = 0
    let purchase_assistance = 0

    packageStats.forEach((row: any) => {
      if (row.status === "expected") expected_packages = Number.parseInt(row.count)
      if (row.status === "arrived") warehouse_packages = Number.parseInt(row.count)
      if (row.status === "in_transit" || row.status === "delivered") shipped_packages += Number.parseInt(row.count)
    })

    purchaseStats.forEach((row: any) => {
      if (row.status === "purchasing" || row.status === "pending_review")
        purchase_assistance += Number.parseInt(row.count)
    })

    return {
      expected_packages,
      warehouse_packages,
      shipped_packages,
      purchase_assistance,
    }
  } catch (error) {
    console.error("Error in getDashboardStats:", error)
    throw error
  }
}

// Helper function to get current user ID from session
export async function getCurrentUserId(sessionId?: string): Promise<string | null> {
  if (!sessionId) return null

  try {
    // Handle Neon Auth tokens (start with "neon_")
    if (sessionId.startsWith("neon_")) {
      const tokenValidation = await validateNeonToken(sessionId)
      if (tokenValidation.valid && tokenValidation.userId) {
        return tokenValidation.userId
      }
      return null
    }

    // Handle phone auth sessions (hash format)
    const sql = getDatabase()
    const [session] = await sql`
      SELECT user_id FROM sessions 
      WHERE id = ${sessionId} 
      AND session_type = 'authenticated'
      AND expires_at > NOW()
    `

    return session?.user_id || null
  } catch (error) {
    console.error("Error getting current user ID:", error)
    return null
  }
}

// Helper function to get current user data from session
export async function getCurrentUser(sessionId?: string): Promise<User | null> {
  if (!sessionId) return null

  try {
    const sql = getDatabase()
    const [result] = await sql`
      SELECT u.* FROM users u
      JOIN sessions s ON u.id = s.user_id
      WHERE s.id = ${sessionId} 
      AND s.session_type = 'authenticated'
      AND s.expires_at > NOW()
    `

    return result || null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Utility functions for formatting
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return "0.00 MAD"

  const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount

  if (isNaN(numAmount)) return "0.00 MAD"

  return `${numAmount.toFixed(2)} MAD`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
