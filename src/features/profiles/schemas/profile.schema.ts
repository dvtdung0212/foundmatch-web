import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên tối đa 100 ký tự")
    .trim()
    .optional(),
  avatarUrl: z
    .string()
    .url("Đường dẫn avatar không hợp lệ")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không hợp lệ")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileSchemaInput = z.infer<typeof updateProfileSchema>;
