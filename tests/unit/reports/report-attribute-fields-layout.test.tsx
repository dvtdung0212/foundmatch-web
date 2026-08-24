import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ReportAttributeFields } from "@/features/reports/components/create/ReportAttributeFields";
import type { ReportFormConfiguration } from "@/features/reports/api/report-submission";

const configuration: ReportFormConfiguration = {
  category: {
    allowsPrivateCustomAnswers: true,
    id: "category-id",
    inputMode: "STANDARD",
    name: "Wallet",
  },
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

  it("offers private custom attributes in a standard category", () => {
    const privateConfiguration: ReportFormConfiguration = {
      ...configuration,
      attributes: configuration.attributes.map((attribute, index) => ({
        ...attribute,
        exposure: index === 0 ? "PRIVATE" : attribute.exposure,
      })),
    };
    render(
      <ReportAttributeFields
        answers={[]}
        configuration={privateConfiguration}
        exposure="PRIVATE"
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /thêm thuộc tính/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Thông tin xác minh bổ sung" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Thông tin riêng để đối chiếu" }),
    ).not.toBeInTheDocument();
  });
});
