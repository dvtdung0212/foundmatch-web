export type ReportType = "LOST" | "FOUND";

export type PrivateFactInput = {
  kind: string;
  value: string;
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
  createDraft(
    input: Omit<ReportSubmissionInput, "files" | "location" | "privateFacts">,
    idempotencyKey: string,
  ): Promise<Required<Pick<ReportMutationResult, "id" | "publicCode" | "version">>>;
  replaceLocations(
    declarationId: string,
    expectedVersion: number,
    locations: ReportLocationInput[],
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
  ): Promise<ReportMutationResult & Required<Pick<ReportMutationResult, "id" | "publicCode">>>;
}

type PersistReportOptions = {
  idempotencyKey: string;
  submit: boolean;
  submitIdempotencyKey?: string;
};

export async function persistReport(
  api: OwnerReportApi,
  input: ReportSubmissionInput,
  options: PersistReportOptions,
): Promise<Required<Pick<ReportMutationResult, "id" | "publicCode" | "version">> & ReportMutationResult> {
  const { files, location, privateFacts, ...draftInput } = input;
  const draft = await api.createDraft(draftInput, options.idempotencyKey);
  let version = draft.version;

  const locationResult = await api.replaceLocations(draft.id, version, [location]);
  version = locationResult.version;

  if (privateFacts.length > 0) {
    const privateFactsResult = await api.replacePrivateFacts(
      draft.id,
      version,
      privateFacts,
    );
    version = privateFactsResult.version;
  }

  for (const file of files) {
    const uploadResult = await api.uploadMedia(draft.id, version, file);
    version = uploadResult.version;
  }

  if (!options.submit) {
    return { ...draft, version };
  }

  if (!options.submitIdempotencyKey) {
    throw new Error("A submit idempotency key is required.");
  }

  return api.submit(
    draft.id,
    version,
    options.submitIdempotencyKey,
  );
}
