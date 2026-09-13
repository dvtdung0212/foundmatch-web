"use client";

import * as React from "react";
import { ChevronDown, Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  label: string;
  value: string;
  id?: string;
}

export interface ComboboxProps {
  id?: string;
  label?: string;
  labelClassName?: string;
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string, option?: ComboboxOption) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  allowCustomInput?: boolean;
  error?: string;
}

/**
 * Loại bỏ dấu tiếng Việt để tìm kiếm không dấu mượt mà
 */
function normalizeVietnamese(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

export function Combobox({
  id,
  label,
  labelClassName,
  options,
  value = "",
  onChange,
  placeholder = "Chọn hoặc nhập...",
  className,
  disabled = false,
  loading = false,
  icon,
  allowCustomInput = true,
  error,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState(value);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const [placement, setPlacement] = React.useState<"bottom" | "top">("bottom");
  const [maxHeightStyle, setMaxHeightStyle] = React.useState<number>(240);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto detect best vertical placement (lật lên trên nếu chạm đáy màn hình)
  React.useEffect(() => {
    if (!open) return;

    const updatePlacement = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const desiredHeight = 240;

      if (spaceBelow < desiredHeight && spaceAbove > spaceBelow) {
        setPlacement("top");
        setMaxHeightStyle(Math.min(240, Math.max(120, spaceAbove - 20)));
      } else {
        setPlacement("bottom");
        setMaxHeightStyle(Math.min(240, Math.max(120, spaceBelow - 20)));
      }
    };

    updatePlacement();
    window.addEventListener("scroll", updatePlacement, { passive: true });
    window.addEventListener("resize", updatePlacement);
    return () => {
      window.removeEventListener("scroll", updatePlacement);
      window.removeEventListener("resize", updatePlacement);
    };
  }, [open]);

  // Đồng bộ query khi prop value thay đổi từ bên ngoài
  React.useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Lọc options dựa theo query
  const filteredOptions = React.useMemo(() => {
    if (!query.trim()) {
      return options;
    }
    const normalizedQuery = normalizeVietnamese(query);
    return options.filter((opt) =>
      normalizeVietnamese(opt.label).includes(normalizedQuery),
    );
  }, [options, query]);

  // Click outside to close
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        // Nếu không cho custom input và giá trị không khớp option nào, reset lại
        if (!allowCustomInput) {
          const matched = options.find((opt) => opt.label === value);
          setQuery(matched ? matched.label : "");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [allowCustomInput, options, value]);

  const handleSelectOption = (option: ComboboxOption) => {
    setQuery(option.label);
    setOpen(false);
    onChange?.(option.label, option);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (!open) setOpen(true);
    setHighlightedIndex(-1);

    if (allowCustomInput) {
      // Tìm xem có option nào khớp hoàn toàn không
      const matched = options.find(
        (opt) =>
          normalizeVietnamese(opt.label) === normalizeVietnamese(val),
      );
      onChange?.(val, matched);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev,
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      if (open && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        e.preventDefault();
        handleSelectOption(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery("");
    onChange?.("", undefined);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative space-y-1.5", open && "z-40", className)}
    >
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "block text-xs font-bold text-brand-heading uppercase tracking-wider cursor-pointer mb-1.5",
            labelClassName
          )}
          onClick={() => inputRef.current?.focus()}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none">
            {icon}
          </div>
        )}

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (!disabled) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "w-full rounded-xl border border-brand-border bg-white py-3 text-[13px] font-semibold text-brand-heading outline-none transition-all placeholder:text-brand-muted/60 focus:border-brand-plum focus:ring-2 focus:ring-brand-plum/20 disabled:cursor-not-allowed disabled:bg-slate-100/80 disabled:border-slate-200 disabled:text-slate-500 disabled:opacity-75 disabled:shadow-none",
            icon ? "pl-10" : "pl-3.5",
            disabled ? "pr-10" : "pr-16",
            error && "border-brand-lost focus:border-brand-lost focus:ring-brand-lost/20",
          )}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-brand-plum shrink-0" />
          )}

          {!disabled && query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-brand-muted hover:text-brand-heading rounded-md transition-colors"
              title="Xóa"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {!disabled && (
            <button
              type="button"
              onClick={() => {
                setOpen((prev) => !prev);
                inputRef.current?.focus();
              }}
              tabIndex={-1}
              className="p-1 text-brand-muted hover:text-brand-heading rounded-md transition-colors"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Options List */}
      {open && !disabled && (
        <div
          style={{ maxHeight: `${maxHeightStyle}px` }}
          className={cn(
            "absolute left-0 right-0 overflow-y-auto rounded-2xl bg-white p-1.5 shadow-2xl border border-brand-border z-50 animate-in fade-in-0 zoom-in-95 duration-150",
            placement === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5",
          )}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => {
              const isSelected = opt.label === query;
              const isHighlighted = idx === highlightedIndex;

              return (
                <div
                  key={opt.id || `${opt.value}-${idx}`}
                  onClick={() => handleSelectOption(opt)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-colors",
                    isHighlighted ? "bg-slate-100/80 text-brand-heading" : "text-brand-heading",
                    isSelected && "bg-[#FFF4F1] text-brand-plum font-bold",
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-brand-plum shrink-0 ml-2" />}
                </div>
              );
            })
          ) : (
            <div className="px-3 py-3 text-[13px] font-semibold text-brand-muted text-center">
              {allowCustomInput
                ? `Không có trong danh mục. Nhấn Enter hoặc giữ nguyên để dùng "${query}".`
                : "Không tìm thấy kết quả phù hợp."}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[12px] font-semibold text-brand-lost mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
