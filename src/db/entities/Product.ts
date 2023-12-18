import {
  Collection,
  Entity,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { User } from "./User";

@Entity({ tableName: "product" })
export abstract class Product {
  [OptionalProps]?: "createdAt" | "updatedAt";

  @PrimaryKey()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @OneToMany({ entity: () => User, mappedBy: "product" })
  users = new Collection<User>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(name: string) {
    this.name = name;
  }
}
