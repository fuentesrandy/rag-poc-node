import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration17383435734851738343577963 implements MigrationInterface {
    name = 'Migration17383435734851738343577963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "documents" (
                "id" SERIAL NOT NULL, 
                "content" text NOT NULL, 
                "embedding" vector(1536) NOT NULL, 
                CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id")
            )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "documents"`);
    }

}
