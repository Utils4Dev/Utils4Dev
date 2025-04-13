import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1744571254513 implements MigrationInterface {
  name = 'Migrations1744571254513';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."code_language_enum" RENAME TO "code_language_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."code_language_enum" AS ENUM('TypeScript', 'JavaScript', 'GraphQL')`,
    );
    await queryRunner.query(
      `ALTER TABLE "code" ALTER COLUMN "language" TYPE "public"."code_language_enum" USING "language"::"text"::"public"."code_language_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."code_language_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."code_language_enum_old" AS ENUM('TypeScript', 'JavaScript')`,
    );
    await queryRunner.query(
      `ALTER TABLE "code" ALTER COLUMN "language" TYPE "public"."code_language_enum_old" USING "language"::"text"::"public"."code_language_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."code_language_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."code_language_enum_old" RENAME TO "code_language_enum"`,
    );
  }
}
