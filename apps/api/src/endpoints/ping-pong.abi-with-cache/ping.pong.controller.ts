import { Controller, Get, Param } from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PingPongService } from "./ping.pong.service";
import { Address } from "@multiversx/sdk-core/out";
import { ParseAddressPipe } from "@multiversx/sdk-nestjs-common";

@Controller('ping-pong')
@ApiTags('ping-pong.abi-with-cache')
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
}
