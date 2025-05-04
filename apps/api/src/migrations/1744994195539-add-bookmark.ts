import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookmarkEntity1744994195539 implements MigrationInterface {
  name = 'AddBookmarkEntity1744994195539';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bookmark" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "codeId" uuid, CONSTRAINT "UQ_015d3aad29f94ebaa03fdd20368" UNIQUE ("userId", "codeId"), CONSTRAINT "PK_b7fbf4a865ba38a590bb9239814" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookmark" ADD CONSTRAINT "FK_e389fc192c59bdce0847ef9ef8b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookmark" ADD CONSTRAINT "FK_92547fd525065642d003ee208c4" FOREIGN KEY ("codeId") REFERENCES "code"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookmark" DROP CONSTRAINT "FK_92547fd525065642d003ee208c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookmark" DROP CONSTRAINT "FK_e389fc192c59bdce0847ef9ef8b"`,
    );
    await queryRunner.query(`DROP TABLE "bookmark"`);
  }
}
