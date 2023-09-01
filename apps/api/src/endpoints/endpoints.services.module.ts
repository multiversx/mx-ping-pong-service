import { ApiConfigModule, DynamicModuleUtils } from "@mvx-monorepo/common";
import { Module } from "@nestjs/common";
import configuration from '../../config/configuration';
import { PingPongModule } from "./ping.pong/ping.pong.module";

@Module({
  imports: [
    PingPongModule,
    ApiConfigModule.forRoot(configuration),
    DynamicModuleUtils.getCachingModule(configuration),
  ],
  providers: [
    DynamicModuleUtils.getNestJsApiConfigService(),
  ],
  exports: [
    PingPongModule,
  ],
})
export class EndpointsServicesModule { }
