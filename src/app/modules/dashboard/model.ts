import { Schema, model } from 'mongoose';
import { IProfileView } from './interface';

const profileViewSchema = new Schema<IProfileView>({
  userId: { type: String, required: true },
  viewedBy: { type: String, required: true },
  viewedAt: { type: Date, default: new Date() },
});

const ProfileView = model<IProfileView>('ProfileView', profileViewSchema);
export default ProfileView;
