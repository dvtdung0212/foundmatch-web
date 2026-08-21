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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<ReportApiError | null>(null);
  const imagesRef = useRef<SelectedReportImage[]>([]);

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
      for (const image of imagesRef.current) URL.revokeObjectURL(image.previewUrl);
    },
    [],
  );

  const addImages = useCallback((incoming: File[]) => {
    setError(null);
    const invalid = incoming.find(
      (file) => !ALLOWED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_BYTES,
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

  const persist = useCallback(
    async (input: Omit<ReportSubmissionInput, "files">, submit: boolean) => {
      setError(null);
      setIsSaving(true);
      try {
        const api = await createAuthenticatedOwnerReportApi();
        return await persistReport(
          api,
          { ...input, files: images.map(({ file }) => file) },
          {
            idempotencyKey: crypto.randomUUID(),
            submit,
            submitIdempotencyKey: submit ? crypto.randomUUID() : undefined,
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
        setIsSaving(false);
      }
    },
    [images],
  );

  return {
    addImages,
    categories,
    error,
    images,
    isLoadingCategories,
    isSaving,
    persist,
    removeImage,
    setError,
  };
}

export type PersistedReport = ReportMutationResult;
