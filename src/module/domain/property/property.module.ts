import { Module } from '@nestjs/common';
import { PropertyRepository } from './property.repository';
import { PropertyService } from './property.service';

@Module({
  providers: [PropertyRepository, PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
