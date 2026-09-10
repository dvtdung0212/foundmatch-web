"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { appFeedback as toast } from "@/features/feedback";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { OwnerMatchCandidate } from "@/features/matching/api/owner-match-candidate-api";
import { OwnerMatchCandidateCard } from "@/features/matching/components/owner-match-candidate-card";
import { OwnerMatchCandidateDrawer } from "@/features/matching/components/owner-match-candidate-drawer";
import { useOwnerMatchCandidates } from "@/features/matching/hooks/use-owner-match-candidates";
import type { OwnerReportView } from "../../../api/owner-report-view";

interface MatchCandidatesTabProps {
  report: OwnerReportView;
}

export function MatchCandidatesTab({ report }: MatchCandidatesTabProps) {
  const [selected, setSelected] = useState<OwnerMatchCandidate | null>(null);
  const matching = useOwnerMatchCandidates(report.id);
  const highestScore = matching.candidates.reduce(
    (highest, candidate) => Math.max(highest, candidate.score),
    0,
  );

  const dismiss = async (candidate: OwnerMatchCandidate) => {
    try {
      await matching.dismiss(candidate);
      toast.success(`Đã ẩn kết quả “${candidate.counterpart.title}”`, {
        action: {
          label: "Hoàn tác",
          onClick: () => void matching.restore(candidate),
        },
      });
    } catch (error) {
      showError(error);
    }
  };

  const toggleSaved = async (candidate: OwnerMatchCandidate) => {
    try {
      await matching.toggleSaved(candidate);
      toast.success(candidate.isSaved ? "Đã bỏ lưu kết quả" : "Đã lưu kết quả");
    } catch (error) {
      showError(error);
    }
  };

  if (matching.isLoading) return <LoadingState />;
  if (matching.error) {
    return (
      <Card variant="bordered">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-bold text-brand-heading">
              Không thể tải kết quả phù hợp
            </h2>
            <p className="mt-1 text-xs text-brand-muted">
              Vui lòng thử lại. Nếu lỗi tiếp diễn, hãy gửi mã yêu cầu cho bộ
              phận hỗ trợ.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => void matching.refetch()}
          >
            <RefreshCw className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Thử lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Summary label="Tổng kết quả" value={matching.total} />
        <Summary
          emphasis
          label="Điểm phù hợp cao nhất"
          value={highestScore ? `${highestScore} điểm` : "—"}
        />
        <Summary
          label="Đã lưu để xem sau"
          value={matching.candidates.filter((item) => item.isSaved).length}
        />
      </div>

      <div>
        <h2 className="text-base font-bold text-brand-heading">
          Kết quả phù hợp tiềm năng
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-brand-muted">
          Điểm chỉ là gợi ý có thể giải thích, không phải bằng chứng sở hữu.
          Thông tin xác minh riêng tư không được dùng để tính điểm.
        </p>
      </div>

      {matching.candidates.length === 0 ? (
        <Card variant="bordered">
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <Sparkles className="h-8 w-8 text-brand-muted" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-brand-heading">
              Chưa có kết quả phù hợp
            </h3>
            <p className="max-w-md text-xs leading-relaxed text-brand-muted">
              Hệ thống sẽ tiếp tục xử lý các báo cáo đủ điều kiện và cập nhật
              danh sách khi có kết quả mới.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {matching.candidates.map((candidate) => (
            <OwnerMatchCandidateCard
              key={candidate.id}
              candidate={candidate}
              disabled={matching.isMutating}
              onDismiss={() => void dismiss(candidate)}
              onOpen={() => setSelected(candidate)}
              onToggleSaved={() => void toggleSaved(candidate)}
            />
          ))}
        </div>
      )}

      <OwnerMatchCandidateDrawer
        candidate={selected}
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </div>
  );
}

function Summary({
  emphasis = false,
  label,
  value,
}: {
  emphasis?: boolean;
  label: string;
  value: number | string;
}) {
  return (
    <Card variant={emphasis ? "highlight" : "bordered"}>
      <CardContent className="py-4 text-center sm:py-5">
        <p className="text-xs font-medium text-brand-muted">{label}</p>
        <p className="mt-1 text-2xl font-extrabold text-brand-heading">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div
      className="space-y-4"
      aria-busy="true"
      aria-label="Đang tải kết quả phù hợp"
    >
      {[0, 1, 2].map((item) => (
        <Card key={item} variant="bordered">
          <CardContent className="h-32 animate-pulse bg-slate-50/60" />
        </Card>
      ))}
    </div>
  );
}

function showError(error: unknown) {
  toast.error(error, { fallback: "Không thể cập nhật kết quả phù hợp." });
}
