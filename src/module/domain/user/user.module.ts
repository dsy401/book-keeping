import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from '../../global/database/database.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
