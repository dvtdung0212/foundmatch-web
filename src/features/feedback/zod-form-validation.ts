"use client";

import { useCallback, useState } from "react";
import type { ZodType } from "zod";

export type ZodFieldErrors<TField extends string = string> = Partial<
  Record<TField, string>
>;

export function parseZodForm<TOutput, TInput = TOutput>(
  schema: ZodType<TOutput, any, TInput>,
  input: TInput,
): { data: TOutput | null; fieldErrors: ZodFieldErrors } {
  const result = schema.safeParse(input);
  if (result.success) return { data: result.data, fieldErrors: {} };

  const fieldErrors: ZodFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path.join(".");
    if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
  }
  return { data: null, fieldErrors };
}

export function useZodFormValidation<TOutput, TInput = TOutput>(
  schema: ZodType<TOutput, any, TInput>,
) {
  const [fieldErrors, setFieldErrors] = useState<ZodFieldErrors>({});

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const validate = useCallback(
    (input: TInput): TOutput | null => {
      const result = parseZodForm(schema, input);
      setFieldErrors(result.fieldErrors);
      return result.data;
    },
    [schema],
  );

  const validateField = useCallback(
    (field: string, input: TInput): string | null => {
      const result = parseZodForm(schema, input);
      const error = result.fieldErrors[field] || null;
      setFieldErrors((current) => {
        if (error) {
          if (current[field] === error) return current;
          return { ...current, [field]: error };
        } else {
          if (!current[field]) return current;
          const next = { ...current };
          delete next[field];
          return next;
        }
      });
      return error;
    },
    [schema],
  );

  return { clearFieldError, fieldErrors, setFieldErrors, validate, validateField };
}
