import {inject, injectable} from 'inversify';
import {Component} from '../../shared/di/component.js';
import {CreateOffer, OfferDocument, OfferModel} from './offer.model.js';
import {OfferService} from './offer-service.interface.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(@inject(Component.OfferModel) private readonly model: OfferModel) {}

  public async findById(id: string): Promise<OfferDocument | null> {
    return this.model.findById(id).exec();
  }

  public async create(offer: CreateOffer): Promise<OfferDocument> {
    return this.model.create(offer);
  }
}
