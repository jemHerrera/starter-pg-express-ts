import { Entity, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./_lib/BaseEntity";
import { Message } from "../../utils/types/Message";
import { User } from "./User";

@Entity({ tableName: "chat" })
export class Chat extends BaseEntity {
  @ManyToOne({ entity: () => User })
  user!: User;

  @Property()
  topic!: string;

  @Property()
  messages!: Message[];
}
