import { Module } from '@nestjs/common';
import { UserModule } from '../../domain/user/user.module';
import { PropertyModule as PropertyDomainModule } from '../../domain/property/property.module';
import { PropertyController } from './property.controller';
import { PropertyRecordModule } from '../../domain/property-record/property-record.module';

@Module({
  imports: [PropertyDomainModule, UserModule, PropertyRecordModule],
  controllers: [PropertyController],
})
export class PropertyModule {}
