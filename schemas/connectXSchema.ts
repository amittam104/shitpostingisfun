import { z } from "zod";

export const connectXSchema = z.object({
  xProfile: z
    .string()
    .regex(/^(https?:\/\/)?(www\.)?x\.com\/([A-Za-z0-9_]{1,15})\/?$/, {
      message: "Please provide valid X(Twitter) profile",
    }),
});
