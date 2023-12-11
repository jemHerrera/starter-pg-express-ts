import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./_lib/BaseEntity";

@Entity({ tableName: "account" })
export class User extends BaseEntity {
  @Property({ unique: true })
  username!: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;
}
