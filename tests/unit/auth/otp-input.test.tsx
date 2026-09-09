import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { OtpInput } from "@/components/ui/otp-input";

function ControlledOtpWrapper({
  initialValue = "",
  length = 6,
  disabled = false,
  error,
}: {
  initialValue?: string;
  length?: number;
  disabled?: boolean;
  error?: string;
}) {
  const [value, setValue] = useState(initialValue);
  return (
    <OtpInput
      disabled={disabled}
      error={error}
      label="Mã xác minh"
      length={length}
      onChange={setValue}
      value={value}
    />
  );
}

describe("OtpInput component", () => {
  it("renders 6 input slots with correct accessibility attributes", () => {
    render(<ControlledOtpWrapper />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);
    expect(inputs[0]).toHaveAttribute("autocomplete", "one-time-code");
    expect(inputs[1]).toHaveAttribute("autocomplete", "off");
  });

  it("updates individual slots and allows typing digits", () => {
    render(<ControlledOtpWrapper />);
    const inputs = screen.getAllByRole("textbox");

    fireEvent.change(inputs[0], { target: { value: "5" } });
    expect(inputs[0]).toHaveValue("5");

    fireEvent.change(inputs[1], { target: { value: "9" } });
    expect(inputs[1]).toHaveValue("9");
  });

  it("filters out non-digit characters", () => {
    const onChange = vi.fn();
    render(<OtpInput label="Mã xác minh" onChange={onChange} value="" />);
    const inputs = screen.getAllByRole("textbox");

    fireEvent.change(inputs[0], { target: { value: "a" } });
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("handles pasting 6 digits across all slots", () => {
    render(<ControlledOtpWrapper />);
    const inputs = screen.getAllByRole("textbox");

    fireEvent.paste(inputs[0], {
      clipboardData: {
        getData: () => "849201",
      },
    });

    expect(inputs[0]).toHaveValue("8");
    expect(inputs[1]).toHaveValue("4");
    expect(inputs[2]).toHaveValue("9");
    expect(inputs[3]).toHaveValue("2");
    expect(inputs[4]).toHaveValue("0");
    expect(inputs[5]).toHaveValue("1");
  });

  it("handles backspace navigation when current slot is empty", () => {
    render(<ControlledOtpWrapper initialValue="12" />);
    const inputs = screen.getAllByRole("textbox");

    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("2");
    expect(inputs[2]).toHaveValue("");

    // Backspace on empty slot 2 should clear slot 1
    fireEvent.keyDown(inputs[2], { key: "Backspace" });
    expect(inputs[1]).toHaveValue("");
  });

  it("displays error message when provided", () => {
    render(<ControlledOtpWrapper error="Mã xác minh không hợp lệ" />);
    expect(screen.getByText("Mã xác minh không hợp lệ")).toBeInTheDocument();
  });
});
