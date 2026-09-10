import { z } from "zod";

export const quickSearchSchema = z.object({
  query: z.string().trim().min(1, "Vui lòng nhập nội dung cần tìm."),
});
