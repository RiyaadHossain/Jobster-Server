import { Schema, model } from 'mongoose';
import { IWishlist } from './interface';

const wishlistSchema = new Schema<IWishlist>(
  {
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  },
  { timestamps: true }
);

const Wishlist = model<IWishlist>('Wishlist', wishlistSchema);
export default Wishlist;
