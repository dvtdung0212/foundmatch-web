"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Sparkles,
  Tag,
  ThumbsDown,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OwnerReportView } from "../../../api/owner-report-view";

interface MatchCandidateItem {
  id: string;
  code: string;
  title: string;
  typeText: string;
  score: number;
  scoreLabel: string;
  scoreVariant: "high" | "good" | "moderate";
  imageUrl: string;
  description: string;
  matchingTags: string[];
  time: string;
  location: string;
  status: "PENDING" | "DISMISSED";
}

interface MatchCandidatesTabProps {
  report: OwnerReportView;
}

const INITIAL_CANDIDATES: MatchCandidateItem[] = [
  {
    id: "cand-1",
    code: "FMF-2024-0897",
    title: "Ví da màu đen",
    typeText: "Báo cáo nhặt được",
    score: 92,
    scoreLabel: "Rất cao",
    scoreVariant: "high",
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400",
    description: "Mô tả: Ví da đen dáng ngang, nhiều ngăn thẻ và 2 ngăn lớn.",
    matchingTags: ["Màu sắc", "Dáng ví", "Logo", "Số ngăn thẻ", "Chất liệu"],
    time: "18/05/2024 (Thứ bảy) 14:00 - 15:30",
    location: "Phố đi bộ Nguyễn Huệ, Quận 1, TP. HCM",
    status: "PENDING",
  },
  {
    id: "cand-2",
    code: "FMF-2024-0771",
    title: "Ví da đen",
    typeText: "Báo cáo nhặt được",
    score: 87,
    scoreLabel: "Cao",
    scoreVariant: "high",
    imageUrl: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&q=80&w=400",
    description: "Mô tả: Ví da màu đen, có logo dập chìm, nhiều ngăn.",
    matchingTags: ["Màu sắc", "Dáng ví", "Logo", "Số ngăn thẻ"],
    time: "17/05/2024 (Thứ sáu) 09:20 - 10:00",
    location: "Vincom Center Đồng Khởi, Quận 1, TP. HCM",
    status: "PENDING",
  },
  {
    id: "cand-3",
    code: "FMF-2024-0642",
    title: "Ví nam màu đen",
    typeText: "Báo cáo nhặt được",
    score: 81,
    scoreLabel: "Khá cao",
    scoreVariant: "good",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400",
    description: "Mô tả: Ví nam màu đen, có nhiều ngăn, khóa kéo bên trong.",
    matchingTags: ["Màu sắc", "Dáng ví", "Chất liệu"],
    time: "16/05/2024 (Thứ năm) 16:45 - 17:30",
    location: "Công viên Tao Đàn, Quận 1, TP. HCM",
    status: "PENDING",
  },
  {
    id: "cand-4",
    code: "FMF-2024-0598",
    title: "Ví da",
    typeText: "Báo cáo nhặt được",
    score: 78,
    scoreLabel: "Khá",
    scoreVariant: "moderate",
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400",
    description: "Mô tả: Ví da đen, nhiều ngăn thẻ, 2 ngăn lớn.",
    matchingTags: ["Màu sắc", "Số ngăn thẻ"],
    time: "15/05/2024 (Thứ tư) 11:00 - 11:30",
    location: "Chợ Bến Thành, Quận 1, TP. HCM",
    status: "PENDING",
  },
];

export function MatchCandidatesTab({ report }: MatchCandidatesTabProps) {
  const [candidates, setCandidates] = useState<MatchCandidateItem[]>(INITIAL_CANDIDATES);

  const activeCandidates = candidates.filter((c) => c.status === "PENDING");
  const maxScore = candidates.length > 0 ? Math.max(...candidates.map((c) => c.score)) : 0;

  const handleDismiss = (id: string, title: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "DISMISSED" } : c))
    );
    toast.success(`Đã ẩn kết quả "${title}"`, {
      action: {
        label: "Hoàn tác",
        onClick: () => {
          setCandidates((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: "PENDING" } : c))
          );
        },
      },
    });
  };

  const handleViewDetail = (candidate: MatchCandidateItem) => {
    toast.info(`Đang mở chi tiết đối chiếu cho ${candidate.code}...`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-brand-border/80 bg-white p-4 sm:p-5 text-center shadow-2xs space-y-1">
          <span className="text-xs font-medium text-brand-muted">Tổng số kết quả</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-heading">
            {candidates.length}
          </p>
        </div>

        <div className="rounded-2xl border border-brand-plum/20 bg-brand-soft/30 p-4 sm:p-5 text-center shadow-2xs space-y-1">
          <span className="text-xs font-bold text-brand-plum">Điểm khớp cao nhất</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-plum">
            {maxScore}%
          </p>
        </div>

        <div className="rounded-2xl border border-brand-border/80 bg-white p-4 sm:p-5 text-center shadow-2xs space-y-1">
          <span className="text-xs font-medium text-brand-muted">Đang chờ bạn xem xét</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {activeCandidates.length}
          </p>
        </div>
      </div>

      {/* Matching Candidates Section Header */}
      <div className="space-y-1">
        <h2 className="text-base font-bold text-brand-heading">
          Kết quả khớp tiềm năng
        </h2>
        <p className="text-xs text-brand-muted">
          Các kết quả được hệ thống gợi ý dựa trên thông tin khớp. Vui lòng xem chi tiết và lựa chọn kết quả phù hợp.
        </p>
      </div>

      {/* Candidate List Cards */}
      <div className="space-y-4">
        {activeCandidates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-border bg-white p-12 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-brand-muted mx-auto" />
            <p className="text-sm font-semibold text-brand-heading">Không còn kết quả khớp nào chờ xem xét</p>
            <p className="text-xs text-brand-muted">Hệ thống sẽ liên tục quét các báo cáo mới và thông báo khi tìm thấy đồ vật tương đồng.</p>
          </div>
        ) : (
          activeCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="rounded-2xl border border-brand-border/80 bg-white p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
            >
              {/* Left group: Score Box + Thumbnail + Specs + Matching Tags */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
                {/* Match Score Badge */}
                <div
                  className={`w-20 sm:w-24 h-20 rounded-xl flex flex-col items-center justify-center shrink-0 border ${
                    candidate.score >= 85
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : candidate.score >= 80
                      ? "bg-teal-50 text-teal-800 border-teal-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  <span className="text-xl sm:text-2xl font-black leading-none">
                    {candidate.score}%
                  </span>
                  <span className="text-[11px] font-bold mt-1">
                    {candidate.scoreLabel}
                  </span>
                </div>

                {/* Item Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-brand-border/60 shrink-0">
                  <img
                    src={candidate.imageUrl}
                    alt={candidate.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info & Tags */}
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-sm text-brand-heading">
                      {candidate.title}
                    </h3>
                    <span className="text-xs font-mono text-brand-muted">•</span>
                    <span className="text-xs font-mono text-brand-plum font-semibold">
                      {candidate.code}
                    </span>
                    <span className="text-xs font-mono text-brand-muted">•</span>
                    <span className="text-xs text-brand-muted">
                      {candidate.typeText}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1">
                    {candidate.description}
                  </p>

                  {/* Matching Traits Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[11px] font-semibold text-slate-500 mr-1">
                      Thông tin khớp:
                    </span>
                    {candidate.matchingTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50/80 border border-emerald-200/80 px-2 py-0.5 rounded-md"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Time & Location */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-muted" />
                      {candidate.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-plum" />
                      {candidate.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right group: Actions */}
              <div className="flex sm:flex-col items-center sm:items-stretch gap-2 w-full lg:w-48 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-brand-border/40">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewDetail(candidate)}
                  className="flex-1 sm:flex-none justify-center gap-1 text-xs font-bold bg-brand-plum hover:bg-brand-plumDark text-white shadow-xs"
                >
                  <span>Xem chi tiết kết quả</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDismiss(candidate.id, candidate.title)}
                  className="flex-1 sm:flex-none justify-center gap-1 text-xs font-medium bg-white hover:bg-slate-50 text-slate-600 border-brand-border"
                >
                  <span>Không phù hợp</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
