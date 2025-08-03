import { S3Client, CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3"

const MINIO_ENDPOINT = process.env.MINIO_SERVER_URL!
const MINIO_ACCESS_KEY = process.env.MINIO_ROOT_USER!
const MINIO_SECRET_KEY = process.env.MINIO_ROOT_PASSWORD!
export const MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "shipit"

if (!MINIO_ENDPOINT || !MINIO_ACCESS_KEY || !MINIO_SECRET_KEY) {
  console.error("MinIO environment variables (MINIO_SERVER_URL, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD) are not set.")
}

export const s3Client = new S3Client({
  endpoint: MINIO_ENDPOINT,
  region: "us-east-1",
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
})

export const ensureBucketExists = async (bucketName: string = MINIO_BUCKET_NAME) => {
  try {
    await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }))
    console.log(`Successfully created bucket "${bucketName}" or it already existed.`)
    
    // Set bucket policy for public read access
    await setBucketPublicReadPolicy(bucketName)
  } catch (error: any) {
    if (error.name === "BucketAlreadyOwnedByYou" || error.name === "BucketAlreadyExists") {
      console.log(`Bucket "${bucketName}" already exists.`)
      // Set bucket policy for public read access even if bucket already exists
      await setBucketPublicReadPolicy(bucketName)
    } else {
      console.error(`Error ensuring bucket "${bucketName}" exists:`, error)
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

    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(bucketPolicy),
      })
    )
    console.log(`Bucket policy set for public read access on "${bucketName}"`)
  } catch (error: any) {
    console.error(`Error setting bucket policy for "${bucketName}":`, error)
    // Don't throw error as this is not critical for basic functionality
  }
} 