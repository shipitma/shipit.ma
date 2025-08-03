import { NextResponse } from "next/server"
import { setBucketPublicReadPolicy, MINIO_BUCKET_NAME } from "@/lib/minio"

export async function POST() {
  try {
    await setBucketPublicReadPolicy(MINIO_BUCKET_NAME)
    
    return NextResponse.json({
      success: true,
      message: `Bucket "${MINIO_BUCKET_NAME}" configured for public read access`,
      bucketName: MINIO_BUCKET_NAME,
    })
  } catch (error) {
    console.error("Error setting up MinIO bucket:", error)
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