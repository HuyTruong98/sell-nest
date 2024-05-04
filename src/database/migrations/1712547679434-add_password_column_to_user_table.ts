import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordColumnToUserTable1712547679434 implements MigrationInterface {
    name = 'AddPasswordColumnToUserTable1712547679434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`password\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
    }

}
