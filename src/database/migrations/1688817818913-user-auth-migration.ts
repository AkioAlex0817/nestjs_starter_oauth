import {MigrationInterface, QueryRunner} from "typeorm";

export class userAuthMigration1688817818913 implements MigrationInterface {
    name = 'userAuthMigration1688817818913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" BIGSERIAL NOT NULL,
                "email" character varying NOT NULL,
                "username" character varying NOT NULL,
                "password" character varying,
                "active" boolean NOT NULL DEFAULT false,
                "access_token" character varying,
                "refresh_token" character varying,
                "expiry_access_date" TIMESTAMP WITH TIME ZONE,
                "expiry_refresh_date" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_detail" (
                "id" BIGSERIAL NOT NULL,
                "user_id" bigint NOT NULL,
                "first_name" character varying,
                "last_name" character varying,
                "contact_number" character varying,
                "address" character varying,
                "city" character varying,
                "state" character varying,
                "zip" character varying,
                "country" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "REL_aebc3bfe11ea329ed91cd8c575" UNIQUE ("user_id"),
                CONSTRAINT "PK_673613c95633d9058a44041794d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "user_detail"
            ADD CONSTRAINT "FK_aebc3bfe11ea329ed91cd8c5759" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_detail" DROP CONSTRAINT "FK_aebc3bfe11ea329ed91cd8c5759"
        `);
        await queryRunner.query(`
            DROP TABLE "user_detail"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }

}
