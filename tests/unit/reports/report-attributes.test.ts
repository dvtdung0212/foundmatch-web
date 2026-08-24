import { describe, expect, it } from "vitest";

import { validateReportAttributeAnswers } from "@/features/reports/components/create/ReportAttributeFields";
import type { ReportFormConfiguration } from "@/features/reports/api/report-submission";

const configuration: ReportFormConfiguration = {
  category: { id: "category-id", inputMode: "STANDARD", name: "Wallet" },
  reportType: "LOST",
  attributes: [
    {
      assignmentId: "assignment-id",
      attributeId: "attribute-id",
      dataType: "SHORT_TEXT",
      displayOrder: 1,
      exposure: "PUBLIC",
      isForMatch: true,
      isForVerification: false,
      isRequired: true,
      key: "material",
      name: "Material",
      options: [],
    },
  ],
};

describe("validateReportAttributeAnswers", () => {
  it("requires only configured attributes in the current exposure section", () => {
    expect(validateReportAttributeAnswers(configuration, [], "PUBLIC")).toEqual(
      {
        "assignment-id": "Vui lòng nhập material.",
      },
    );
    expect(
      validateReportAttributeAnswers(configuration, [], "PRIVATE"),
    ).toEqual({});
  });

  it("accepts a non-empty normalized answer", () => {
    expect(
      validateReportAttributeAnswers(
        configuration,
        [
          {
            assignmentId: "assignment-id",
            value: { kind: "TEXT", textValue: "Leather" },
          },
        ],
        "PUBLIC",
      ),
    ).toEqual({});
  });

  it("validates incomplete custom public and private rows independently", () => {
    const customConfiguration: ReportFormConfiguration = {
      ...configuration,
      category: { ...configuration.category, inputMode: "CUSTOM" },
      attributes: [],
    };
    const answers = [
      {
        customKey: "",
        exposure: "PUBLIC" as const,
        isForMatch: true,
        isForVerification: false,
        value: { kind: "TEXT" as const, textValue: "red" },
      },
      {
        customKey: "serial suffix",
        exposure: "PRIVATE" as const,
        isForMatch: true,
        isForVerification: true,
        value: { kind: "TEXT" as const, textValue: "" },
      },
    ];

    expect(
      validateReportAttributeAnswers(customConfiguration, answers, "PUBLIC"),
    ).toHaveProperty("custom.PUBLIC.0.key");
    expect(
      validateReportAttributeAnswers(customConfiguration, answers, "PRIVATE"),
    ).toHaveProperty("custom.PRIVATE.0.value");
  });
});
