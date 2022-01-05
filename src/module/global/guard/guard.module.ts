import { Global, Module } from '@nestjs/common';
import { JwtGuard } from './jwt.guard';
import { UserModule } from '../../domain/user/user.module';

@Global()
@Module({
  imports: [UserModule],
  providers: [JwtGuard],
})
export class GuardModule {}
