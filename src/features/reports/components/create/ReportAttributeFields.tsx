"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type {
  ReportAttributeAnswerInput,
  ReportFormConfiguration,
} from "../../api/report-submission";
import { ReportAttributeControl } from "./ReportAttributeControl";

type Props = {
  answers: ReportAttributeAnswerInput[];
  configuration: ReportFormConfiguration | null;
  disabled?: boolean;
  embedded?: boolean;
  errors?: Record<string, string>;
  exposure: "PUBLIC" | "PRIVATE";
  onChange: (answers: ReportAttributeAnswerInput[]) => void;
};

export function validateReportAttributeAnswers(
  configuration: ReportFormConfiguration | null,
  answers: ReportAttributeAnswerInput[],
  exposure: "PUBLIC" | "PRIVATE",
): Record<string, string> {
  if (!configuration) return {};
  const errors: Record<string, string> = {};
  if (
    configuration.category.inputMode === "CUSTOM" ||
    (exposure === "PRIVATE" &&
      configuration.category.allowsPrivateCustomAnswers)
  ) {
    answers
      .filter((answer) => !answer.assignmentId && answer.exposure === exposure)
      .forEach((answer, index) => {
        if (!answer.customKey?.trim()) {
          errors[`custom.${exposure}.${index}.key`] =
            "Vui lòng nhập tên thuộc tính.";
        }
        if (answer.value.kind !== "TEXT" || !answer.value.textValue.trim()) {
          errors[`custom.${exposure}.${index}.value`] =
            "Vui lòng nhập giá trị.";
        }
      });
  }
  for (const attribute of configuration.attributes) {
    if (attribute.exposure !== exposure || !attribute.isRequired) continue;
    const answer = answers.find(
      ({ assignmentId }) => assignmentId === attribute.assignmentId,
    );
    if (!answer || isEmptyValue(answer)) {
      errors[attribute.assignmentId] =
        `Vui lòng nhập ${attribute.name.toLowerCase()}.`;
    }
  }
  return errors;
}

function isEmptyValue(answer: ReportAttributeAnswerInput): boolean {
  switch (answer.value.kind) {
    case "TEXT":
      return !answer.value.textValue.trim();
    case "SELECTION":
      return answer.value.valueAssignmentIds.length === 0;
    case "DATE":
      return !answer.value.dateValue;
    default:
      return false;
  }
}

export function ReportAttributeFields({
  answers,
  configuration,
  disabled,
  embedded = false,
  errors = {},
  exposure,
  onChange,
}: Props) {
  if (!configuration) return null;

  if (configuration.category.inputMode === "CUSTOM") {
    const customAnswers = answers.filter(
      (answer) => !answer.assignmentId && answer.exposure === exposure,
    );
    return (
      <section
        className="space-y-3"
        aria-label={
          exposure === "PUBLIC" ? "Thuộc tính công khai" : "Thuộc tính riêng tư"
        }
      >
        <div>
          <h4 className="text-sm font-bold text-brand-heading">
            {embedded
              ? "Thông tin xác minh bổ sung"
              : exposure === "PUBLIC"
              ? "Thông tin nhận dạng công khai"
              : "Thông tin riêng để đối chiếu"}
          </h4>
          <p className="mt-1 text-xs text-brand-muted">
            {embedded
              ? "Thêm đặc điểm riêng chưa có trong danh mục; dữ liệu này chỉ dùng khi cần xác minh quyền sở hữu."
              : exposure === "PUBLIC"
              ? "Thông tin này có thể xuất hiện trên báo cáo công khai và được gửi duyệt để chuẩn hóa danh mục."
              : "Chỉ bạn và quy trình xác minh được phép sử dụng; giá trị riêng tư không được đưa sang hàng chờ duyệt."}
          </p>
        </div>
        {customAnswers.map((answer, index) => {
          const answerIndex = answers.indexOf(answer);
          return (
            <div
              key={`${exposure}-${index}`}
              className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] sm:items-end"
            >
              <Input
                label="Tên thuộc tính"
                value={answer.customKey ?? ""}
                disabled={disabled}
                maxLength={120}
                error={errors[`custom.${exposure}.${index}.key`]}
                onChange={(event) =>
                  updateAnswer(
                    answers,
                    answerIndex,
                    { ...answer, customKey: event.target.value },
                    onChange,
                  )
                }
              />
              <Input
                label="Giá trị"
                value={
                  answer.value.kind === "TEXT" ? answer.value.textValue : ""
                }
                disabled={disabled}
                maxLength={1000}
                error={errors[`custom.${exposure}.${index}.value`]}
                onChange={(event) =>
                  updateAnswer(
                    answers,
                    answerIndex,
                    {
                      ...answer,
                      value: { kind: "TEXT", textValue: event.target.value },
                    },
                    onChange,
                  )
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled}
                aria-label="Xóa thuộc tính tự nhập"
                onClick={() =>
                  onChange(
                    answers.filter(
                      (_, currentIndex) => currentIndex !== answerIndex,
                    ),
                  )
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || answers.length >= 50}
          onClick={() =>
            onChange([
              ...answers,
              {
                customKey: "",
                exposure,
                value: { kind: "TEXT", textValue: "" },
              },
            ])
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm thuộc tính
        </Button>
      </section>
    );
  }

  const attributes = configuration.attributes.filter(
    (attribute) => attribute.exposure === exposure,
  );
  if (attributes.length === 0) {
    if (
      exposure === "PRIVATE" &&
      configuration.category.allowsPrivateCustomAnswers
    ) {
      return (
        <ReportAttributeFields
          answers={answers}
          configuration={{
            ...configuration,
            attributes: [],
            category: { ...configuration.category, inputMode: "CUSTOM" },
          }}
          disabled={disabled}
          errors={errors}
          exposure="PRIVATE"
          onChange={onChange}
        />
      );
    }
    return null;
  }

  return (
    <section
      className="space-y-4"
      aria-label={
        exposure === "PUBLIC" ? "Thuộc tính công khai" : "Thuộc tính riêng tư"
      }
    >
      <div>
        <h4 className="text-sm font-bold text-brand-heading">
          {exposure === "PUBLIC"
            ? "Đặc điểm theo danh mục"
            : "Đặc điểm riêng để xác minh"}
        </h4>
        <p className="mt-1 text-xs text-brand-muted">
          {exposure === "PUBLIC"
            ? "Các trường được cấu hình riêng cho danh mục và loại báo cáo này."
            : "Không hiển thị công khai và không dùng để tính điểm matching; chỉ dùng để xác minh quyền sở hữu."}
        </p>
      </div>
      <div data-report-attribute-layout className="flex flex-wrap gap-4">
        {attributes.map((attribute) => (
          <div
            key={attribute.assignmentId}
            className={
              attribute.dataType === "MULTI_SELECT"
                ? "w-full min-w-0"
                : "min-w-0 flex-1 basis-72"
            }
          >
            <ReportAttributeControl
              answer={answers.find(
                ({ assignmentId }) => assignmentId === attribute.assignmentId,
              )}
              attribute={attribute}
              disabled={disabled}
              error={errors[attribute.assignmentId]}
              onChange={(answer) => {
                const currentIndex = answers.findIndex(
                  ({ assignmentId }) => assignmentId === attribute.assignmentId,
                );
                if (!answer) {
                  onChange(
                    answers.filter((_, index) => index !== currentIndex),
                  );
                } else if (currentIndex === -1) {
                  onChange([...answers, answer]);
                } else {
                  updateAnswer(answers, currentIndex, answer, onChange);
                }
              }}
            />
          </div>
        ))}
      </div>
      {exposure === "PRIVATE" &&
      configuration.category.allowsPrivateCustomAnswers ? (
        <ReportAttributeFields
          answers={answers}
          configuration={{
            ...configuration,
            attributes: [],
            category: { ...configuration.category, inputMode: "CUSTOM" },
          }}
          disabled={disabled}
          embedded
          errors={errors}
          exposure="PRIVATE"
          onChange={onChange}
        />
      ) : null}
    </section>
  );
}

function updateAnswer(
  answers: ReportAttributeAnswerInput[],
  index: number,
  answer: ReportAttributeAnswerInput,
  onChange: (answers: ReportAttributeAnswerInput[]) => void,
) {
  onChange(
    answers.map((current, currentIndex) =>
      currentIndex === index ? answer : current,
    ),
  );
}
