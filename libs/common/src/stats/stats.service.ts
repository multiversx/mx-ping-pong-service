import { Injectable } from "@nestjs/common";
import { PingPongStats } from "./entities";
import { ApiService } from "@multiversx/sdk-nestjs-http";
import { ApiConfigService } from "../config";
import { CacheService } from "@multiversx/sdk-nestjs-cache";
import { CacheInfo } from "../utils";

@Injectable()
export class StatsService {
  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
    private readonly cacheService: CacheService,
  ) { }

  async getPingPongStats(): Promise<PingPongStats> {
    return await this.cacheService.getOrSet(
      CacheInfo.PingPongStats.key,
      async () => await this.getPingPongStatsRaw(),
      CacheInfo.PingPongStats.ttl,
    );
  }

  async getPingPongStatsRaw(): Promise<PingPongStats> {
    const apiUrl = this.apiConfigService.getApiUrl();
    const contract = this.apiConfigService.getPingPongContract();

    const { data: pingTransactions } = await this.apiService.get(`${apiUrl}/accounts/${contract}/transactions/count?function=ping`);
    const { data: pongTransactions } = await this.apiService.get(`${apiUrl}/accounts/${contract}/transactions/count?function=pong`);

    return {
      pingTransactions,
      pongTransactions,
    };
  }
}
