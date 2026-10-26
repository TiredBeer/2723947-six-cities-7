import 'reflect-metadata';
import {Container} from 'inversify';
import {Connection, createConnection} from 'mongoose';
import {ImportOffers} from '../../import-offers.js';
import {createUserModel, UserModel} from '../../modules/user/user.model.js';
import {DefaultUserService} from '../../modules/user/default-user-service.js';
import {UserService} from '../../modules/user/user-service.interface.js';
import {createOfferModel, OfferModel} from '../../modules/offer/offer.model.js';
import {DefaultOfferService} from '../../modules/offer/default-offer-service.js';
import {OfferService} from '../../modules/offer/offer-service.interface.js';
import {Database} from '../database/database.interface.js';
import {MongoDatabase} from '../database/mongo-database.js';
import {Application} from '../../app/application.js';
import {Config} from '../config/config.interface.js';
import {ConfigService} from '../config/config-service.js';
import {Logger} from '../logger/logger.interface.js';
import {PinoLogger} from '../logger/pino-logger.js';
import {Component} from './component.js';

export const container = new Container();
container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
container.bind<Config>(Component.Config).to(ConfigService).inSingletonScope();
container.bind<Application>(Component.Application).to(Application).inSingletonScope();
container.bind<Connection>(Component.MongoConnection).toConstantValue(createConnection());
container.bind<Database>(Component.Database).to(MongoDatabase).inSingletonScope();
container.bind<UserModel>(Component.UserModel).toDynamicValue(() =>
  createUserModel(container.get<Connection>(Component.MongoConnection))).inSingletonScope();
container.bind<OfferModel>(Component.OfferModel).toDynamicValue(() =>
  createOfferModel(container.get<Connection>(Component.MongoConnection))).inSingletonScope();
container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
container.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
container.bind<ImportOffers>(Component.ImportOffers).to(ImportOffers).inSingletonScope();
