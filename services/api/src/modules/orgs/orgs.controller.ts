import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrgsService } from './orgs.service';

@ApiTags('orgs')
@Controller('orgs')
export class OrgsController {
  constructor(private readonly orgsService: OrgsService) {}

  @Get('me')
  getOrg() {
    return this.orgsService.findOrg();
  }

  @Get('profiles')
  getProfiles() {
    return this.orgsService.listProfiles();
  }
}
