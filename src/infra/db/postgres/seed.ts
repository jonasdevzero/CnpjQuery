import sql from './db';

export async function seed() {
  await sql`DELETE FROM "dataUrl";`;

  await sql`
    INSERT INTO "dataUrl" (url, type)
    VALUES 
        ('http://200.152.38.155/CNPJ/Cnaes.zip', 'CNAE'),
        ('http://200.152.38.155/CNPJ/Paises.zip', 'COUNTRIES'),
        ('http://200.152.38.155/CNPJ/Qualificacoes.zip', 'QUALIFICATIONS'),
        ('http://200.152.38.155/CNPJ/Naturezas.zip', 'NATURES'),
        ('http://200.152.38.155/CNPJ/Municipios.zip', 'CITIES'),
        ('http://200.152.38.155/CNPJ/Motivos.zip', 'REASONS'),

        ('http://200.152.38.155/CNPJ/Empresas0.zip', 'COMPANY'),
        ('http://200.152.38.155/CNPJ/Empresas1.zip', 'COMPANY'),
        ('http://200.152.38.155/CNPJ/Empresas2.zip', 'COMPANY'),
        ('http://200.152.38.155/CNPJ/Empresas3.zip', 'COMPANY'),
        ('http://200.152.38.155/CNPJ/Empresas4.zip', 'COMPANY'),
        ('http://200.152.38.155/CNPJ/Empresas5.zip', 'COMPANY'),
        ('http://200.152.38.155/CNPJ/Empresas6.zip', 'COMPANY'),
        ('http://200.152.38.155/CNPJ/Empresas7.zip', 'COMPANY'),
        ('http://200.152.38.155/CNPJ/Empresas8.zip', 'COMPANY'),
        ('http://200.152.38.155/CNPJ/Empresas9.zip', 'COMPANY'),

        ('http://200.152.38.155/CNPJ/Estabelecimentos0.zip', 'ESTABLISHMENT'),
        ('http://200.152.38.155/CNPJ/Estabelecimentos1.zip', 'ESTABLISHMENT'),
        ('http://200.152.38.155/CNPJ/Estabelecimentos2.zip', 'ESTABLISHMENT'),
        ('http://200.152.38.155/CNPJ/Estabelecimentos3.zip', 'ESTABLISHMENT'),
        ('http://200.152.38.155/CNPJ/Estabelecimentos4.zip', 'ESTABLISHMENT'),
        ('http://200.152.38.155/CNPJ/Estabelecimentos5.zip', 'ESTABLISHMENT'),
        ('http://200.152.38.155/CNPJ/Estabelecimentos6.zip', 'ESTABLISHMENT'),
        ('http://200.152.38.155/CNPJ/Estabelecimentos7.zip', 'ESTABLISHMENT'),
        ('http://200.152.38.155/CNPJ/Estabelecimentos8.zip', 'ESTABLISHMENT'),
        ('http://200.152.38.155/CNPJ/Estabelecimentos9.zip', 'ESTABLISHMENT'),

        ('http://200.152.38.155/CNPJ/Socios0.zip', 'PARTNER'),
        ('http://200.152.38.155/CNPJ/Socios1.zip', 'PARTNER'),
        ('http://200.152.38.155/CNPJ/Socios2.zip', 'PARTNER'),
        ('http://200.152.38.155/CNPJ/Socios3.zip', 'PARTNER'),
        ('http://200.152.38.155/CNPJ/Socios4.zip', 'PARTNER'),
        ('http://200.152.38.155/CNPJ/Socios5.zip', 'PARTNER'),
        ('http://200.152.38.155/CNPJ/Socios6.zip', 'PARTNER'),
        ('http://200.152.38.155/CNPJ/Socios7.zip', 'PARTNER'),
        ('http://200.152.38.155/CNPJ/Socios8.zip', 'PARTNER'),
        ('http://200.152.38.155/CNPJ/Socios9.zip', 'PARTNER'),

        ('http://200.152.38.155/CNPJ/Simples.zip', 'SIMPLES');
    
  `;
}

seed().finally(() => process.exit(0));
