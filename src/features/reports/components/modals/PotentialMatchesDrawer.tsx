"use client";

import { Sparkles, MapPin, Calendar, ArrowRight, ShieldAlert } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PotentialMatchesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportTitle: string;
}

const mockMatches = [
  {
    id: "match-1",
    score: 94,
    title: "Ví da nam Pedro gấp đôi màu đen",
    category: "Túi ví / Balo",
    location: "Vincom Center Bà Triệu, Hai Bà Trưng",
    time: "20/05/2024 (14:30)",
    finderName: "Nguyễn Văn H.",
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&q=80",
    description: "Nhặt được ví da màu đen tại sảnh tầng 1 gần The Coffee House, bên trong có giấy tờ và tiền mặt.",
    scoreReasons: ["Trùng khớp địa điểm 98%", "Trùng thời gian trong 2h", "Màu sắc & thương hiệu Pedro"],
  },
  {
    id: "match-2",
    score: 82,
    title: "Ví da đen nam mini",
    category: "Túi ví / Balo",
    location: "Phố Huế, Hai Bà Trưng, Hà Nội",
    time: "20/05/2024 (16:15)",
    finderName: "Trần Thị M.",
    imageUrl: "https://images.unsplash.com/photo-1554415707-9e49fe83083f?w=300&q=80",
    description: "Nhặt được ví gập màu đen gần ngã tư Phố Huế - Đoàn Trần Nghiệp.",
    scoreReasons: ["Cách vị trí báo mất 800m", "Cùng khung giờ chiều 20/05"],
  },
];

export function PotentialMatchesDrawer({
  open,
  onOpenChange,
  reportTitle,
}: PotentialMatchesDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent width="max-w-xl">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-plum" />
            Đồ vật khớp tiềm năng ({mockMatches.length})
          </DrawerTitle>
        </DrawerHeader>

        <DrawerBody>
          <div className="space-y-4">
            <div className="p-3 bg-brand-soft/50 rounded-xl border border-brand-plum/20 text-xs text-brand-heading flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-brand-plum shrink-0 mt-0.5" />
              <p>
                Hệ thống AI đã tự động phân tích thời gian, vị trí và đặc điểm nhận dạng của báo cáo <strong>&ldquo;{reportTitle}&rdquo;</strong> để tìm thấy các kết quả tương đồng cao.
              </p>
            </div>

            <div className="space-y-4">
              {mockMatches.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-brand-border bg-white p-4 shadow-xs hover:border-brand-plum/40 transition-all space-y-3"
                >
                  {/* Top Match Header */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Sparkles className="w-3.5 h-3.5" />
                      Độ khớp {item.score}%
                    </span>
                    <Badge variant="found">Đã nhặt được</Badge>
                  </div>

                  {/* Thumbnail & specs */}
                  <div className="flex gap-3.5 items-start">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-brand-cream shrink-0 border border-brand-border">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1 text-xs">
                      <div className="font-bold text-brand-heading truncate text-sm">{item.title}</div>
                      <div className="flex items-center gap-1 text-brand-muted truncate">
                        <MapPin className="w-3 h-3 text-brand-plum shrink-0" />
                        {item.location}
                      </div>
                      <div className="flex items-center gap-1 text-brand-muted">
                        <Calendar className="w-3 h-3 text-brand-plum shrink-0" />
                        {item.time}
                      </div>
                    </div>
                  </div>

                  {/* Score Explanation */}
                  <div className="bg-brand-cream/50 p-2.5 rounded-xl border border-brand-border/60 text-[11px] space-y-1">
                    <span className="font-bold text-brand-heading block">Căn cứ gợi ý khớp:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.scoreReasons.map((reason, idx) => (
                        <span key={idx} className="bg-white px-2 py-0.5 rounded-md text-brand-muted border border-brand-border/60">
                          ✓ {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-brand-muted line-clamp-2 italic">
                    &ldquo;{item.description}&rdquo;
                  </p>

                  <div className="pt-2 border-t border-brand-border/50 flex justify-end">
                    <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                      Gửi yêu cầu nhận lại đồ
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
