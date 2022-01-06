import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { TransactionCategoryService } from '../../domain/transaction-category/transaction-category.service';
import {
  CreateTransactionCategoryRequestDto,
  TransactionCategoryIdParams,
} from './types/request.types';
import { JwtRequest } from '../../../types/request.type';
import { UseJwtGuard } from '../../global/guard/jwt.guard';
import { TransactionCategoryResponseDto } from './types/response.types';
import { TransactionCategory } from '../../domain/transaction-category/transaction-category';

@Controller('api/v1/transaction-category')
@UseJwtGuard()
export class TransactionCategoryController {
  constructor(
    private readonly transactionCategoryService: TransactionCategoryService,
  ) {}

  @Post('/')
  public async createTransactionCategory(
    @Body() { type, name, icon }: CreateTransactionCategoryRequestDto,
    @Req() { user: { userId } }: JwtRequest,
  ): Promise<TransactionCategoryResponseDto> {
    const transactionCategory = new TransactionCategory(
      userId,
      type,
      name,
      icon,
    );

    await this.transactionCategoryService.save(transactionCategory);

    return transactionCategory;
  }

  // side effect (category attached to the transaction)
  @Delete(':categoryId')
  public async deleteTransactionCategory(
    @Param() { categoryId }: TransactionCategoryIdParams,
    @Req() { user: { userId } }: JwtRequest,
  ): Promise<void> {
    return this.transactionCategoryService.delete(categoryId, userId);
  }

  @Get('/all')
  public async getAllTransactionCategories(
    @Req() { user: { userId } }: JwtRequest,
  ): Promise<TransactionCategoryResponseDto[]> {
    return this.transactionCategoryService.getByUserId(userId);
  }
}
