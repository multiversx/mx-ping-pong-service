import { Module } from "@nestjs/common";
import { PingPongService } from "./ping.pong.service";

@Module({
  imports: [],
  providers: [
    PingPongService,
  ],
  exports: [
    PingPongService,
  ],
})
export class PingPongModule { }
