import { SellerModel } from '@users/models/seller.schema';
import { IOrderMessage, IRatingTypes, IReviewMessageDetails, ISellerDocument } from '@jahidhiron/jobber-shared';
import mongoose from 'mongoose';
import { updateBuyerIsSellerProp } from '@users/services/buyer.service';

export const getSellerById = async (sellerId: string): Promise<ISellerDocument | null> => {
  const seller = (await SellerModel.findOne({
    _id: new mongoose.Types.ObjectId(sellerId)
  }).exec()) as ISellerDocument | null;

  return seller;
};

export const getSellerByUsername = async (username: string): Promise<ISellerDocument | null> => {
  const seller = (await SellerModel.findOne({ username }).exec()) as ISellerDocument | null;

  return seller;
};

export const getSellerByEmail = async (email: string): Promise<ISellerDocument | null> => {
  const seller = (await SellerModel.findOne({ email }).exec()) as ISellerDocument | null;

  return seller;
};

export const getRandomSellers = async (size: number): Promise<ISellerDocument[]> => {
  const sellers = (await SellerModel.aggregate([{ $sample: { size } }])) as ISellerDocument[];

  return sellers;
};

export const createSeller = async (sellerData: ISellerDocument): Promise<ISellerDocument> => {
  const createdSeller = (await SellerModel.create(sellerData)) as ISellerDocument;
  await updateBuyerIsSellerProp(`${createdSeller.email}`);

  return createdSeller;
};

export const updateSeller = async (sellerId: string, sellerData: ISellerDocument): Promise<ISellerDocument> => {
  const updatedSeller = (await SellerModel.findOneAndUpdate(
    { _id: sellerId },
    {
      $set: {
        profilePublicId: sellerData.profilePublicId,
        fullName: sellerData.fullName,
        profilePicture: sellerData.profilePicture,
        description: sellerData.description,
        country: sellerData.country,
        skills: sellerData.skills,
        oneliner: sellerData.oneliner,
        languages: sellerData.languages,
        responseTime: sellerData.responseTime,
        experience: sellerData.experience,
        education: sellerData.education,
        socialLinks: sellerData.socialLinks,
        certificates: sellerData.certificates
      }
    },
    { new: true }
  ).exec()) as ISellerDocument;

  return updatedSeller;
};

export const updateTotalGigsCount = async (sellerId: string, count: number): Promise<void> => {
  await SellerModel.updateOne({ _id: sellerId }, { $inc: { totalGigs: count } }).exec();
};

export const updateSellerOngoingJobsProp = async (sellerId: string, ongoingJobs: number): Promise<void> => {
  await SellerModel.updateOne({ _id: sellerId }, { $inc: { ongoingJobs } }).exec();
};

export const updateSellerCancelledJobsProp = async (sellerId: string): Promise<void> => {
  await SellerModel.updateOne({ _id: sellerId }, { $inc: { ongoingJobs: -1, cancelledJobs: 1 } }).exec();
};

export const updateSellerCompletedJobsProp = async (data: IOrderMessage): Promise<void> => {
  const { sellerId, ongoingJobs, completedJobs, totalEarnings, recentDelivery } = data;

  await SellerModel.updateOne(
    { _id: sellerId },
    {
      $inc: {
        ongoingJobs,
        completedJobs,
        totalEarnings
      },
      $set: { recentDelivery: new Date(recentDelivery!) }
    }
  ).exec();
};

export const updateSellerReview = async (data: IReviewMessageDetails): Promise<void> => {
  const ratingTypes: IRatingTypes = {
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five'
  };
  const ratingKey = ratingTypes[`${data.rating}`];

  await SellerModel.updateOne(
    { _id: data.sellerId },
    {
      $inc: {
        ratingsCount: 1,
        ratingSum: data.rating,
        [`ratingCategories.${ratingKey}.value`]: data.rating,
        [`ratingCategories.${ratingKey}.count`]: 1
      }
    }
  ).exec();
};
