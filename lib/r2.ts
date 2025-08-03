import { S3Client, CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3"

// R2 Configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!
const R2_ENDPOINT = process.env.R2_ENDPOINT!
const R2_CUSTOM_DOMAIN = process.env.R2_CUSTOM_DOMAIN!

// Create S3 client for R2
export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

// Ensure bucket exists and is publicly readable
export const ensureBucketExists = async (bucketName: string = R2_BUCKET_NAME) => {
  try {
    // Try to create the bucket
    await r2Client.send(new CreateBucketCommand({ Bucket: bucketName }))
    // Set bucket policy for public read access
    await setBucketPublicReadPolicy(bucketName)
  } catch (error: any) {
    // If bucket already exists or we don't have permission to create it, 
    // assume it exists and continue with the upload
    if (error.name === "BucketAlreadyOwnedByYou" || 
        error.name === "BucketAlreadyExists" || 
        error.name === "AccessDenied" ||
        error.Code === "AccessDenied") {
      // Try to set bucket policy for public read access even if bucket already exists
      try {
        await setBucketPublicReadPolicy(bucketName)
      } catch (policyError) {
        // Continue anyway - the upload might still work
      }
    } else {
      throw error
    }
  }
}

export const setBucketPublicReadPolicy = async (bucketName: string) => {
  try {
    const bucketPolicy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: "*",
          Action: "s3:GetObject",
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
      ],
    }
    await r2Client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(bucketPolicy),
      })
    )
  } catch (error: any) {
    // Silently fail - bucket policy might already be set
  }
}

// Export constants for use in other files
export { R2_BUCKET_NAME, R2_ENDPOINT, R2_CUSTOM_DOMAIN } 