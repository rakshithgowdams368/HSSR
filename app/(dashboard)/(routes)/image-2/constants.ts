// app/(dashboard)/(routes)/image-2/constants.ts
import { z } from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Image prompt is required",
  }),
  amount: z.string().min(1),
  resolution: z.string().min(1),
  model: z.string().min(1),
});

export const amountOptions = [
  { value: "1", label: "1 Photo" }
];

// Updated to support standard aspect ratios that work well with placeholder services
export const resolutionOptions = [
  { value: "1024x1024", label: "Standard (1024x1024)" }
];

// Updated to show mock models instead of DALL-E models
export const modelOptions = [
  { value: "free-model-advanced", label: "Advanced Model (Premium)" }
];
