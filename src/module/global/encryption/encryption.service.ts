import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  public sha256Encrypt(value: string): string {
    return crypto.createHash('sha256').update(value, 'binary').digest('base64');
  }
}
