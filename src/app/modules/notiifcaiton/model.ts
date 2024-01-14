import { Schema, model } from 'mongoose';
import { INotification } from './interface';
import { ENUM_USER_ROLE } from '@/enums/user';
import { ENUM_NOFICATION_TYPE } from '@/enums/notification';

const notificationSchema = new Schema<INotification>(
  {
    from: {
      _id: { type: Schema.Types.ObjectId },
      name: String,
      role: { type: String, enum: Object.values(ENUM_USER_ROLE) },
    },
    to: {
      _id: { type: Schema.Types.ObjectId },
      name: String,
      role: { type: String, enum: Object.values(ENUM_USER_ROLE) },
    },
    type: {
      type: String,
      enum: Object.values(ENUM_NOFICATION_TYPE),
      required: true,
    },
    job: { _id: { type: Schema.Types.ObjectId, ref: 'Job' }, title: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = model<INotification>('Notification', notificationSchema);

export default Notification;
