import { DataUrlType } from '../models/DataUrl';

export interface CnpjRawDataParser {
  parse(data: string, dataType: DataUrlType): Object;
}
