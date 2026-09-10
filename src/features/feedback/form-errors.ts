import { normalizeApiError } from "./normalize-api-error";

export type ApiFieldMap<TField extends string = string> = Partial<
  Record<string, TField>
>;

export function resolveApiFormFieldErrors<TField extends string = string>(
  error: unknown,
  fieldMap?: ApiFieldMap<TField>,
): Record<TField, string> {
  const normalized = normalizeApiError(error);
  const output = {} as Record<TField, string>;
  for (const [apiField, messages] of Object.entries(normalized.fieldErrors)) {
    const formField = fieldMap?.[apiField] ?? (apiField as TField);
    if (formField && messages[0]) output[formField] = messages[0];
  }
  return output;
}
