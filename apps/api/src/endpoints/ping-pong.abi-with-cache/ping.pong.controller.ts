import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PingPongService } from "./ping.pong.service";
import { Address } from "@multiversx/sdk-core/out";
import { NativeAuth, NativeAuthGuard } from "@multiversx/sdk-nestjs-auth";

@Controller('ping-pong')
@ApiTags('ping-pong.abi-with-cache')
@UseGuards(NativeAuthGuard)
@ApiBearerAuth()
export class PingPongController {
  constructor(
    private readonly pingPongService: PingPongService
  ) { }

  @Get("/time-to-pong")
  @ApiResponse({
    status: 200,
    description: 'Returns one example',
  })
  async getTimeToPong(
    @NativeAuth('address') address: string,
  ): Promise<{ status: string, timeToPong?: number }> {
    return await this.pingPongService.getTimeToPong(Address.fromString(address));
  }

  @Post("/ping")
  @ApiResponse({
    status: 200,
    description: '',
  })
  async ping(
    @NativeAuth('address') address: string,
  ): Promise<any> {
    return await this.pingPongService.generatePingTransaction(Address.fromString(address));
  }

  @Post("/pong")
  @ApiResponse({
    status: 200,
    description: '',
  })
  async pong(
    @NativeAuth('address') address: string,
  ): Promise<any> {
    return await this.pingPongService.generatePongTransaction(Address.fromString(address));
  }
}
