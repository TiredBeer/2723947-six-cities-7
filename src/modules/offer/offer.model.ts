import {Connection, HydratedDocument, Model, Schema, Types} from 'mongoose';
import {AMENITIES, CITIES, HOUSING_TYPES, Offer} from '../../types.js';

export type OfferRecord = Omit<Offer, 'author'> & {
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateOffer = Omit<OfferRecord, 'createdAt' | 'updatedAt' | 'commentsCount'>;
export type OfferDocument = HydratedDocument<OfferRecord>;
export type OfferModel = Model<OfferRecord>;

const offerSchema = new Schema<OfferRecord>({
  title: {type: String, required: true},
  description: {type: String, required: true},
  publicationDate: {type: Date, required: true},
  city: {type: String, enum: CITIES, required: true},
  previewImage: {type: String, required: true},
  images: {type: [String], required: true},
  isPremium: {type: Boolean, required: true},
  isFavorite: {type: Boolean, default: false},
  rating: {type: Number, required: true},
  housingType: {type: String, enum: HOUSING_TYPES, required: true},
  bedrooms: {type: Number, required: true},
  maxAdults: {type: Number, required: true},
  price: {type: Number, required: true},
  amenities: {type: [String], enum: AMENITIES, required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  commentsCount: {type: Number, default: 0},
  coordinates: {
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
  },
}, {timestamps: true, collection: 'offers', bufferCommands: false});

export function createOfferModel(connection: Connection): OfferModel {
  return connection.model<OfferRecord>('Offer', offerSchema);
}
