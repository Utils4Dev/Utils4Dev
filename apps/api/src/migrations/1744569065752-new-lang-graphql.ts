import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewLangGraphql1744569065752 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TYPE code_language_enum ADD VALUE IF NOT EXISTS 'GraphQL';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Não é possível remover valores de enum no PostgreSQL de forma direta
    // Seria necessário recriar o tipo enum sem o valor, o que pode ser complexo
    // se houver dados existentes
  }
}
