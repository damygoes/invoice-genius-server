import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseProjectUrl = process.env.SUPABASE_PROJECT_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseProjectUrl, supabaseServiceRoleKey);
const prisma = new PrismaClient();

const uploadAvatarToSupabaseBucket = async (
  file: Express.Multer.File,
  filePath: string
) => {
  try {
    const { data, error } = await supabase.storage
      .from('avatar')
      .upload(filePath, file.buffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.mimetype,
      });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error uploading file: ', error);
  }
};

const saveAvatarUrlToUserDb = async (userId: string, avatarUrl: string) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profilePicture: avatarUrl,
      },
    });
    return user;
  } catch (error) {
    console.error('Error saving avatar URL to user: ', error);
  }
};

const fetchUserAvatar = async (filePath: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('avatar')
      .download(filePath);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching user avatar: ', error);
  }
};

export { fetchUserAvatar, saveAvatarUrlToUserDb, uploadAvatarToSupabaseBucket };
