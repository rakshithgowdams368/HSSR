// app/(dashboard)/(routes)/music/constants.ts
import { z } from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Music prompt is required",
  }),
});
