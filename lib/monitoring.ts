// Production monitoring and logging
export class ProductionLogger {
  static info(message: string, meta?: Record<string, any>) {
    console.log(
      JSON.stringify({
        level: "info",
        message,
        timestamp: new Date().toISOString(),
        ...meta,
      }),
    )
  }

  static error(message: string, error?: Error, meta?: Record<string, any>) {
    console.error(
      JSON.stringify({
        level: "error",
        message,
        error: error?.message,
        stack: error?.stack,
        timestamp: new Date().toISOString(),
        ...meta,
      }),
    )
  }

  static warn(message: string, meta?: Record<string, any>) {
    console.warn(
      JSON.stringify({
        level: "warn",
        message,
        timestamp: new Date().toISOString(),
        ...meta,
      }),
    )
  }
}

// Health check endpoint
export async function healthCheck() {
  const checks = {
    database: false,
    whatsapp: false,
    storage: false,
  }

  try {
    // Database check
    const { neon } = await import("@neondatabase/serverless")
    const sql = neon(process.env.DATABASE_URL!)
    await sql`SELECT 1`
    checks.database = true
  } catch (error) {
    ProductionLogger.error("Database health check failed", error as Error)
  }

  try {
    // WhatsApp API check (just verify token format)
    if (process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_API_TOKEN.length > 10) {
      checks.whatsapp = true
    }
  } catch (error) {
    ProductionLogger.error("WhatsApp health check failed", error as Error)
  }

  try {
    // Storage check (R2)
    if (process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
      checks.storage = true
    }
  } catch (error) {
    ProductionLogger.error("Storage health check failed", error as Error)
  }

  return {
    status: Object.values(checks).every(Boolean) ? "healthy" : "unhealthy",
    checks,
    timestamp: new Date().toISOString(),
  }
}
