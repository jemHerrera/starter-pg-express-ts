import { Chat } from "./Chat";
import { Product } from "./Product";
import { User } from "./User";

export * from "./User";
export * from "./Chat";
export * from "./Product";

const entities: any[] = [User, Chat, Product];

export default entities;
