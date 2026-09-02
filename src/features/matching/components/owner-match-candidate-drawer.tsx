import { MapPin, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { OwnerMatchCandidate } from "../api/owner-match-candidate-api";
import {
  factorLabel,
  formatCandidateTime,
  reportTypeLabel,
  strengthLabel,
} from "./match-candidate-labels";

export function OwnerMatchCandidateDrawer({
  candidate,
  onOpenChange,
  open,
}: {
  candidate: OwnerMatchCandidate | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent width="max-w-lg">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-plum" aria-hidden="true" />
            Chi tiết kết quả phù hợp
          </DrawerTitle>
        </DrawerHeader>
        {candidate && (
          <DrawerBody>
            <div className="rounded-xl border border-brand-plum/20 bg-brand-soft/40 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-2xl font-black text-brand-plum">
                  {candidate.score} điểm
                </span>
                <Badge variant="matchSuccess">
                  {strengthLabel(candidate.strength)}
                </Badge>
              </div>
              <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-brand-heading">
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                Đây là gợi ý, không phải bằng chứng sở hữu.
              </p>
            </div>

            <section aria-labelledby="candidate-report-heading">
              <div className="flex items-center justify-between gap-3">
                <h4
                  id="candidate-report-heading"
                  className="text-sm font-bold text-brand-heading"
                >
                  {candidate.counterpart.title}
                </h4>
                <Badge
                  variant={
                    candidate.counterpart.type === "FOUND" ? "found" : "lost"
                  }
                >
                  {reportTypeLabel(candidate.counterpart.type)}
                </Badge>
              </div>
              <dl className="mt-3 grid grid-cols-1 gap-3 rounded-xl border border-brand-border p-4 text-xs sm:grid-cols-2">
                <Detail
                  label="Mã công khai"
                  value={candidate.counterpart.publicCode}
                />
                <Detail
                  label="Danh mục"
                  value={candidate.counterpart.category.name}
                />
                <Detail
                  label="Thương hiệu"
                  value={candidate.counterpart.brand ?? "Chưa cung cấp"}
                />
                <Detail
                  label="Màu sắc"
                  value={candidate.counterpart.color ?? "Chưa cung cấp"}
                />
                <Detail
                  label="Thời gian"
                  value={formatCandidateTime(
                    candidate.counterpart.eventStartedAt,
                    candidate.counterpart.eventEndedAt,
                  )}
                />
                <Detail
                  label="Khu vực công khai"
                  value={candidate.counterpart.publicAreaLabel}
                />
              </dl>
            </section>

            <section aria-labelledby="candidate-breakdown-heading">
              <h4
                id="candidate-breakdown-heading"
                className="text-sm font-bold text-brand-heading"
              >
                Các yếu tố tính điểm
              </h4>
              <div className="mt-3 space-y-2">
                {candidate.components.map((factor) => (
                  <div
                    key={factor.code}
                    className="flex items-center justify-between rounded-lg border border-brand-border px-3 py-2.5 text-xs"
                  >
                    <span className="font-medium text-brand-heading">
                      {factorLabel(factor.code)}
                    </span>
                    <span className="font-bold text-brand-plum">
                      {factor.score}/{factor.maxScore} điểm
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-brand-muted">
                <MapPin
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
                Hệ thống chỉ hiển thị khu vực gần đúng; vị trí chính xác và dữ
                liệu xác minh riêng tư không xuất hiện trong kết quả này.
              </p>
            </section>
          </DrawerBody>
        )}
      </DrawerContent>
    </Drawer>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] text-brand-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold text-brand-heading">{value}</dd>
    </div>
  );
}
