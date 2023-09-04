import { ApiProperty } from "@nestjs/swagger";

export class PingPongStats {
  @ApiProperty()
  pingTransactions: number = 0;

  @ApiProperty()
  pongTransactions: number = 0;
}
