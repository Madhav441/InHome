import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TelemetryService } from './telemetry.service';

class TelemetryDto {
  deviceId!: string;
  ts!: string;
  kind!: string;
  payload!: Record<string, unknown>;
}

@ApiTags('telemetry')
@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post()
  create(@Body() body: TelemetryDto) {
    return this.telemetryService.ingest(body);
  }

  @Get()
  list() {
    return this.telemetryService.recent();
  }
}
