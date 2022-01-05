import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { InternalConfigModule } from '../config/internal-config.module';

@Global()
@Module({
  imports: [InternalConfigModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
