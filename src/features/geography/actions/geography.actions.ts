"use server";

import "server-only";
import { getServerApiClient } from "@/lib/api/server-client";
import type { AdministrativeUnit } from "../types/geography.types";

/**
 * Danh sách dự phòng các tỉnh / thành phố của Việt Nam (khi database local chưa có dữ liệu)
 */
const DEFAULT_VIETNAM_PROVINCES: AdministrativeUnit[] = [
  { id: "VN-01", code: "01", name: "Hà Nội" },
  { id: "VN-79", code: "79", name: "TP. Hồ Chí Minh" },
  { id: "VN-48", code: "48", name: "Đà Nẵng" },
  { id: "VN-31", code: "31", name: "Hải Phòng" },
  { id: "VN-92", code: "92", name: "Cần Thơ" },
  { id: "VN-89", code: "89", name: "An Giang" },
  { id: "VN-77", code: "77", name: "Bà Rịa - Vũng Tàu" },
  { id: "VN-24", code: "24", name: "Bắc Ninh" },
  { id: "VN-04", code: "04", name: "Cao Bằng" },
  { id: "VN-11", code: "11", name: "Điện Biên" },
  { id: "VN-75", code: "75", name: "Đồng Nai" },
  { id: "VN-87", code: "87", name: "Đồng Tháp" },
  { id: "VN-64", code: "64", name: "Gia Lai" },
  { id: "VN-42", code: "42", name: "Hà Tĩnh" },
  { id: "VN-56", code: "56", name: "Khánh Hòa" },
  { id: "VN-91", code: "91", name: "Kiên Giang" },
  { id: "VN-62", code: "62", name: "Kon Tum" },
  { id: "VN-12", code: "12", name: "Lai Châu" },
  { id: "VN-68", code: "68", name: "Lâm Đồng" },
  { id: "VN-20", code: "20", name: "Lạng Sơn" },
  { id: "VN-15", code: "15", name: "Lào Cai" },
  { id: "VN-80", code: "80", name: "Long An" },
  { id: "VN-38", code: "38", name: "Thanh Hóa" },
  { id: "VN-40", code: "40", name: "Nghệ An" },
  { id: "VN-25", code: "25", name: "Phú Thọ" },
  { id: "VN-54", code: "54", name: "Phú Yên" },
  { id: "VN-44", code: "44", name: "Quảng Bình" },
  { id: "VN-49", code: "49", name: "Quảng Nam" },
  { id: "VN-51", code: "51", name: "Quảng Ngãi" },
  { id: "VN-22", code: "22", name: "Quảng Ninh" },
  { id: "VN-45", code: "45", name: "Quảng Trị" },
  { id: "VN-14", code: "14", name: "Sơn La" },
  { id: "VN-72", code: "72", name: "Tây Ninh" },
  { id: "VN-19", code: "19", name: "Thái Nguyên" },
  { id: "VN-46", code: "46", name: "Thừa Thiên Huế" },
  { id: "VN-82", code: "82", name: "Tiền Giang" },
  { id: "VN-84", code: "84", name: "Trà Vinh" },
  { id: "VN-08", code: "08", name: "Tuyên Quang" },
  { id: "VN-86", code: "86", name: "Vĩnh Long" },
  { id: "VN-66", code: "66", name: "Đắk Lắk" },
  { id: "VN-96", code: "96", name: "Cà Mau" },
].sort((a, b) => a.name.localeCompare(b.name, "vi"));

/**
 * Lấy danh sách Tỉnh / Thành phố từ Backend
 */
export async function getPublicProvinces(): Promise<AdministrativeUnit[]> {
  try {
    const apiClient = await getServerApiClient();
    const { data, error } = await apiClient.GET(
      "/api/v1/public/geography/geographies",
      {
        params: {
          query: {
            countryCode: "VN",
            typeCodes: ["CITY", "PROVINCE"],
            pageSize: 100,
            sortBy: "name",
            sortOrder: "asc",
          },
        },
      },
    );

    if (error || !data || !data.data || data.data.length === 0) {
      return DEFAULT_VIETNAM_PROVINCES;
    }

    return data.data.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      typeCode: item.geographyTypeCode,
      parentId: item.parentId,
    }));
  } catch {
    return DEFAULT_VIETNAM_PROVINCES;
  }
}

/**
 * Lấy danh sách Phường / Xã trực thuộc một Tỉnh / Thành phố theo parentId
 */
export async function getPublicWards(
  parentId: string,
): Promise<AdministrativeUnit[]> {
  if (!parentId) {
    return [];
  }

  try {
    const apiClient = await getServerApiClient();
    const { data, error } = await apiClient.GET(
      "/api/v1/public/geography/geographies",
      {
        params: {
          query: {
            parentId,
            pageSize: 100,
            sortBy: "name",
            sortOrder: "asc",
          },
        },
      },
    );

    if (error || !data || !data.data) {
      return [];
    }

    return data.data.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      typeCode: item.geographyTypeCode,
      parentId: item.parentId,
    }));
  } catch {
    return [];
  }
}
