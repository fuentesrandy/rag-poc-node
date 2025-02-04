import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration17383484025311738348406861 implements MigrationInterface {
    name = 'Migration17383484025311738348406861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" ADD "metadata" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "metadata"`);
    }

}
