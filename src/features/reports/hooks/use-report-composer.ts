"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  createAuthenticatedOwnerReportApi,
  listReportCategories,
  ReportApiError,
  type ReportCategoryOption,
} from "../api/owner-report-api";
import {
  persistReport,
  type ReportFormConfiguration,
  type ReportSubmissionInput,
  type ReportMutationResult,
} from "../api/report-submission";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGES = 5;

export type SelectedReportImage = {
  file: File;
  previewUrl: string;
};

export function useReportComposer(type: ReportSubmissionInput["type"]) {
  const [categories, setCategories] = useState<ReportCategoryOption[]>([]);
  const [images, setImages] = useState<SelectedReportImage[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingFormConfiguration, setIsLoadingFormConfiguration] =
    useState(false);
  const [formConfiguration, setFormConfiguration] =
    useState<ReportFormConfiguration | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<ReportApiError | null>(null);
  const imagesRef = useRef<SelectedReportImage[]>([]);
  const inFlightRef = useRef(false);
  const intentKeysRef = useRef<{ create: string; submit: string } | null>(null);
  const uploadedFileKeysRef = useRef(new Set<string>());
  const formConfigurationRequestRef = useRef(0);

  useEffect(() => {
    let active = true;
    setIsLoadingCategories(true);
    listReportCategories(type)
      .then((result) => {
        if (active) setCategories(result);
      })
      .catch((cause) => {
        if (active) {
          setError(
            cause instanceof ReportApiError
              ? cause
              : new ReportApiError({ message: "Không thể tải danh mục." }),
          );
        }
      })
      .finally(() => {
        if (active) setIsLoadingCategories(false);
      });

    return () => {
      active = false;
    };
  }, [type]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(
    () => () => {
      for (const image of imagesRef.current)
        URL.revokeObjectURL(image.previewUrl);
    },
    [],
  );

  const addImages = useCallback((incoming: File[]) => {
    setError(null);
    const invalid = incoming.find(
      (file) =>
        !ALLOWED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_BYTES,
    );
    if (invalid) {
      setError(
        new ReportApiError({
          code: "ITEM_DECLARATION_MEDIA_INVALID",
          message: "Ảnh phải là JPG, PNG hoặc WEBP và không vượt quá 10 MB.",
        }),
      );
      return;
    }

    setImages((current) => {
      const remaining = Math.max(0, MAX_IMAGES - current.length);
      return [
        ...current,
        ...incoming.slice(0, remaining).map((file) => ({
          file,
          previewUrl: URL.createObjectURL(file),
        })),
      ];
    });
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((current) => {
      const removed = current[index];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return current.filter((_, imageIndex) => imageIndex !== index);
    });
  }, []);

  const loadFormConfiguration = useCallback(
    async (categoryId: string) => {
      const requestNumber = ++formConfigurationRequestRef.current;
      if (!categoryId) {
        setFormConfiguration(null);
        return null;
      }
      setError(null);
      setFormConfiguration(null);
      setIsLoadingFormConfiguration(true);
      try {
        const api = await createAuthenticatedOwnerReportApi();
        const configuration = await api.getFormConfiguration(categoryId, type);
        if (requestNumber === formConfigurationRequestRef.current) {
          setFormConfiguration(configuration);
        }
        return configuration;
      } catch (cause) {
        const normalized =
          cause instanceof ReportApiError
            ? cause
            : new ReportApiError({
                message: "Không thể tải cấu hình thuộc tính.",
              });
        if (requestNumber === formConfigurationRequestRef.current) {
          setError(normalized);
          setFormConfiguration(null);
        }
        return null;
      } finally {
        if (requestNumber === formConfigurationRequestRef.current) {
          setIsLoadingFormConfiguration(false);
        }
      }
    },
    [type],
  );

  const persist = useCallback(
    async (input: Omit<ReportSubmissionInput, "files">, submit: boolean) => {
      if (inFlightRef.current) {
        throw new ReportApiError({
          code: "REPORT_SUBMISSION_IN_PROGRESS",
          message:
            "Báo cáo đang được gửi. Vui lòng chờ yêu cầu hiện tại hoàn tất.",
        });
      }

      inFlightRef.current = true;
      setError(null);
      setIsSaving(true);
      try {
        intentKeysRef.current ??= {
          create: crypto.randomUUID(),
          submit: crypto.randomUUID(),
        };
        const api = await createAuthenticatedOwnerReportApi();
        return await persistReport(
          api,
          { ...input, files: images.map(({ file }) => file) },
          {
            idempotencyKey: intentKeysRef.current.create,
            onMediaUploaded: (fileKey) =>
              uploadedFileKeysRef.current.add(fileKey),
            submit,
            submitIdempotencyKey: submit
              ? intentKeysRef.current.submit
              : undefined,
            uploadedFileKeys: uploadedFileKeysRef.current,
          },
        );
      } catch (cause) {
        const normalized =
          cause instanceof ReportApiError
            ? cause
            : new ReportApiError({
                message:
                  cause instanceof Error
                    ? cause.message
                    : "Không thể lưu báo cáo lúc này.",
              });
        setError(normalized);
        throw normalized;
      } finally {
        inFlightRef.current = false;
        setIsSaving(false);
      }
    },
    [images],
  );

  return {
    addImages,
    categories,
    error,
    formConfiguration,
    images,
    isLoadingCategories,
    isLoadingFormConfiguration,
    isSaving,
    loadFormConfiguration,
    persist,
    removeImage,
    setError,
  };
}

export type PersistedReport = ReportMutationResult;
