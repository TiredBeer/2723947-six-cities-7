import {User} from '../../types.js';
import {UserDocument} from './user.model.js';

export interface UserService {
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  create(user: User): Promise<UserDocument>;
}
