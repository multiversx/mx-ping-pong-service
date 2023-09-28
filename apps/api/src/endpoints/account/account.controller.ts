import { NativeAuth, NativeAuthGuard } from "@multiversx/sdk-nestjs-auth";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AccountService } from "./account.service";
import { Account } from "./entities";

@Controller('account')
@ApiTags('account')
@UseGuards(NativeAuthGuard)
@ApiBearerAuth()
export class AccountController {
  constructor(
    private readonly accountService: AccountService
  ) { }

  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'Returns the connected account',
    type: Account,
  })
  async getAccount(
    @NativeAuth('address') address: string,
  ): Promise<Account> {
    return await this.accountService.getAccount(address);
  }
}
