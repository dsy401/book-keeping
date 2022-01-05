import { Injectable } from '@nestjs/common';
import { User } from './user';
import { UserRepository } from './user.repository';
import type { UUID } from '../../../types/uuid.type';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.getByEmail(email);
  }

  public async save(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  public async getByUserId(userId: UUID): Promise<User | undefined> {
    return this.userRepository.getByUserId(userId);
  }
}
