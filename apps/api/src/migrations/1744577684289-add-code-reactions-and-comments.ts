import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCodeReactionsAndComments1744577684289 implements MigrationInterface {
    name = 'AddCodeReactionsAndComments1744577684289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."code_reaction_type_enum" AS ENUM('like', 'dislike')`);
        await queryRunner.query(`CREATE TABLE "code_reaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."code_reaction_type_enum" NOT NULL, "codeId" uuid, "userId" uuid, CONSTRAINT "UQ_6ba83c4c4c07c829da96fb74cca" UNIQUE ("codeId", "userId"), CONSTRAINT "PK_300900cae0d17a308b52437c68a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "authorId" uuid, "codeId" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "code_reaction" ADD CONSTRAINT "FK_95fb73427aa9d372a9118bc4ab7" FOREIGN KEY ("codeId") REFERENCES "code"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "code_reaction" ADD CONSTRAINT "FK_92bb8a261ec420f978894a94bf4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_6a4ca64729b365cab10d678bb88" FOREIGN KEY ("codeId") REFERENCES "code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_6a4ca64729b365cab10d678bb88"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`);
        await queryRunner.query(`ALTER TABLE "code_reaction" DROP CONSTRAINT "FK_92bb8a261ec420f978894a94bf4"`);
        await queryRunner.query(`ALTER TABLE "code_reaction" DROP CONSTRAINT "FK_95fb73427aa9d372a9118bc4ab7"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "code_reaction"`);
        await queryRunner.query(`DROP TYPE "public"."code_reaction_type_enum"`);
    }

}
