import { Module } from "@nestjs/common";
import { ApiConfigModule } from "../config";
import { DynamicModuleUtils } from "../utils";
import { StatsService } from "./stats.service";

@Module({})
export class StatsModule {
  static forRoot(configuration: () => Record<string, any>) {
    return {
      module: StatsModule,
      imports: [
        ApiConfigModule.forRoot(configuration),
        DynamicModuleUtils.getApiModule(configuration),
        DynamicModuleUtils.getCachingModule(configuration),
      ],
      providers: [
        StatsService,
      ],
      exports: [
        StatsService,
      ],
    };
  }
}
