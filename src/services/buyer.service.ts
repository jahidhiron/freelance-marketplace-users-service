import { BuyerModel } from '@users/models/buyer.schema';
import { IBuyerDocument } from '@jahidhiron/jobber-shared';

export const getBuyerByEmail = async (email: string): Promise<IBuyerDocument | null> => {
  const buyer = (await BuyerModel.findOne({ email }).exec()) as IBuyerDocument | null;
  return buyer;
};

export const getBuyerByUsername = async (username: string): Promise<IBuyerDocument | null> => {
  const buyer = (await BuyerModel.findOne({ username }).exec()) as IBuyerDocument | null;
  return buyer;
};

export const getRandomBuyers = async (count: number): Promise<IBuyerDocument[]> => {
  const buyers = (await BuyerModel.aggregate([{ $sample: { size: count } }])) as IBuyerDocument[];
  return buyers;
};

export const createBuyer = async (buyerData: IBuyerDocument): Promise<void> => {
  const checkIfBuyerExist = (await getBuyerByEmail(`${buyerData.email}`)) as IBuyerDocument | null;
  if (!checkIfBuyerExist) {
    await BuyerModel.create(buyerData);
  }
};

export const updateBuyerIsSellerProp = async (email: string): Promise<void> => {
  await BuyerModel.updateOne(
    { email },
    {
      $set: {
        isSeller: true
      }
    }
  ).exec();
};

export const updateBuyerPurchasedGigsProp = async (buyerId: string, purchasedGigId: string, type: string): Promise<void> => {
  await BuyerModel.updateOne(
    { _id: buyerId },
    type === 'purchased-gigs'
      ? {
          $push: {
            purchasedGigs: purchasedGigId
          }
        }
      : {
          $pull: {
            purchasedGigs: purchasedGigId
          }
        }
  ).exec();
};
