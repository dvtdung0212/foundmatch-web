import "server-only";

import { cookies } from "next/headers";
import { getApiClient } from "./client";

export async function getServerApiClient() {
  const cookieHeader = cookies()
    .getAll()
    .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
    .join("; ");
  return getApiClient({ cookieHeader });
}
