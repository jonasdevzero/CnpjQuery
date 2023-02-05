import { container } from '@container';
import { FindCnpj } from '@domain/use-cases/FindCnpj';
import { DbFindCnpj } from './DbFindCnpj/DbFindCnpj';

container.register<FindCnpj>('FindCnpj', DbFindCnpj);
