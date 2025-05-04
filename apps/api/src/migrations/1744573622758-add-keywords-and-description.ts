import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddKeywordsAndDescription1744573622758
  implements MigrationInterface
{
  name = 'AddKeywordsAndDescription1744573622758';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "code" ADD "keywords" text`);
    await queryRunner.query(
      `ALTER TABLE "code" ADD "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "code" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "code" DROP COLUMN "keywords"`);
  }
}
