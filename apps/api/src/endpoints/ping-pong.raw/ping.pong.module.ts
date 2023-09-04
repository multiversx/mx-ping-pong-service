import { Module } from "@nestjs/common";
import { PingPongService } from "./ping.pong.service";
import { DynamicModuleUtils } from "@mvx-monorepo/common";
import configuration from "../../../config/configuration";

@Module({
  imports: [
    DynamicModuleUtils.getApiModule(configuration),
  ],
  providers: [
    PingPongService,
  ],
  exports: [
    PingPongService,
  ],
})
export class PingPongModule { }
