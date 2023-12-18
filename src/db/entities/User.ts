import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { BaseEntity } from "./_lib/BaseEntity";
import { Chat } from "./Chat";
import { Product } from "./Product";

@Entity({ tableName: "account" })
export class User extends BaseEntity {
  @Property({ unique: true })
  username!: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @Property({ default: false })
  emailVerified?: boolean;

  @Property({ default: false })
  isAdmin?: boolean;

  @OneToMany({ entity: () => Chat, mappedBy: "user", orphanRemoval: true })
  chats = new Collection<Chat>(this);

  @ManyToOne({ entity: () => Product })
  product!: Product;
}
