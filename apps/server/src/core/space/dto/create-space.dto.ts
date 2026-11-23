import {
  IsAlphanumeric,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

// A space icon is either a Tabler icon key (`folder`, `book-2`) or one native
// emoji grapheme (needs at least one pictographic code point, so plain text
// such as `123` or `#` is still rejected).
const SPACE_ICON_PATTERN =
  /^(?:[a-z][a-z0-9-]*|(?=.*[\p{Extended_Pictographic}\p{Regional_Indicator}\u20e3])[\p{Extended_Pictographic}\p{Regional_Indicator}\p{Emoji_Component}\u200d\ufe0f\u20e3]{1,16})$/u;

export class CreateSpaceDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  @Matches(SPACE_ICON_PATTERN)
  icon?: string | null;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/)
  iconColor?: string | null;

  @MinLength(2)
  @MaxLength(100)
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @MinLength(2)
  @MaxLength(100)
  @IsAlphanumeric()
  slug: string;
}
