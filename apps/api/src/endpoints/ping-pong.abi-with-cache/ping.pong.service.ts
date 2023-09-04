import { AbiRegistry, Address, ResultsParser, SmartContract } from "@multiversx/sdk-core/out";
import { CacheService } from "@multiversx/sdk-nestjs-cache";
import { Constants } from "@multiversx/sdk-nestjs-common";
import { Injectable } from "@nestjs/common";
import pingPongAbi from './ping.pong.abi.json';
import { ApiConfigService } from "@mvx-monorepo/common";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers/out";

@Injectable()
export class PingPongService {
  private readonly smartContract: SmartContract;
  private readonly networkProvider: ApiNetworkProvider;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly cacheService: CacheService,
  ) {
    this.networkProvider = new ApiNetworkProvider(this.apiConfigService.getApiUrl());
    this.smartContract = this.initSmartContract();
  }

  async getTimeToPong(address: Address): Promise<{ status: string, timeToPong?: number }> {
    const pongDeadlineTimestamp = await this.getPongDeadline(address);
    if (!pongDeadlineTimestamp) {
      return { status: "not_yet_pinged" };
    }

    const pongDeadline = new Date(pongDeadlineTimestamp);

    let secondsRemaining = (pongDeadline.getTime() - new Date().getTime()) / 1000;
    if (secondsRemaining < 0) {
      secondsRemaining = 0;
    }

    return { status: "awaiting_pong", timeToPong: secondsRemaining };
  }

  async getPongDeadline(address: Address): Promise<number | null> {
    return await this.cacheService.getOrSet(
      `pong:${address}`,
      async () => await this.getPongDeadlineRaw(address),
      Constants.oneMinute() * 10,
    );
  }

  async getPongDeadlineRaw(address: Address): Promise<number | null> {
    const secondsToPong = await this.queryTimeToPong(address);
    if (secondsToPong === undefined) {
      return null;
    }

    const date = new Date();
    date.setSeconds(date.getSeconds() + secondsToPong);

    return date.getTime();
  }

  async queryTimeToPong(address: Address): Promise<number | undefined> {
    const interaction = this.smartContract.methods.getTimeToPong([address]);
    const query = interaction.check().buildQuery();

    const queryResponse = await this.networkProvider.queryContract(query);
    const result = new ResultsParser().parseQueryResponse(queryResponse, interaction.getEndpoint());

    const value = result.firstValue?.valueOf();
    if (!value) {
      return undefined;
    }

    return value.toNumber();
  }

  private initSmartContract(): SmartContract {
    const abiRegistry = AbiRegistry.create(JSON.parse(JSON.stringify(pingPongAbi)));

    const contractAddress = Address.fromBech32(this.apiConfigService.getPingPongContract());

    const contract = new SmartContract({
      address: contractAddress,
      abi: abiRegistry,
    });

    return contract;
  }
}
