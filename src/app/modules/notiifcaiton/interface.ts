import { ENUM_NOFICATION_TYPE } from '@/enums/notification';
import { ENUM_USER_ROLE } from '@/enums/user';
import { Types } from 'mongoose';

export type INotification = {
  type: ENUM_NOFICATION_TYPE;
  from: { _id: Types.ObjectId; name: string; role: ENUM_USER_ROLE };
  to: { _id: Types.ObjectId; name: string; role: ENUM_USER_ROLE };
  job?: { _id: Types.ObjectId; title: string };
  isRead?: boolean;
};
