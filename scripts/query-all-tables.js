import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  const warehouses = await prisma.warehouse.findMany();
  const purchaseRequests = await prisma.purchaseRequest.findMany();
  const purchaseRequestItems = await prisma.purchaseRequestItem.findMany();
  const purchaseRequestTimeline = await prisma.purchaseRequestTimeline.findMany();
  const packages = await prisma.package.findMany();
  const packageItems = await prisma.packageItem.findMany();
  const packageTimeline = await prisma.packageTimeline.findMany();
  const attachments = await prisma.attachment.findMany();
  const sessions = await prisma.session.findMany();
  const otpCodes = await prisma.otpCode.findMany();

  console.log('users:', JSON.stringify(users, null, 2));
  console.log('warehouses:', JSON.stringify(warehouses, null, 2));
  console.log('purchase_requests:', JSON.stringify(purchaseRequests, null, 2));
  console.log('purchase_request_items:', JSON.stringify(purchaseRequestItems, null, 2));
  console.log('purchase_request_timeline:', JSON.stringify(purchaseRequestTimeline, null, 2));
  console.log('packages:', JSON.stringify(packages, null, 2));
  console.log('package_items:', JSON.stringify(packageItems, null, 2));
  console.log('package_timeline:', JSON.stringify(packageTimeline, null, 2));
  console.log('attachments:', JSON.stringify(attachments, null, 2));
  console.log('sessions:', JSON.stringify(sessions, null, 2));
  console.log('otp_codes:', JSON.stringify(otpCodes, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });