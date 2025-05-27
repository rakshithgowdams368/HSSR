// app/(dashboard)/(routes)/code/constants.ts
import { z } from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Code prompt is required",
  }),
});
