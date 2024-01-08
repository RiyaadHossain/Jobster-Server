import { ENUM_USER_ROLE } from '@/enums/user';
import User from './model';
import { emailSender } from '@/helpers/emailSender';
import ejs from 'ejs';
import path from 'path';
import { IConfirmAccountMail } from './interface';

const getLastUserId = async (role: ENUM_USER_ROLE) => {
  const user = await User.findOne({ role }).sort({ createdAt: -1 });

  return user?.id.substr(3);
};

const generateId = async (role: ENUM_USER_ROLE) => {
  let prefix = 'AD';
  if (role !== ENUM_USER_ROLE.ADMIN)
    prefix = role === ENUM_USER_ROLE.CANDIDATE ? 'CA' : 'CO';

  const lastUserId = (await getLastUserId(role)) || String(0).padStart(5, '0');
  let generatedId = (parseInt(lastUserId) + 1).toString().padStart(5, '0');
  generatedId = `${prefix}-${generatedId}`;

  return generatedId;
};

// const hashPassword = async (plainPassword: string) => {
//   const hashedPass = await bcrypt.hash(
//     plainPassword,
//     Number(config.BCRYPT_SALT_ROUNDS)
//   );
//   return hashedPass;
// };

const sendConfirmationEmail = async ({
  email,
  token,
  name,
  URL,
}: IConfirmAccountMail) => {
  const confirmationURL = `${URL}/confirm-account/${name}/${token}`;

  const templatePath = path.join(
    __dirname,
    '../../../views/templates/confirm-email.ejs'
  );
  const emailContent = await ejs.renderFile(templatePath, {
    name,
    confirmationURL,
  });

  const mailInfo = {
    to: email,
    subject: 'Confirm Your Account',
    html: emailContent,
  };

  await emailSender(mailInfo);
};

export const UserUtils = { generateId,  sendConfirmationEmail };
