import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if ((metadata.type === 'body' || metadata.type === 'query') && typeof value === 'object') {
      return this.transformObject(value);
    }
    return value;
  }

  private transformObject(obj: any): any {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].trim();
        } else if (obj[key] instanceof Object) {
          obj[key] = this.transformObject(obj[key]);
        }
      }
    }
    return obj;
  }
}
