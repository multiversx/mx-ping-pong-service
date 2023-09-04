import { Controller, Get, Param, Post } from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PingPongService } from "./ping.pong.service";
import { Address } from "@multiversx/sdk-core/out";
import { ParseAddressPipe } from "@multiversx/sdk-nestjs-common";

@Controller('ping-pong/abi')
@ApiTags('ping-pong.abi')
export class PingPongController {
  constructor(
    private readonly pingPongService: PingPongService
  ) { }

  @Get("/time-to-pong/:address")
  @ApiResponse({
    status: 200,
    description: 'Returns one example',
  })
  @ApiQuery({
    name: 'address',
    required: true,
    type: String,
    description: 'The address to query',
  })
  async getTimeToPong(
    @Param('address', ParseAddressPipe) address: string,
  ): Promise<{ status: string, timeToPong?: number }> {
    return await this.pingPongService.getTimeToPong(Address.fromString(address));
  }

  @Post("/ping/:address")
  @ApiResponse({
    status: 200,
    description: '',
  })
  ping(
    @Param('address', ParseAddressPipe) address: string,
  ): Promise<any> {
    return this.pingPongService.generatePingTransaction(Address.fromString(address));
  }

  @Post("/pong/:address")
  @ApiResponse({
    status: 200,
    description: '',
  })
  pong(
    @Param('address', ParseAddressPipe) address: string,
  ): Promise<any> {
    return this.pingPongService.generatePongTransaction(Address.fromString(address));
  }
}
