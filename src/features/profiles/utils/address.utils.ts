export interface ParsedAddress {
  city: string;
  ward: string;
  streetAddress: string;
}

/**
 * Tách chuỗi địa chỉ thành 3 thành phần: thành phố, phường xã, địa chỉ cụ thể
 */
export function parseAddress(rawAddress?: string | null): ParsedAddress {
  if (!rawAddress) {
    return { city: "", ward: "", streetAddress: "" };
  }
  const parts = rawAddress
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length >= 3) {
    const city = parts[parts.length - 1];
    const ward = parts[parts.length - 2];
    const streetAddress = parts.slice(0, parts.length - 2).join(", ");
    return { city, ward, streetAddress };
  }
  if (parts.length === 2) {
    return { streetAddress: "", ward: parts[0], city: parts[1] };
  }
  if (parts.length === 1) {
    return { streetAddress: "", ward: "", city: parts[0] };
  }
  return { city: "", ward: "", streetAddress: "" };
}

/**
 * Ghép các trường lẻ thành chuỗi địa chỉ chuẩn hóa để lưu trữ
 */
export function formatAddress(
  city: string,
  ward: string,
  streetAddress: string,
): string {
  return [streetAddress.trim(), ward.trim(), city.trim()]
    .filter(Boolean)
    .join(", ");
}
