import { Module } from '@nestjs/common';
import { UserModule } from '../../domain/user/user.module';
import { PropertyModule as PropertyDomainModule } from '../../domain/property/property.module';
import { PropertyController } from './property.controller';

@Module({
  imports: [PropertyDomainModule, UserModule],
  controllers: [PropertyController],
})
export class PropertyModule {}
