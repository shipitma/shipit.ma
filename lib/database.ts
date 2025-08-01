// Database utility functions for the package forwarding application
// This replaces the mock data with actual database queries

import { prisma } from './prisma'

// Re-export Prisma types for convenience
export type {
  User,
  Warehouse,
  PurchaseRequest,
  PurchaseRequestItem,
  PurchaseRequestTimeline,
  Package,
  PackageItem,
  PackageTimeline,
  Attachment,
  Session,
  OtpCode,
} from '@prisma/client'

// Utility functions
export const formatCurrency = (amount: number | null | undefined | any): string => {
  if (amount === null || amount === undefined) return '0,00 €'
  const numAmount = typeof amount === 'object' && amount !== null ? Number(amount) : Number(amount)
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(numAmount)
}

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

export const formatDateWithLanguage = (date: Date | string | null | undefined, language: string = 'en'): string => {
  if (!date) return 'N/A'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const locale = language === 'fr' ? 'fr-FR' : 'en-US'
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export const formatDateTimeWithLanguage = (date: Date | string | null | undefined, language: string = 'en'): string => {
  if (!date) return 'N/A'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const locale = language === 'fr' ? 'fr-FR' : 'en-US'
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

// Authentication utilities
export const getCurrentUserId = async (): Promise<string | null> => {
  // This would typically get the user ID from the session
  // For now, return the test user ID
  return 'neon_user_1750733042197_p07n59m8t'
}

export const getCurrentUser = async () => {
  const userId = await getCurrentUserId()
  if (!userId) return null
  return await db.getUser(userId)
}

// Database utility functions using Prisma
export const db = {
  // User operations
  getUser: async (id: string) => {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        purchase_requests: true,
        packages: true,
        attachments: true,
      },
    })
  },

  getUserByPhone: async (phoneNumber: string) => {
    return await prisma.user.findUnique({
      where: { phone_number: phoneNumber },
    })
  },

  createUser: async (data: {
    phone_number: string
    email?: string
    first_name?: string
    last_name?: string
    avatar_url?: string
  }) => {
    return await prisma.user.create({
      data,
    })
  },

  // Purchase Request operations
  getPurchaseRequests: async (userId: string) => {
    return await prisma.purchaseRequest.findMany({
      where: { user_id: userId },
      include: {
        items: true,
        timeline: {
          orderBy: { created_at: 'desc' },
        },
      },
      orderBy: { created_at: 'desc' },
    })
  },

  getPurchaseRequest: async (id: string) => {
    return await prisma.purchaseRequest.findUnique({
      where: { id },
      include: {
        items: true,
        timeline: {
          orderBy: { created_at: 'desc' },
        },
      },
    })
  },

  createPurchaseRequest: async (data: {
    id: string
    user_id: string
    date: Date
    status: string
    total_amount?: number
    payment_due?: number
    items_cost?: number
    shipping_fee?: number
    service_fee?: number
    processing_fee?: number
    taxes?: number
    admin_notes?: string
  }) => {
    return await prisma.purchaseRequest.create({
      data,
    })
  },

  // Package operations
  getPackages: async (userId: string) => {
    return await prisma.package.findMany({
      where: { user_id: userId },
      include: {
        items: true,
        timeline: {
          orderBy: { created_at: 'desc' },
        },
      },
      orderBy: { created_at: 'desc' },
    })
  },

  getPackage: async (id: string) => {
    return await prisma.package.findUnique({
      where: { id },
      include: {
        items: true,
        timeline: {
          orderBy: { created_at: 'desc' },
        },
      },
    })
  },

  createPackage: async (data: {
    id: string
    user_id: string
    description: string
    status: string
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
  }) => {
    return await prisma.package.create({
      data,
    })
  },



  // Attachment operations
  getAttachments: async (userId: string) => {
    return await prisma.attachment.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    })
  },

  createAttachment: async (data: {
    user_id: string
    file_url: string
    file_name: string
    file_size: number
    file_type: string
    attachment_type: string
    related_type: string
    related_id: string
    uploaded_at?: Date
  }) => {
    return await prisma.attachment.create({
      data,
    })
  },

  // Session operations
  getSession: async (id: string) => {
    return await prisma.session.findUnique({
      where: { id },
      include: { user: true },
    })
  },

  createSession: async (data: {
    user_id?: string
    phone_number: string
    session_type: string
    expires_at: Date
    user_agent?: string
    ip_address?: string
    access_token?: string
    refresh_token?: string
  }) => {
    return await prisma.session.create({
      data,
    })
  },

  // OTP operations
  getOtpCode: async (phoneNumber: string, code: string) => {
    return await prisma.otpCode.findFirst({
      where: {
        phone_number: phoneNumber,
        code: code,
        verified: false,
        expires_at: { gt: new Date() },
      },
    })
  },

  createOtpCode: async (data: {
    phone_number: string
    code: string
    purpose: string
    expires_at: Date
  }) => {
    return await prisma.otpCode.create({
      data,
    })
  },

  // Warehouse operations
  getWarehouses: async () => {
    return await prisma.warehouse.findMany({
      orderBy: { created_at: 'desc' },
    })
  },
}

// Legacy function exports for backward compatibility
export const getPurchaseRequests = db.getPurchaseRequests
export const getPurchaseRequestById = db.getPurchaseRequest
export const getPackages = db.getPackages
export const getPackageById = db.getPackage

// Stats functions
export const getDashboardStats = async (userId: string) => {
  const [purchaseRequests, packages] = await Promise.all([
    prisma.purchaseRequest.count({ where: { user_id: userId } }),
    prisma.package.count({ where: { user_id: userId } }),
  ])

  // Get package stats by status
  const packageStats = await prisma.package.groupBy({
    by: ['status'],
    where: { user_id: userId },
    _count: { status: true },
  })

  // Categorize packages by status based on actual data
  const expectedPackages = packageStats.find(p => p.status === 'expected')?._count.status || 0
  const warehousePackages = packageStats.find(p => p.status === 'processing')?._count.status || 0
  const shippedPackages = packageStats.find(p => p.status === 'delivered')?._count.status || 0

  return {
    expected_packages: expectedPackages,
    warehouse_packages: warehousePackages,
    shipped_packages: shippedPackages,
    purchase_assistance: purchaseRequests,
  }
}

export const getPurchaseRequestStats = async (userId: string) => {
  const stats = await prisma.purchaseRequest.groupBy({
    by: ['status'],
    where: { user_id: userId },
    _count: { status: true },
  })

  return stats.reduce((acc, stat) => {
    acc[stat.status] = stat._count.status
    return acc
  }, {} as Record<string, number>)
}

export const getPackageStats = async (userId: string) => {
  const stats = await prisma.package.groupBy({
    by: ['status'],
    where: { user_id: userId },
    _count: { status: true },
  })

  return stats.reduce((acc, stat) => {
    acc[stat.status] = stat._count.status
    return acc
  }, {} as Record<string, number>)
}

// ID generation functions
export const getNextPurchaseRequestId = async (): Promise<string> => {
  const lastRequest = await prisma.purchaseRequest.findFirst({
    orderBy: { id: 'desc' },
  })
  
  if (!lastRequest) return 'PR-2025-001'
  
  const lastNumber = parseInt(lastRequest.id.split('-')[2])
  const nextNumber = lastNumber + 1
  return `PR-2025-${nextNumber.toString().padStart(3, '0')}`
}

export const getNextPackageId = async (): Promise<string> => {
  const lastPackage = await prisma.package.findFirst({
    orderBy: { id: 'desc' },
  })
  
  if (!lastPackage) return 'PKG-2025-001'
  
  const lastNumber = parseInt(lastPackage.id.split('-')[2])
  const nextNumber = lastNumber + 1
  return `PKG-2025-${nextNumber.toString().padStart(3, '0')}`
}



// Legacy database function for backward compatibility
export const getDatabase = () => prisma

// Export Prisma client for direct access when needed
export { prisma }
