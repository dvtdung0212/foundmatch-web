"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type {
  ReportAttributeAnswerInput,
  ReportFormAttribute,
} from "../../api/report-submission";

type Props = {
  answer?: ReportAttributeAnswerInput;
  attribute: ReportFormAttribute;
  disabled?: boolean;
  error?: string;
  onChange: (answer?: ReportAttributeAnswerInput) => void;
};

export function ReportAttributeControl({
  answer,
  attribute,
  disabled,
  error,
  onChange,
}: Props) {
  const common = {
    disabled,
    error,
    label: attribute.name,
    required: attribute.isRequired,
  };
  const text = answer?.value.kind === "TEXT" ? answer.value.textValue : "";
  const setValue = (value: ReportAttributeAnswerInput["value"]) => {
    onChange({ assignmentId: attribute.assignmentId, value });
  };

  switch (attribute.dataType) {
    case "LONG_TEXT":
      return (
        <Textarea
          {...common}
          hint={attribute.helpText ?? undefined}
          maxLength={attribute.maxLength ?? undefined}
          placeholder={attribute.placeholder ?? undefined}
          value={text}
          onChange={(event) =>
            event.target.value === ""
              ? onChange(undefined)
              : setValue({ kind: "TEXT", textValue: event.target.value })
          }
        />
      );
    case "SHORT_TEXT":
      return (
        <Input
          {...common}
          hint={attribute.helpText ?? undefined}
          maxLength={attribute.maxLength ?? undefined}
          placeholder={attribute.placeholder ?? undefined}
          value={text}
          onChange={(event) =>
            event.target.value === ""
              ? onChange(undefined)
              : setValue({ kind: "TEXT", textValue: event.target.value })
          }
        />
      );
    case "NUMBER":
      return (
        <Input
          {...common}
          hint={attribute.helpText ?? undefined}
          type="number"
          value={
            answer?.value.kind === "NUMBER" ? answer.value.numberValue : ""
          }
          onChange={(event) =>
            event.target.value === ""
              ? onChange(undefined)
              : setValue({
                  kind: "NUMBER",
                  numberValue: Number(event.target.value),
                })
          }
        />
      );
    case "DATE":
      return (
        <Input
          {...common}
          hint={attribute.helpText ?? undefined}
          type="date"
          value={answer?.value.kind === "DATE" ? answer.value.dateValue : ""}
          onChange={(event) =>
            event.target.value === ""
              ? onChange(undefined)
              : setValue({ kind: "DATE", dateValue: event.target.value })
          }
        />
      );
    case "BOOLEAN":
      return (
        <Select
          {...common}
          placeholder="Chọn câu trả lời"
          options={[
            { label: "Có", value: "true" },
            { label: "Không", value: "false" },
          ]}
          value={
            answer?.value.kind === "BOOLEAN"
              ? String(answer.value.booleanValue)
              : ""
          }
          onChange={(event) =>
            setValue({
              kind: "BOOLEAN",
              booleanValue: event.target.value === "true",
            })
          }
        />
      );
    case "SINGLE_SELECT":
      return (
        <Select
          {...common}
          placeholder={attribute.placeholder ?? "Chọn giá trị"}
          options={attribute.options.map(({ label, valueAssignmentId }) => ({
            label,
            value: valueAssignmentId,
          }))}
          value={
            answer?.value.kind === "SELECTION"
              ? (answer.value.valueAssignmentIds[0] ?? "")
              : ""
          }
          onChange={(event) =>
            setValue({
              kind: "SELECTION",
              valueAssignmentIds: [event.target.value],
            })
          }
        />
      );
    case "MULTI_SELECT": {
      const selected =
        answer?.value.kind === "SELECTION"
          ? answer.value.valueAssignmentIds
          : [];
      return (
        <fieldset className="space-y-2 sm:col-span-2">
          <legend className="text-xs font-bold text-brand-heading">
            {attribute.name}
            {attribute.isRequired ? " *" : ""}
          </legend>
          {attribute.helpText && (
            <p className="text-xs text-brand-muted">{attribute.helpText}</p>
          )}
          <div className="flex flex-wrap gap-3">
            {attribute.options.map((option) => (
              <Checkbox
                key={option.valueAssignmentId}
                label={option.label}
                checked={selected.includes(option.valueAssignmentId)}
                disabled={disabled}
                onChange={(event) =>
                  setValue({
                    kind: "SELECTION",
                    valueAssignmentIds: event.target.checked
                      ? [...selected, option.valueAssignmentId]
                      : selected.filter(
                          (id) => id !== option.valueAssignmentId,
                        ),
                  })
                }
              />
            ))}
          </div>
          {error && (
            <p className="text-xs font-medium text-brand-lost">{error}</p>
          )}
        </fieldset>
      );
    }
  }
}
