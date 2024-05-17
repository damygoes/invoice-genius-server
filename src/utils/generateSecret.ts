import crypto from 'crypto';

export default function generateSecret() {
  return crypto.randomBytes(32).toString('hex');
}
