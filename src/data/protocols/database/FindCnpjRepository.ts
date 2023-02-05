export interface FindCnpjRepository {
  find(cnpj: string): Promise<string | null>;
}
