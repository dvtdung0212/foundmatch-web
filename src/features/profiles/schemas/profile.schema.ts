import { z } from "zod";

function isValidPastOrPresentDate(value: string): boolean {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value &&
    parsed <= new Date()
  );
}

export const updateProfileSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Họ tên phải có ít nhất 2 ký tự")
      .max(100, "Họ tên tối đa 100 ký tự")
      .trim()
      .optional(),
    phone: z
      .string()
      .regex(/^(0|\+84)[35789][0-9]{8}$/, "Số điện thoại không hợp lệ")
      .optional()
      .or(z.literal("")),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh không đúng định dạng YYYY-MM-DD")
      .refine(
        isValidPastOrPresentDate,
        "Ngày sinh không hợp lệ hoặc ở tương lai",
      )
      .optional()
      .or(z.literal("")),
    gender: z
      .enum(["male", "female", "other", "prefer_not_to_say"], {
        errorMap: () => ({ message: "Giới tính không hợp lệ" }),
      })
      .optional(),
    address: z
      .string()
      .max(255, "Địa chỉ tối đa 255 ký tự")
      .trim()
      .optional()
      .or(z.literal("")),
    addressLine: z.string().trim().max(500).nullable().optional(),
    countryCode: z
      .string()
      .trim()
      .transform((value) => value.toUpperCase())
      .refine((value) => /^[A-Z]{2}$/.test(value), "Mã quốc gia không hợp lệ")
      .nullable()
      .optional(),
    administrativeAreaLevel1Id: z.string().uuid().nullable().optional(),
    administrativeAreaLevel2Id: z.string().uuid().nullable().optional(),
    localityGeographyId: z.string().uuid().nullable().optional(),
    occupation: z.string().trim().max(120).nullable().optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.administrativeAreaLevel1Id && !value.countryCode) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn quốc gia trước khi chọn tỉnh/thành phố",
        path: ["countryCode"],
      });
    }

    if (value.administrativeAreaLevel2Id && !value.administrativeAreaLevel1Id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn tỉnh/thành phố trước",
        path: ["administrativeAreaLevel1Id"],
      });
    }

    if (value.localityGeographyId && !value.administrativeAreaLevel1Id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn tỉnh/thành phố trước khi chọn phường/xã",
        path: ["localityGeographyId"],
      });
    }
  });

export type UpdateProfileSchemaInput = z.infer<typeof updateProfileSchema>;
