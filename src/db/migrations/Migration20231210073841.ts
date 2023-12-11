import { Migration } from '@mikro-orm/migrations';

export class Migration20231210073841 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "account" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, constraint "account_pkey" primary key ("id"));');
    this.addSql('alter table "account" add constraint "account_username_unique" unique ("username");');
    this.addSql('alter table "account" add constraint "account_email_unique" unique ("email");');

    this.addSql('drop table if exists "user" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "user" ("id" varchar not null default null, "created_at" timestamptz not null default null, "updated_at" timestamptz not null default null, "username" varchar not null default null, "email" varchar not null default null, "password" varchar not null default null, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    this.addSql('drop table if exists "account" cascade;');
  }

}
