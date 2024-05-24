import * as dotenv from 'dotenv';
import { Response } from 'express';
import {
  fetchUserAvatar,
  saveAvatarUrlToUserDb,
  uploadAvatarToSupabaseBucket,
} from '../db-actions/avatarUploadActions';
import { getUserWithEmail } from '../db-actions/userActions';
import { CustomRequest } from '../types/CustomRequest';
import { blobToBase64 } from '../utils/blobToBase64';
dotenv.config();

const uploadAvatarHandler = async (req: CustomRequest, res: Response) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('File is required');
  }

  const existingUser = await getUserWithEmail(req.user?.email!);

  if (!existingUser) {
    return res.status(404).send('User not found');
  }

  const filePath = `${existingUser.id}/${file.originalname}`;

  try {
    const bucketUrl = await uploadAvatarToSupabaseBucket(file, filePath);
    if (!bucketUrl) {
      return res.status(500).send('Error uploading file');
    }

    await saveAvatarUrlToUserDb(existingUser.id, bucketUrl.path);

    const downloadedAvatarBlob = await fetchUserAvatar(filePath);

    if (downloadedAvatarBlob) {
      const base64String = await blobToBase64(downloadedAvatarBlob);
      return res.status(200).json({
        message: 'Avatar downloaded successfully',
        avatarBase64: base64String,
      });
    } else {
      return res.status(404).json({
        message: 'Avatar not found',
      });
    }
  } catch (error) {}
};

const getUserAvatar = async (req: CustomRequest, res: Response) => {
  const existingUser = await getUserWithEmail(req.user?.email!);

  if (!existingUser) {
    return res.status(404).send('User not found');
  }
  try {
    const downloadedAvatarBlob = await fetchUserAvatar(
      existingUser.profilePicture!
    );

    if (downloadedAvatarBlob) {
      const base64String = await blobToBase64(downloadedAvatarBlob);
      return res.status(200).json({
        message: 'Avatar downloaded successfully',
        avatarBase64: base64String,
      });
    } else {
      return res.status(404).json({
        message: 'Avatar not found',
      });
    }
  } catch (error) {
    console.error('Error fetching user avatar: ', error);
  }
};

export { getUserAvatar, uploadAvatarHandler };
