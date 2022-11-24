import { DataUrlType } from '../domain/models/DataUrl';
import { CnpjRawDataParser } from '../presentation/protocols/CnpjRawDataParser';

export class CnpjRawDataParserAdapter implements CnpjRawDataParser {
  parse(data: string, dataType: DataUrlType): Object {
    const dataToParse = data.replace(/"/g, '').split(';');

    const [baseCnpj, corporateName, legalNature, qualification, capital, size, federativeEntity] =
      dataToParse;

    return {
      baseCnpj,
      corporateName,
      legalNature,
      qualification,
      capital,
      size,
      federativeEntity,
    };
  }
}
