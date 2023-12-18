import { z } from "zod";

export const MessageSchema = z.object({
  from: z.union([z.literal("user"), z.literal("ai")]),
  text: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;
