import { Address, TokenTransfer, Transaction, TransactionPayload } from "@multiversx/sdk-core/out";
import { Injectable } from "@nestjs/common";
import { ApiConfigService } from "@mvx-monorepo/common";
import { ApiService } from "@multiversx/sdk-nestjs-http";
import { BinaryUtils } from "@multiversx/sdk-nestjs-common";

@Injectable()
export class PingPongService {
  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
  ) { }

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

  async generatePingTransaction(address: Address): Promise<any> {
    const contract = this.apiConfigService.getPingPongContract();
    const { data: nonce } = await this.apiService.get(`${this.apiConfigService.getApiUrl()}/accounts/${address.bech32()}?extract=nonce`);

    const pingTransaction = new Transaction({
      data: new TransactionPayload("ping"),
      gasLimit: 60000000,
      sender: address,
      receiver: Address.fromString(contract),
      value: TokenTransfer.egldFromAmount(1),
      chainID: this.apiConfigService.getChainId(),
      nonce,
    });

    return pingTransaction.toPlainObject();
  }

  async generatePongTransaction(address: Address): Promise<any> {
    const contract = this.apiConfigService.getPingPongContract();
    const { data: nonce } = await this.apiService.get(`${this.apiConfigService.getApiUrl()}/accounts/${address.bech32()}?extract=nonce`);

    const pongTransaction = new Transaction({
      data: new TransactionPayload("pong"),
      gasLimit: 60000000,
      sender: address,
      receiver: Address.fromString(contract),
      value: TokenTransfer.egldFromAmount(0),
      chainID: this.apiConfigService.getChainId(),
      nonce,
    });

    return pongTransaction.toPlainObject();
  }

  async getPongDeadline(address: Address): Promise<number | null> {
    const secondsToPong = await this.queryTimeToPong(address);
    if (secondsToPong === undefined) {
      return null;
    }

    const date = new Date();
    date.setSeconds(date.getSeconds() + secondsToPong);

    return date.getTime();
  }

  async getAccount(address: Address): Promise<any> {
    const url = `${this.apiConfigService.getApiUrl()}/accounts/${address.bech32()}`;

    const { data } = await this.apiService.get(url);
    return data;
  }

  async queryTimeToPong(address: Address): Promise<number | undefined> {
    const result = await this.vmQuery(
      this.apiConfigService.getPingPongContract(),
      'getTimeToPong',
      undefined,
      [address.hex()]
    );

    const returnData = result.data.returnData;
    if (!returnData || returnData.length === 0) {
      return undefined;
    }

    if (returnData[0] === '') {
      return 0;
    }

    return BinaryUtils.hexToNumber(BinaryUtils.base64ToHex(returnData[0]));
  }

  async vmQuery(contract: string, func: string, caller: string | undefined, args: string[] = []): Promise<any> {
    const payload = {
      scAddress: contract,
      funcName: func,
      caller: caller,
      args: args,
    };

    const result = await this.apiService.post(
      `${this.apiConfigService.getApiUrl()}/vm-values/query`,
      payload,
    );

    return result.data.data;
  }
}
