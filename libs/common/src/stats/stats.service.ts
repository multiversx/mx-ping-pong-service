import { Injectable } from "@nestjs/common";
import { PingPongStats } from "./entities";
import { ApiService } from "@multiversx/sdk-nestjs-http";
import { ApiConfigService } from "../config";

@Injectable()
export class StatsService {
  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
  ) { }

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
