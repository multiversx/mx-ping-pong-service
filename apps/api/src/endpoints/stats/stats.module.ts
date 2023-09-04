import { Module } from "@nestjs/common";
import { DynamicModuleUtils } from "@mvx-monorepo/common";
import { StatsModule as StatsServiceModule } from "@mvx-monorepo/common";
import configuration from "../../../config/configuration";

@Module({
  imports: [
    StatsServiceModule.forRoot(configuration),
    DynamicModuleUtils.getApiModule(configuration),
  ],
  providers: [],
  exports: [],
})
export class StatsModule { }
