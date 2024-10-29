import { ValidationPipe } from './validation.pipe';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';

class TestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

describe('ValidationPipe', () => {
  let validationPipe: ValidationPipe;

  beforeEach(() => {
    validationPipe = new ValidationPipe();
  });

  it('should pass validation if DTO is valid', async () => {
    const dto = { name: 'John' };
    const metadata: ArgumentMetadata = {
      metatype: TestDto,
      type: 'body',
      data: '',
    };

    await expect(validationPipe.transform(dto, metadata)).resolves.toEqual(dto);
  });

  it('should throw a BadRequestException if DTO is invalid', async () => {
    const dto = { name: '' }; // Invalid: name is empty
    const metadata: ArgumentMetadata = {
      metatype: TestDto,
      type: 'body',
      data: '',
    };

    await expect(validationPipe.transform(dto, metadata)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should pass without validation for primitive types', async () => {
    const metadata: ArgumentMetadata = {
      metatype: String, // Primitive type should skip validation
      type: 'body',
      data: '',
    };

    const value = 'test string';
    await expect(validationPipe.transform(value, metadata)).resolves.toEqual(
      value,
    );
  });

  it('should throw a BadRequestException with the correct error message', async () => {
    const dto = { name: '' }; // Invalid: name is empty
    const metadata: ArgumentMetadata = {
      metatype: TestDto,
      type: 'body',
      data: '',
    };

    await expect(validationPipe.transform(dto, metadata)).rejects.toThrowError(
      new BadRequestException('Validation failed: name should not be empty'),
    );
  });
});
