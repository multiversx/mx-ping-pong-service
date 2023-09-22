import { ApiConfigModule, DynamicModuleUtils, StatsModule } from "@mvx-monorepo/common";
import { Module } from "@nestjs/common";
import configuration from '../../config/configuration';
import { PingPongModule as PingPongRawModule } from "./ping-pong.raw/ping.pong.module";
import { PingPongModule as PingPongAbiModule } from "./ping-pong.abi/ping.pong.module";
import { PingPongModule as PingPongAbiWithCacheModule } from "./ping-pong.abi-with-cache/ping.pong.module";
import { AccountModule } from "./account/account.module";

@Module({
  imports: [
    AccountModule,
    PingPongRawModule,
    PingPongAbiModule,
    PingPongAbiWithCacheModule,
    StatsModule.forRoot(configuration),
    ApiConfigModule.forRoot(configuration),
    DynamicModuleUtils.getCachingModule(configuration),
  ],
  providers: [
    DynamicModuleUtils.getNestJsApiConfigService(),
  ],
  exports: [
    AccountModule,
    PingPongRawModule,
    PingPongAbiModule,
    PingPongAbiWithCacheModule,
    StatsModule,
  ],
})
export class EndpointsServicesModule { }
