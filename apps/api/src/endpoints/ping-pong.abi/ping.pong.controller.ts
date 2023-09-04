import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { PingPongService } from "./ping.pong.service";
import { Address } from "@multiversx/sdk-core/out";
import { NativeAuth, NativeAuthGuard } from "@multiversx/sdk-nestjs-auth";

@Controller('ping-pong/abi')
@ApiTags('ping-pong.abi')
@UseGuards(NativeAuthGuard)
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
  ping(
    @NativeAuth('address') address: string,
  ): Promise<any> {
    return this.pingPongService.generatePingTransaction(Address.fromString(address));
  }

  @Post("/pong")
  @ApiResponse({
    status: 200,
    description: '',
  })
  pong(
    @NativeAuth('address') address: string,
  ): Promise<any> {
    return this.pingPongService.generatePongTransaction(Address.fromString(address));
  }
}
