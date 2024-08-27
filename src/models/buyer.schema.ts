import { IBuyerDocument } from '@jahidhiron/jobber-shared';
import mongoose, { Schema, model } from 'mongoose';

const buyerSchema = new Schema(
  {
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    profilePicture: { type: String, required: true },
    country: { type: String, required: true },
    isSeller: { type: Boolean, default: false },
    purchasedGigs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }],
    createdAt: { type: Date }
  },
  {
    versionKey: false
  }
);

export const BuyerModel = model<IBuyerDocument>('Buyer', buyerSchema, 'Buyer');
