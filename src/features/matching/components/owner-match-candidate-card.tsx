import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  MapPin,
  PackageSearch,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { OwnerMatchCandidate } from "../api/owner-match-candidate-api";
import {
  factorLabel,
  formatCandidateTime,
  reportTypeLabel,
  strengthLabel,
} from "./match-candidate-labels";

export function OwnerMatchCandidateCard({
  candidate,
  disabled,
  onDismiss,
  onOpen,
  onToggleSaved,
}: {
  candidate: OwnerMatchCandidate;
  disabled: boolean;
  onDismiss: () => void;
  onOpen: () => void;
  onToggleSaved: () => void;
}) {
  const matchedFactors = candidate.components.filter((item) => item.score > 0);

  return (
    <Card variant="bordered">
      <CardContent className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-20 w-24 shrink-0 flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900">
            <span className="text-xl font-black leading-none">
              {candidate.score} điểm
            </span>
            <span className="mt-1 text-[11px] font-bold">
              {strengthLabel(candidate.strength)}
            </span>
          </div>
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-brand-border bg-brand-cream text-brand-plum">
            <PackageSearch className="h-8 w-8" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-brand-heading">
                {candidate.counterpart.title}
              </h3>
              <Badge
                variant={
                  candidate.counterpart.type === "FOUND" ? "found" : "lost"
                }
              >
                {reportTypeLabel(candidate.counterpart.type)}
              </Badge>
              {candidate.isSaved && <Badge variant="neutral">Đã lưu</Badge>}
            </div>
            <p className="text-xs font-semibold text-brand-plum">
              {candidate.counterpart.publicCode} ·{" "}
              {candidate.counterpart.category.name}
            </p>
            <div
              className="flex flex-wrap gap-1.5"
              aria-label="Các yếu tố phù hợp"
            >
              {matchedFactors.map((factor) => (
                <span
                  key={factor.code}
                  className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800"
                >
                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                  {factorLabel(factor.code)}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-brand-muted">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {formatCandidateTime(
                  candidate.counterpart.eventStartedAt,
                  candidate.counterpart.eventEndedAt,
                )}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {candidate.counterpart.publicAreaLabel}
              </span>
            </div>
          </div>
        </div>
        <div className="grid w-full shrink-0 grid-cols-1 gap-2 border-t border-brand-border/60 pt-4 sm:grid-cols-3 lg:w-52 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
          <Button size="sm" onClick={onOpen} disabled={disabled}>
            Xem chi tiết kết quả
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleSaved}
            disabled={disabled}
          >
            {candidate.isSaved ? (
              <BookmarkCheck
                className="mr-1.5 h-3.5 w-3.5"
                aria-hidden="true"
              />
            ) : (
              <Bookmark className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            )}
            {candidate.isSaved ? "Bỏ lưu" : "Lưu để xem sau"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            disabled={disabled}
          >
            <XCircle className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Không phù hợp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
