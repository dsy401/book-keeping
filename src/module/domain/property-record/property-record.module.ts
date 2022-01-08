import { forwardRef, Module } from '@nestjs/common';
import { PropertyRecordRepository } from './property-record.repository';
import { PropertyModule } from '../property/property.module';
import { PropertyRecordService } from './property-record.service';

@Module({
  imports: [forwardRef(() => PropertyModule)],
  providers: [PropertyRecordRepository, PropertyRecordService],
  exports: [PropertyRecordService],
})
export class PropertyRecordModule {}
