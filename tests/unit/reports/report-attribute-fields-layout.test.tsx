import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ReportAttributeFields } from "@/features/reports/components/create/ReportAttributeFields";
import type { ReportFormConfiguration } from "@/features/reports/api/report-submission";

const configuration: ReportFormConfiguration = {
  category: { id: "category-id", inputMode: "STANDARD", name: "Wallet" },
  reportType: "LOST",
  attributes: [1, 2, 3].map((index) => ({
    assignmentId: `assignment-${index}`,
    attributeId: `attribute-${index}`,
    dataType: "SHORT_TEXT" as const,
    displayOrder: index,
    exposure: "PUBLIC" as const,
    isForMatch: true,
    isForVerification: false,
    isRequired: false,
    key: `field-${index}`,
    name: `Field ${index}`,
    options: [],
  })),
};

describe("ReportAttributeFields layout", () => {
  it("lets fields wrap and grow to fill the available row width", () => {
    const { container } = render(
      <ReportAttributeFields
        answers={[]}
        configuration={configuration}
        exposure="PUBLIC"
        onChange={vi.fn()}
      />,
    );

    const fieldLayout = container.querySelector(
      "[data-report-attribute-layout]",
    );
    expect(fieldLayout).toHaveClass("flex", "flex-wrap");
    expect(fieldLayout?.children).toHaveLength(3);
    for (const field of Array.from(fieldLayout?.children ?? [])) {
      expect(field).toHaveClass("flex-1", "basis-72", "min-w-0");
    }
  });
});
