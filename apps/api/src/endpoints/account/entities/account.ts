import { ApiProperty } from "@nestjs/swagger";

export class Account {
  @ApiProperty({ nullable: false, example: "erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th" })
  address: string = "";

  @ApiProperty({ nullable: true, example: "alice" })
  username?: string;

  @ApiProperty({ nullable: false, example: "1000000000000000000" })
  balance: string = "";

  @ApiProperty({ nullable: false, example: 0 })
  nonce: number = 0;

  @ApiProperty({ nullable: false, example: 1 })
  shard: number = 0;

  constructor(init?: Partial<Account>) {
    Object.assign(this, init);
  }

  public static fromApiResponse(rawAccount: any): Account {
    return new Account({
      address: rawAccount.address,
      username: rawAccount.username,
      balance: rawAccount.balance,
      nonce: rawAccount.nonce,
      shard: rawAccount.shard,
    });
  }
}
