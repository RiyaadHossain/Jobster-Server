/* eslint-disable no-undef */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
  DEFAULT_COMPANY_PASS: process.env.DEFAULT_COMPANY_PASS,
  DEFAULT_CANDIDATE_PASS: process.env.DEFAULT_CANDIDATE_PASS,
  DEFAULT_ADMIN_PASS: process.env.DEFAULT_ADMIN_PASS,
  JWT: {
    SECRET: process.env.JWT_SECRET,
    REFRESH: process.env.JWT_REFRESH,
    SECRET_EXPIRE: process.env.JWT_SECRET_EXPIRE,
    REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE,
  },
};
