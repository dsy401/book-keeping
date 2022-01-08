import { forwardRef, Module } from '@nestjs/common';
import { PropertyRepository } from './property.repository';
import { PropertyService } from './property.service';
import { PropertyRecordModule } from '../property-record/property-record.module';

@Module({
  imports: [forwardRef(() => PropertyRecordModule)],
  providers: [PropertyRepository, PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
