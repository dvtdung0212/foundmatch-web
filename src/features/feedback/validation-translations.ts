import { getWebTranslationCatalog, type WebLocale } from "./error-catalog";

export function translateWebFieldValidation(
  fieldPath: string,
  sourceMessage: string,
  locale: WebLocale = "vi",
): string {
  const catalog = getWebTranslationCatalog(locale);
  const label = getWebFieldLabel(fieldPath, locale);

  for (const rule of catalog.validationRules) {
    for (const sourcePattern of rule.patterns) {
      const match = sourceMessage.match(new RegExp(sourcePattern, "i"));
      if (match) return formatMessage(rule.message, label, match[1]);
    }
  }
  return formatMessage(catalog.validationDefault, label);
}

export function getWebFieldLabel(
  fieldPath: string,
  locale: WebLocale = "vi",
): string {
  const field =
    fieldPath
      .split(".")
      .filter((part) => !/^\d+$/.test(part))
      .at(-1) ?? fieldPath;
  const labels = getWebTranslationCatalog(locale).fields as Record<
    string,
    string
  >;
  return labels[field] ?? "Trường này";
}

function formatMessage(
  template: string,
  label: string,
  value?: string,
): string {
  return template
    .replaceAll("{label}", label)
    .replaceAll("{value}", value ?? "");
}
