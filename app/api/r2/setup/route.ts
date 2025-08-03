import { NextResponse } from "next/server"
import { setBucketPublicReadPolicy, R2_BUCKET_NAME } from "@/lib/r2"

export async function POST() {
  try {
    await setBucketPublicReadPolicy(R2_BUCKET_NAME)

    return NextResponse.json({
      success: true,
      message: `Bucket "${R2_BUCKET_NAME}" configured for public read access`,
      bucketName: R2_BUCKET_NAME,
    })
  } catch (error) {
    console.error("Error setting up R2 bucket:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to configure bucket",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
} 