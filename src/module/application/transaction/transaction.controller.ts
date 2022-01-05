import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { TransactionService } from '../../domain/transaction/transaction.service';
import { Transaction } from '../../domain/transaction/transaction';
import { DateTime } from 'luxon';
import {
  CreateTransactionRequestDto,
  DeleteTransactionParams,
  GetByDateRangeRequestDto,
  GetByTransactionIdParams,
} from './types/request.types';
import { InternalException } from '../../../exception/internal-exception';
import {
  CreateTransactionResponseDto,
  GetByTransactionIdResponseDto,
  TransactionResponseDto,
} from './types/response.types';
import { UseJwtGuard } from '../../global/guard/jwt.guard';
import { JwtRequest } from '../../../types/request.type';

@Controller('api/v1/transaction')
@UseJwtGuard()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/')
  public async createTransaction(
    @Body()
    {
      type,
      categoryId,
      note,
      amount,
      transactionDate,
    }: CreateTransactionRequestDto,
    @Req() { user: { userId } }: JwtRequest,
  ): Promise<CreateTransactionResponseDto> {
    const transaction = new Transaction(
      userId,
      type,
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
    @Param() { transactionId }: GetByTransactionIdParams,
    @Req() { user: { userId } }: JwtRequest,
  ): Promise<GetByTransactionIdResponseDto> {
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
    @Param() { transactionId }: DeleteTransactionParams,
    @Req() { user: { userId } }: JwtRequest,
  ): Promise<void> {
    return this.transactionService.delete(transactionId, userId);
  }
}
