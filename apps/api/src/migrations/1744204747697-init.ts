import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1744204747697 implements MigrationInterface {
  name = 'Init1744204747697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "github_provider" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "externalId" character varying NOT NULL, "login" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "REL_2ea72d71acc96cc63e30cff85d" UNIQUE ("userId"), CONSTRAINT "PK_c15bc3ab887768108495e27d3e1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."code_language_enum" AS ENUM('TypeScript', 'JavaScript')`,
    );
    await queryRunner.query(
      `CREATE TABLE "code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "language" "public"."code_language_enum" NOT NULL, "content" character varying NOT NULL DEFAULT '', "private" boolean NOT NULL, "authorUserId" uuid, CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lastLoginAt" TIMESTAMP NOT NULL DEFAULT now(), "avatarUrl" text, "name" character varying NOT NULL, "email" text, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "github_provider" ADD CONSTRAINT "FK_2ea72d71acc96cc63e30cff85db" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "code" ADD CONSTRAINT "FK_14302ff118338c8e559d105f590" FOREIGN KEY ("authorUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "code" DROP CONSTRAINT "FK_14302ff118338c8e559d105f590"`,
    );
    await queryRunner.query(
      `ALTER TABLE "github_provider" DROP CONSTRAINT "FK_2ea72d71acc96cc63e30cff85db"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "code"`);
    await queryRunner.query(`DROP TYPE "public"."code_language_enum"`);
    await queryRunner.query(`DROP TABLE "github_provider"`);
  }
}
