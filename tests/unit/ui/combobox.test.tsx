import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Combobox } from "@/components/ui/combobox";

describe("Combobox component", () => {
  const options = [
    { label: "Hà Nội", value: "01", id: "geo-1" },
    { label: "TP. Hồ Chí Minh", value: "79", id: "geo-2" },
    { label: "Đà Nẵng", value: "48", id: "geo-3" },
  ];

  it("renders with label and placeholder", () => {
    render(
      <Combobox
        label="Tỉnh / Thành phố"
        placeholder="Chọn tỉnh thành..."
        options={options}
      />,
    );

    expect(screen.getByText("Tỉnh / Thành phố")).toBeDefined();
    expect(screen.getByPlaceholderText("Chọn tỉnh thành...")).toBeDefined();
  });

  it("opens dropdown and filters options on input", () => {
    render(
      <Combobox
        label="Tỉnh / Thành phố"
        placeholder="Chọn tỉnh thành..."
        options={options}
      />,
    );

    const input = screen.getByPlaceholderText("Chọn tỉnh thành...");
    fireEvent.focus(input);

    expect(screen.getByText("Hà Nội")).toBeDefined();
    expect(screen.getByText("TP. Hồ Chí Minh")).toBeDefined();
    expect(screen.getByText("Đà Nẵng")).toBeDefined();

    // Type query
    fireEvent.change(input, { target: { value: "hồ chí" } });
    expect(screen.getByText("TP. Hồ Chí Minh")).toBeDefined();
    expect(screen.queryByText("Hà Nội")).toBeNull();
  });

  it("selects an option and triggers onChange", () => {
    const handleChange = vi.fn();
    render(
      <Combobox
        label="Tỉnh / Thành phố"
        placeholder="Chọn tỉnh thành..."
        options={options}
        onChange={handleChange}
      />,
    );

    const input = screen.getByPlaceholderText("Chọn tỉnh thành...");
    fireEvent.focus(input);

    const option = screen.getByText("Đà Nẵng");
    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalledWith(
      "Đà Nẵng",
      expect.objectContaining({ label: "Đà Nẵng", value: "48" }),
    );
  });

  it("respects disabled state", () => {
    render(
      <Combobox
        label="Tỉnh / Thành phố"
        placeholder="Chưa cập nhật"
        options={options}
        disabled
      />,
    );

    const input = screen.getByPlaceholderText("Chưa cập nhật");
    expect(input.hasAttribute("disabled")).toBe(true);

    fireEvent.focus(input);
    expect(screen.queryByText("Hà Nội")).toBeNull();
  });
});
