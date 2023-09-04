import { PingPongStats, StatsService } from "@mvx-monorepo/common";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller('stats')
@ApiTags('stats')
export class StatsController {
  constructor(
    private readonly statsService: StatsService
  ) { }

  @Get("/ping-pong")
  async getPingPongStats(): Promise<PingPongStats> {
    return await this.statsService.getPingPongStats();
  }
}
