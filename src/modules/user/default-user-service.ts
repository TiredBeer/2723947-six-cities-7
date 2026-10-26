import {randomBytes, scrypt as scryptCallback} from 'node:crypto';
import {promisify} from 'node:util';
import {inject, injectable} from 'inversify';
import {Component} from '../../shared/di/component.js';
import {User} from '../../types.js';
import {UserDocument, UserModel} from './user.model.js';
import {UserService} from './user-service.interface.js';

const scrypt = promisify(scryptCallback);

@injectable()
export class DefaultUserService implements UserService {
  constructor(@inject(Component.UserModel) private readonly model: UserModel) {}

  public async findById(id: string): Promise<UserDocument | null> {
    return this.model.findById(id).exec();
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return this.model.findOne({email}).exec();
  }

  public async create(user: User): Promise<UserDocument> {
    await this.model.init();
    const {password, ...data} = user;
    const salt = randomBytes(16).toString('hex');
    const hash = await scrypt(password, salt, 64) as Buffer;
    return this.model.create({...data, passwordHash: `${salt}:${hash.toString('hex')}`});
  }
}
