import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PoliciesService } from './policies.service';

@ApiTags('policies')
@Controller('policy')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Get(':deviceId')
  getPolicy(@Param('deviceId') deviceId: string) {
    return this.policiesService.getPolicy(deviceId);
  }
}
