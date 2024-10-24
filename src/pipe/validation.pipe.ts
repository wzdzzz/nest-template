import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidation(metatype)) {
      // 如果没有传入验证规则，则不验证，直接返回数据
      return value;
    }
    // 将对象转换为 Class 来验证
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const msg = Object.values(errors[0].constraints)[0]; // 只需要取第一个错误信息并返回即可
      // 自定义校验返回格式
      throw new BadRequestException(`Validation failed: ${msg}`);
    }
    return value;
  }

  /**
   * 当 metatype 所指的参数的元类型仅为Javascript原生类型的话则跳过校验，这里只关注了对定义的DTO的校验
   */
  private toValidation(metatype: ArgumentMetadata['metatype']): boolean {
    const types: ArgumentMetadata['metatype'][] = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype);
  }
}
