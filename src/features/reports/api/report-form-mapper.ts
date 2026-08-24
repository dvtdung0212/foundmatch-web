import type {
  ReportAttributeAnswerInput,
  ReportSubmissionInput,
  ReportType,
} from "./report-submission";

export type ReportFormMappingInput = {
  attributes: ReportAttributeAnswerInput[];
  brand?: string;
  categoryId: string;
  categoryName: string;
  color?: string;
  date: string;
  description: string;
  distinctiveFeatures?: string;
  files: File[];
  locationArea?: string;
  locationDetail?: string;
  locationName: string;
  secretVerificationAnswers?: string;
  timeSlot: string;
  title: string;
  type: ReportType;
};

function optional(value?: string): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function eventRange(
  date: string,
  timeSlot: string,
): {
  eventEndedAt?: string;
  eventStartedAt: string;
} {
  const times = timeSlot.match(/^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/);
  const startTime = times?.[1] ?? "00:00";
  const eventStartedAt = new Date(
    `${date}T${startTime}:00+07:00`,
  ).toISOString();

  if (!times?.[2]) return { eventStartedAt };

  const endDate =
    times[2] === "00:00"
      ? new Date(`${date}T24:00:00+07:00`)
      : new Date(`${date}T${times[2]}:00+07:00`);

  return { eventEndedAt: endDate.toISOString(), eventStartedAt };
}

export function buildReportSubmission(
  input: ReportFormMappingInput,
): ReportSubmissionInput {
  const publicAreaLabel =
    optional(input.locationArea) ?? input.locationName.trim();
  const privateFacts = [
    { kind: "distinctive_feature", value: optional(input.distinctiveFeatures) },
    {
      kind: "verification_secret",
      value: optional(input.secretVerificationAnswers),
    },
    { kind: "exact_location_context", value: optional(input.locationDetail) },
  ].filter((fact): fact is { kind: string; value: string } =>
    Boolean(fact.value),
  );

  return {
    attributes: input.attributes,
    brand: optional(input.brand),
    categoryId: input.categoryId,
    categoryName: input.categoryName,
    color: optional(input.color),
    description: input.description.trim(),
    ...eventRange(input.date, input.timeSlot),
    files: input.files,
    location: {
      precision: "AREA_ONLY",
      publicAreaLabel,
      purpose: input.type === "LOST" ? "LOST" : "FOUND",
      visibility: "APPROXIMATE",
    },
    privateFacts,
    publicAreaLabel,
    title: input.title.trim(),
    type: input.type,
  };
}
