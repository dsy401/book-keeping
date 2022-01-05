import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AppService {
  constructor(private readonly i18nService: I18nService) {}

  public async getHello(): Promise<string> {
    return this.i18nService.translate('language.WELCOME_MESSAGE');
  }
}
