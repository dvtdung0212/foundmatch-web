import { z } from "zod";

export const magicLinkSchema = z.object({
  email: z.string().email("Địa chỉ Email không đúng định dạng"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Địa chỉ Email không đúng định dạng"),
  token: z.string().length(6, "Mã OTP phải đúng 6 chữ số"),
});

export const signUpSchema = z
  .object({
    email: z.string().email("Địa chỉ Email không hợp lệ"),
    username: z
      .string()
      .min(3, "Username phải từ 3 ký tự trở lên")
      .max(30, "Username tối đa 30 ký tự")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username chỉ được chứa chữ cái, số và dấu gạch dưới (_)",
      ),
    fullName: z.string().min(2, "Họ và tên phải từ 2 ký tự trở lên"),
    password: z.string().min(12, "Mật khẩu phải chứa ít nhất 12 ký tự"),
    confirmPassword: z.string().min(12, "Mật khẩu xác nhận không hợp lệ"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không trùng khớp",
    path: ["confirmPassword"],
  });

export const signInWithPasswordSchema = z.object({
  identifier: z
    .string()
    .min(3, "Email hoặc Username phải chứa ít nhất 3 ký tự"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export const signUpFormSchema = signUpSchema.and(
  z.object({
    agreeTerms: z.boolean().refine((value) => value, {
      message: "Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật.",
    }),
  }),
);

export const passwordRecoverySchema = z.object({
  identifier: z.string().trim().min(3, "Email hoặc Username phải có ít nhất 3 ký tự"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(12, "Mật khẩu phải có ít nhất 12 ký tự."),
    confirmation: z.string(),
  })
  .refine((data) => data.password === data.confirmation, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmation"],
  });

export const emailOtpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Mã xác minh phải gồm đúng 6 chữ số."),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInWithPasswordInput = z.infer<typeof signInWithPasswordSchema>;
