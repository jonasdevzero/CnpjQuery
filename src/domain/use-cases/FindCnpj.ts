export interface FindCnpj {
  find(cnpj: string): Promise<string>;
}
