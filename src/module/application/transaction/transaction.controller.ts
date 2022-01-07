import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { TransactionService } from '../../domain/transaction/transaction.service';
import { Transaction } from '../../domain/transaction/transaction';
import { DateTime } from 'luxon';
import {
  CreateTransactionRequestDto,
  GetByDateRangeRequestDto,
  PartialUpdateRequestDto,
  TransactionIdParams,
} from './types/request.types';
import { InternalException } from '../../../exception/internal-exception';
import { TransactionResponseDto } from './types/response.types';
import { UseJwtGuard } from '../../global/guard/jwt.guard';
import { JwtRequest } from '../../../types/request.type';
import { TransactionCategory } from '../../domain/transaction-category/transaction-category';

@Controller('api/v1/transaction')
@UseJwtGuard()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/')
  public async createTransaction(
    @Body()
    { categoryId, note, amount, transactionDate }: CreateTransactionRequestDto,
    @Req() { user: { userId } }: JwtRequest,
  ): Promise<TransactionResponseDto> {
    const transaction = new Transaction(
      userId,
      categoryId,
      note,
      amount,
      DateTime.fromISO(transactionDate),
    );
    await this.transactionService.save(transaction);
    return transaction;
  }

  @Get('/:startDate/:endDate')
  public async getByDateRange(
    @Req() { user: { userId, timezone } }: JwtRequest,
    @Param() { startDate, endDate }: GetByDateRangeRequestDto,
  ): Promise<TransactionResponseDto[]> {
    return this.transactionService.getByDateRange(
      userId,
      DateTime.fromISO(startDate, {
        zone: timezone,
      }),
      DateTime.fromISO(endDate, {
        zone: timezone,
      }).plus({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 999,
      }),
    );
  }

  @Get(':transactionId')
  public async getByTransactionId(
    @Param() { transactionId }: TransactionIdParams,
    @Req() { user: { userId } }: JwtRequest,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionService.getByTransactionId(
      transactionId,
      userId,
    );

    if (!transaction) {
      throw new InternalException(
        'TRANSACTION.NOT_FOUND',
        'transaction not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return transaction;
  }

  @Delete(':transactionId')
  public async deleteTransaction(
    @Param() { transactionId }: TransactionIdParams,
    @Req() { user: { userId } }: JwtRequest,
  ): Promise<void> {
    return this.transactionService.delete(transactionId, userId);
  }

  @Patch(':transactionId')
  public async partialUpdate(
    @Param() { transactionId }: TransactionIdParams,
    @Body() { name, value }: PartialUpdateRequestDto,
    @Req() { user: { userId } }: JwtRequest,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionService.getByTransactionId(
      transactionId,
      userId,
    );

    if (!transaction) {
      throw new InternalException(
        'TRANSACTION.NOT_FOUND',
        'transaction not found',
        HttpStatus.NOT_FOUND,
      );
    }

    transaction[name as any] = value;

    await this.transactionService.save(transaction);

    return transaction;
  }

  //TODO: add get transactions by categoryID
}
