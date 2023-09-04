import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ClientProxy } from "@nestjs/microservices";
import { CacheService } from "@multiversx/sdk-nestjs-cache";
import { Lock } from "@multiversx/sdk-nestjs-common";
import { CacheInfo } from "@mvx-monorepo/common/utils/cache.info";
import { StatsService } from "@mvx-monorepo/common";

@Injectable()
export class CacheWarmerService {
  constructor(
    private readonly cachingService: CacheService,
    @Inject('PUBSUB_SERVICE') private clientProxy: ClientProxy,
    private readonly statsService: StatsService,
  ) { }

  @Cron(CronExpression.EVERY_5_MINUTES)
  @Lock({ name: 'ping-pong-stats', verbose: true })
  async handlePingPongInvalidations() {
    const pingPongStats = await this.statsService.getPingPongStatsRaw();
    await this.invalidateKey(CacheInfo.PingPongStats.key, pingPongStats, CacheInfo.PingPongStats.ttl);
  }

  private async invalidateKey<T>(key: string, data: T, ttl: number) {
    await Promise.all([
      this.cachingService.set(key, data, ttl),
      this.deleteCacheKey(key),
    ]);
  }

  private deleteCacheKey(key: string) {
    this.clientProxy.emit('deleteCacheKeys', [key]);
  }
}
