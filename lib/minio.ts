import { S3Client, CreateBucketCommand } from "@aws-sdk/client-s3"

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
  } catch (error: any) {
    if (error.name === "BucketAlreadyOwnedByYou" || error.name === "BucketAlreadyExists") {
      console.log(`Bucket "${bucketName}" already exists.`)
    } else {
      console.error(`Error ensuring bucket "${bucketName}" exists:`, error)
      throw error
    }
  }
} 