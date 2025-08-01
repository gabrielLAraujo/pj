import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkScheduleDayDto } from './create-work-schedule-day.dto';

export class UpdateWorkScheduleDayDto extends PartialType(
  CreateWorkScheduleDayDto,
) {}
