import { ENUM_USER_ROLE } from '../../../enums/user';
import User from './model';

const getLastUserId = async (role: ENUM_USER_ROLE) => {
  const user = await User.findOne({ role }).sort({ createdAt: -1 });

  return user?.id;
};

const generateId = async (role: ENUM_USER_ROLE) => {
  let prefix = 'A';
  if (role !== ENUM_USER_ROLE.ADMIN)
    prefix = role === ENUM_USER_ROLE.CANDIDATE ? 'CA' : 'CO';

  const lastUserId = (await getLastUserId(role)) || String(0).padStart(5, '0');
  let generatedId = (parseInt(lastUserId) + 1).toString().padStart(5, '0');
  generatedId = `${prefix}-${generatedId}`;

  return generatedId;
};

export const UserUtils = { generateId };

