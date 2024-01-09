import config from '@/config';
import { emailSender } from '@/helpers/emailSender';
import path from 'path';
import ejs from 'ejs';

const sendResetPasswordEmail = async (
  email: string,
  token: string,
  name: string
) => {
  const passwordResetURL = `${config.CLIENT_URL}/reset-password/${token}`;

  const templatePath = path.join(
    __dirname,
    '../../../views/templates/reset-password.ejs'
  );
  const emailBody = await ejs.renderFile(templatePath, {
    name,
    email,
    passwordResetURL,
  });

  const mailInfo = {
    to: email,
    subject: 'Reset Password',
    html: emailBody,
  };

  await emailSender(mailInfo);
};

const sendConfirmResetPasswordEmail = async (email: string, name: string) => {
  const clientURL = config.CLIENT_URL;
  const templatePath = path.join(
    __dirname,
    '../../../views/templates/success-reset-password.ejs'
  );
  const emailBody = await ejs.renderFile(templatePath, {
    name,
    email,
    clientURL,
  });

  const mailInfo = {
    to: email,
    subject: 'Password is reset successfully',
    html: emailBody,
  };

  await emailSender(mailInfo);
};

export const AuthUtils = {
  sendResetPasswordEmail,
  sendConfirmResetPasswordEmail,
};
