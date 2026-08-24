export type ReportType = "LOST" | "FOUND";

export type PrivateFactInput = {
  kind: string;
  value: string;
};

export type ReportAttributeValueInput =
  | { kind: "TEXT"; textValue: string }
  | { kind: "NUMBER"; numberValue: number }
  | { kind: "BOOLEAN"; booleanValue: boolean }
  | { kind: "DATE"; dateValue: string }
  | { kind: "SELECTION"; valueAssignmentIds: string[] };

export type ReportAttributeAnswerInput = {
  assignmentId?: string;
  customKey?: string;
  exposure?: "PUBLIC" | "PRIVATE";
  value: ReportAttributeValueInput;
};

export type ReportFormAttribute = {
  assignmentId: string;
  attributeId: string;
  dataType:
    | "SHORT_TEXT"
    | "LONG_TEXT"
    | "SINGLE_SELECT"
    | "MULTI_SELECT"
    | "NUMBER"
    | "BOOLEAN"
    | "DATE";
  displayOrder: number;
  exposure: "PUBLIC" | "PRIVATE";
  helpText?: string | null;
  isForMatch: boolean;
  isForVerification: boolean;
  isRequired: boolean;
  key: string;
  maxLength?: number | null;
  name: string;
  options: Array<{
    label: string;
    value: string;
    valueAssignmentId: string;
    valueId: string;
  }>;
  placeholder?: string | null;
  regex?: string | null;
};

export type ReportFormConfiguration = {
  attributes: ReportFormAttribute[];
  category: {
    allowsPrivateCustomAnswers: boolean;
    id: string;
    inputMode: "STANDARD" | "CUSTOM";
    name: string;
  };
  reportType: ReportType;
};

export type ReportLocationInput = {
  exactLatitude?: number | null;
  exactLongitude?: number | null;
  geographyId?: string | null;
  precision: "EXACT" | "APPROXIMATE" | "AREA_ONLY" | "UNKNOWN";
  publicAreaLabel: string;
  purpose: "LAST_SEEN" | "LOST" | "SUSPECTED_LOST" | "FOUND";
  uncertaintyRadiusMeters?: number | null;
  visibility: "PRIVATE" | "MATCH_ONLY" | "APPROXIMATE";
};

export type ReportSubmissionInput = {
  attributes: ReportAttributeAnswerInput[];
  brand?: string;
  categoryId: string;
  categoryName: string;
  color?: string;
  description: string;
  eventEndedAt?: string;
  eventStartedAt: string;
  files: File[];
  location: ReportLocationInput;
  privateFacts: PrivateFactInput[];
  publicAreaLabel: string;
  title: string;
  type: ReportType;
};

export type ReportMutationResult = {
  id?: string;
  publicCode?: string;
  version: number;
  workflowStatus?: string;
};

export interface OwnerReportApi {
  getFormConfiguration(
    categoryId: string,
    type: ReportType,
  ): Promise<ReportFormConfiguration>;
  createDraft(
    input: Omit<
      ReportSubmissionInput,
      "attributes" | "files" | "location" | "privateFacts"
    >,
    idempotencyKey: string,
  ): Promise<
    Required<Pick<ReportMutationResult, "id" | "publicCode" | "version">>
  >;
  replaceLocations(
    declarationId: string,
    expectedVersion: number,
    locations: ReportLocationInput[],
  ): Promise<ReportMutationResult>;
  replaceAttributes(
    declarationId: string,
    expectedVersion: number,
    answers: ReportAttributeAnswerInput[],
  ): Promise<ReportMutationResult>;
  replacePrivateFacts(
    declarationId: string,
    expectedVersion: number,
    facts: PrivateFactInput[],
  ): Promise<ReportMutationResult>;
  uploadMedia(
    declarationId: string,
    expectedVersion: number,
    file: File,
  ): Promise<ReportMutationResult>;
  submit(
    declarationId: string,
    expectedVersion: number,
    idempotencyKey: string,
  ): Promise<
    ReportMutationResult &
      Required<Pick<ReportMutationResult, "id" | "publicCode">>
  >;
}

type PersistReportOptions = {
  idempotencyKey: string;
  onMediaUploaded?: (fileKey: string) => void;
  submit: boolean;
  submitIdempotencyKey?: string;
  uploadedFileKeys?: ReadonlySet<string>;
};

export function reportFileKey(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}:${file.type}`;
}

export async function persistReport(
  api: OwnerReportApi,
  input: ReportSubmissionInput,
  options: PersistReportOptions,
): Promise<
  Required<Pick<ReportMutationResult, "id" | "publicCode" | "version">> &
    ReportMutationResult
> {
  const { attributes, files, location, privateFacts, ...draftInput } = input;
  const draft = await api.createDraft(draftInput, options.idempotencyKey);
  let version = draft.version;

  const locationResult = await api.replaceLocations(draft.id, version, [
    location,
  ]);
  version = locationResult.version;

  const attributeResult = await api.replaceAttributes(
    draft.id,
    version,
    attributes,
  );
  version = attributeResult.version;

  if (privateFacts.length > 0) {
    const privateFactsResult = await api.replacePrivateFacts(
      draft.id,
      version,
      privateFacts,
    );
    version = privateFactsResult.version;
  }

  for (const file of files) {
    const fileKey = reportFileKey(file);
    if (options.uploadedFileKeys?.has(fileKey)) continue;
    const uploadResult = await api.uploadMedia(draft.id, version, file);
    version = uploadResult.version;
    options.onMediaUploaded?.(fileKey);
  }

  if (!options.submit) {
    return { ...draft, version };
  }

  if (!options.submitIdempotencyKey) {
    throw new Error("A submit idempotency key is required.");
  }

  return api.submit(draft.id, version, options.submitIdempotencyKey);
}
