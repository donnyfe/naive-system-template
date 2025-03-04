import { BadRequestException } from '@nestjs/common'

export interface ValidationErrorItem {
  field: string
  value?: any
  rule: string
  message: string
  children?: ValidationErrorItem[]
}

export interface ValidationErrorResponse {
  statusCode: number
  message: string
  errors: ValidationErrorItem[]
}

export class ValidationException extends BadRequestException {
  constructor(
    public readonly errors: ValidationErrorItem[],
    message: string = '数据验证失败',
  ) {
    super({
      statusCode: 400,
      message,
      errors,
    })
    this.name = 'ValidationException'
  }

  static fromClassValidatorErrors(errors: any[]): ValidationException {
    const validationErrors = errors.map((error) => ({
      field: error.property,
      value: error.value,
      rule: Object.keys(error.constraints)[0],
      message: Object.values(error.constraints)[0] as string,
      children: error.children?.length ? this.parseChildren(error.children) : undefined,
    }))

    return new ValidationException(validationErrors)
  }

  private static parseChildren(children: any[]): ValidationErrorItem[] {
    return children.map((child) => ({
      field: child.property,
      value: child.value,
      rule: Object.keys(child.constraints)[0],
      message: Object.values(child.constraints)[0] as string,
      children: child.children?.length ? this.parseChildren(child.children) : undefined,
    }))
  }
}
