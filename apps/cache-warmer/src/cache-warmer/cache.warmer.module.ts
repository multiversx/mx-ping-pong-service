import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DynamicModuleUtils } from '@mvx-monorepo/common/utils/dynamic.module.utils';
import { CacheWarmerService } from './cache.warmer.service';
import { ApiConfigModule, StatsModule } from '@mvx-monorepo/common';
import configuration from '../../config/configuration';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ApiConfigModule.forRoot(configuration),
    DynamicModuleUtils.getCachingModule(configuration),
    StatsModule.forRoot(configuration),
  ],
  providers: [
    DynamicModuleUtils.getNestJsApiConfigService(),
    DynamicModuleUtils.getPubSubService(),
    CacheWarmerService,
  ],
})
export class CacheWarmerModule { }
