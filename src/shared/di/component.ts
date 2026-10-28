export const Component = {
  Application: Symbol.for('Application'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  MongoConnection: Symbol.for('MongoConnection'),
  Database: Symbol.for('Database'),
  UserModel: Symbol.for('UserModel'),
  OfferModel: Symbol.for('OfferModel'),
  UserService: Symbol.for('UserService'),
  OfferService: Symbol.for('OfferService'),
  ImportOffers: Symbol.for('ImportOffers'),
} as const;
