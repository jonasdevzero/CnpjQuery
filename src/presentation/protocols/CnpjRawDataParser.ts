import { DataUrlType } from '../../domain/models/DataUrl';

export interface CnpjRawDataParser {
  parse(data: string, dataType: DataUrlType): Object;
}
