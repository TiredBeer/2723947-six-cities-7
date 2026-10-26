import {CreateOffer, OfferDocument} from './offer.model.js';

export interface OfferService {
  findById(id: string): Promise<OfferDocument | null>;
  create(offer: CreateOffer): Promise<OfferDocument>;
}
