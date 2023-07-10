import { MigrationInterface, QueryRunner } from 'typeorm';

export class initMigrate1688886671495 implements MigrationInterface {
  name = 'initMigrate1688886671495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "forgot_password_tokens" (
                "id" BIGSERIAL NOT NULL,
                "email" character varying NOT NULL,
                "code" integer NOT NULL,
                "verify_token" character varying NOT NULL,
                "expiry_date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_95ad636b36a2b621f78427600a8" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "email_verify_tokens" (
                "id" BIGSERIAL NOT NULL,
                "email" character varying NOT NULL,
                "code" integer NOT NULL,
                "expiry_date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_373971fc588121385d9b076b994" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user_detail" (
                "id" BIGSERIAL NOT NULL,
                "user_id" bigint NOT NULL,
                "first_name" character varying,
                "last_name" character varying,
                "contact_number" character varying,
                "birthday" TIMESTAMP WITH TIME ZONE,
                "avatar" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "REL_aebc3bfe11ea329ed91cd8c575" UNIQUE ("user_id"),
                CONSTRAINT "PK_673613c95633d9058a44041794d" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" BIGSERIAL NOT NULL,
                "email" character varying NOT NULL,
                "username" character varying NOT NULL,
                "password" character varying,
                "device_token" character varying,
                "device_name" character varying,
                "platform" character varying,
                "active" boolean NOT NULL DEFAULT false,
                "verified" boolean NOT NULL DEFAULT false,
                "verified_at" TIMESTAMP WITH TIME ZONE,
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
            CREATE TABLE "ward" (
                "id" BIGSERIAL NOT NULL,
                "llg_id" bigint NOT NULL,
                "ward" character varying NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_e6725fa4a50e449c4352d2230e1" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "llg" (
                "id" BIGSERIAL NOT NULL,
                "district_id" bigint NOT NULL,
                "llg" character varying NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_e0f9bb3ef9503a637295e4a410c" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "office_infos" (
                "id" BIGSERIAL NOT NULL,
                "user_id" bigint NOT NULL,
                "province_id" bigint,
                "district_id" bigint,
                "llg_id" bigint,
                "ward_id" bigint,
                "registration_point" character varying,
                "registration_office_name" character varying,
                "nid_no" character varying,
                "card_url" character varying,
                "status" integer NOT NULL DEFAULT '0',
                "message" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "REL_537e08b65cc27de63e9462a67f" UNIQUE ("user_id"),
                CONSTRAINT "PK_8f17f71b44deff6423aa1c5ea6d" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "province" (
                "id" BIGSERIAL NOT NULL,
                "province" character varying NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "district" (
                "id" BIGSERIAL NOT NULL,
                "province_id" bigint NOT NULL,
                "district" character varying NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ee5cb6fd5223164bb87ea693f1e" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "user_detail"
            ADD CONSTRAINT "FK_aebc3bfe11ea329ed91cd8c5759" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "ward"
            ADD CONSTRAINT "FK_2bb476809d23daa12dceb8cffdf" FOREIGN KEY ("llg_id") REFERENCES "llg"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "llg"
            ADD CONSTRAINT "FK_87c90b3da3551717b949ccfeeb0" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "office_infos"
            ADD CONSTRAINT "FK_537e08b65cc27de63e9462a67f6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "office_infos"
            ADD CONSTRAINT "FK_88c1a00763e58b1dd8682b70444" FOREIGN KEY ("province_id") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "office_infos"
            ADD CONSTRAINT "FK_3f50b3e4d47657b0936548c279d" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "office_infos"
            ADD CONSTRAINT "FK_81e96e6b5b25b586a03f401252b" FOREIGN KEY ("llg_id") REFERENCES "llg"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "office_infos"
            ADD CONSTRAINT "FK_b1ec56ec76a8c18184baf92c9f5" FOREIGN KEY ("ward_id") REFERENCES "ward"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "district"
            ADD CONSTRAINT "FK_20bbec53bfceb008df55035d900" FOREIGN KEY ("province_id") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "district" DROP CONSTRAINT "FK_20bbec53bfceb008df55035d900"
        `);
    await queryRunner.query(`
            ALTER TABLE "office_infos" DROP CONSTRAINT "FK_b1ec56ec76a8c18184baf92c9f5"
        `);
    await queryRunner.query(`
            ALTER TABLE "office_infos" DROP CONSTRAINT "FK_81e96e6b5b25b586a03f401252b"
        `);
    await queryRunner.query(`
            ALTER TABLE "office_infos" DROP CONSTRAINT "FK_3f50b3e4d47657b0936548c279d"
        `);
    await queryRunner.query(`
            ALTER TABLE "office_infos" DROP CONSTRAINT "FK_88c1a00763e58b1dd8682b70444"
        `);
    await queryRunner.query(`
            ALTER TABLE "office_infos" DROP CONSTRAINT "FK_537e08b65cc27de63e9462a67f6"
        `);
    await queryRunner.query(`
            ALTER TABLE "llg" DROP CONSTRAINT "FK_87c90b3da3551717b949ccfeeb0"
        `);
    await queryRunner.query(`
            ALTER TABLE "ward" DROP CONSTRAINT "FK_2bb476809d23daa12dceb8cffdf"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_detail" DROP CONSTRAINT "FK_aebc3bfe11ea329ed91cd8c5759"
        `);
    await queryRunner.query(`
            DROP TABLE "district"
        `);
    await queryRunner.query(`
            DROP TABLE "province"
        `);
    await queryRunner.query(`
            DROP TABLE "office_infos"
        `);
    await queryRunner.query(`
            DROP TABLE "llg"
        `);
    await queryRunner.query(`
            DROP TABLE "ward"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TABLE "user_detail"
        `);
    await queryRunner.query(`
            DROP TABLE "email_verify_tokens"
        `);
    await queryRunner.query(`
            DROP TABLE "forgot_password_tokens"
        `);
  }
}
