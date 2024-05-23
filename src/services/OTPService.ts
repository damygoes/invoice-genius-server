import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const storeOTP = async (email: string, otp: string) => {
  const expiration = new Date(
    Date.now() + parseInt(process.env.OTP_EXPIRATION!, 10)
  );

  await prisma.oTPStore.upsert({
    where: { email },
    update: { otp, otpExpiration: expiration },
    create: { email, otp, otpExpiration: expiration },
  });
};

export const verifyOTP = async (
  email: string,
  otp: string
): Promise<boolean> => {
  const user = await prisma.oTPStore.findUnique({ where: { email } });
  if (!user || !user.otp || !user.otpExpiration) return false;

  const isExpired = user.otpExpiration < new Date();
  if (isExpired) {
    await prisma.oTPStore.update({
      where: { email },
      data: { otp: null, otpExpiration: null },
    });
    return false;
  }

  const isValid = user.otp === otp;
  if (isValid) {
    await prisma.oTPStore.update({
      where: { email },
      data: { otp: null, otpExpiration: null },
    });
  }

  return isValid;
};
