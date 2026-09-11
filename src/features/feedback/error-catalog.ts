import vi from "./locales/vi.json";

export type WebLocale = "vi";

const catalogs = { vi } as const;

export function translateWebError(
  code: string,
  locale: WebLocale = "vi",
): string | undefined {
  const catalog = catalogs[locale];
  return (
    getRecordValue(catalog.errors, code) ??
    findPrefixMessage(catalog.prefixes, code)
  );
}

export function hasExactWebErrorTranslation(
  code: string,
  locale: WebLocale = "vi",
): boolean {
  return Object.prototype.hasOwnProperty.call(catalogs[locale].errors, code);
}

export function getWebHttpErrorFallback(
  status?: number,
  locale: WebLocale = "vi",
): string {
  const messages = catalogs[locale].httpStatus;
  if (status !== undefined) {
    const exact = getRecordValue(messages, String(status));
    if (exact) return exact;
    if (status >= 500) return messages["5xx"];
  }
  return messages.default;
}

export function getWebTranslationCatalog(locale: WebLocale = "vi") {
  return catalogs[locale];
}

function findPrefixMessage(prefixes: object, code: string): string | undefined {
  return Object.entries(prefixes).find(([prefix]) =>
    code.startsWith(prefix),
  )?.[1];
}

function getRecordValue(record: object, key: string): string | undefined {
  const value = (record as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}
