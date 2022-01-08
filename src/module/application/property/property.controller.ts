import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { UseJwtGuard } from '../../global/guard/jwt.guard';
import { PropertyResponseDto } from './types/response.types';
import {
  CreatePropertyRequestDto,
  PropertyIdParams,
  UpdatePropertyAmountRequestDto,
  UpdatePropertyRequestDto,
} from './types/request.types';
import { JwtRequest } from '../../../types/request.type';
import { Property } from '../../domain/property/property';
import { PropertyService } from '../../domain/property/property.service';

@Controller('api/v1/property')
@UseJwtGuard()
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post('/')
  public async createProperty(
    @Body() { type, amount, note, name }: CreatePropertyRequestDto,
    @Req() { user: { userId } }: JwtRequest,
  ): Promise<PropertyResponseDto> {
    const property = new Property(userId, type, amount, note, name);

    await this.propertyService.save(property);

    return property;
  }

  @Delete('/:propertyId')
  public deleteProperty(
    @Param() { propertyId }: PropertyIdParams,
    @Req() { user: { userId } }: JwtRequest,
  ): Promise<void> {
    return this.propertyService.delete(propertyId, userId);
  }

  @Get('/all')
  public async getAllProperties(
    @Req() { user: { userId } }: JwtRequest,
  ): Promise<PropertyResponseDto[]> {
    return this.propertyService.getByUserId(userId);
  }

  @Patch(':propertyId')
  public updatePropertyAmount(
    @Param() { propertyId }: PropertyIdParams,
    @Body() { amount }: UpdatePropertyAmountRequestDto,
    @Req() { user: { userId } }: JwtRequest,
  ): Promise<PropertyResponseDto> {
    return this.propertyService.updateAmount(propertyId, userId, amount);
  }

  @Put(':propertyId')
  public updateProperty(
    @Param() { propertyId }: PropertyIdParams,
    @Req() { user: { userId } }: JwtRequest,
    @Body() { amount, note, name }: UpdatePropertyRequestDto,
  ): Promise<PropertyResponseDto> {
    return this.propertyService.update(propertyId, userId, amount, note, name);
  }
}
