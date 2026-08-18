"use client";

import { useState } from "react";
import { Building2, MapPin, Clock, Phone, Search, Check, ShieldCheck } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface HoldingPointBranch {
  id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  distance: string;
  hours: string;
  phone: string;
  verified: boolean;
}

interface HoldingPointDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBranchId?: string;
  onSelectBranch: (branch: HoldingPointBranch) => void;
}

const mockHoldingPoints: HoldingPointBranch[] = [
  {
    id: "hp-1",
    name: "FoundMatch Hub Quận 1",
    address: "45 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM",
    district: "Quận 1",
    city: "TP.HCM",
    distance: "0.8 km",
    hours: "08:00 - 21:00 (Hàng ngày)",
    phone: "1900 6868",
    verified: true,
  },
  {
    id: "hp-2",
    name: "Điểm tiếp nhận Bưu cục Hai Bà Trưng",
    address: "128 Phố Huế, Quận Hai Bà Trưng, Hà Nội",
    district: "Hai Bà Trưng",
    city: "Hà Nội",
    distance: "1.2 km",
    hours: "07:30 - 20:00 (T2 - T7)",
    phone: "024 3822 9999",
    verified: true,
  },
  {
    id: "hp-3",
    name: "FoundMatch Hub Cầu Giấy",
    address: "241 Xuân Thủy, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội",
    district: "Cầu Giấy",
    city: "Hà Nội",
    distance: "3.5 km",
    hours: "08:00 - 20:30 (Hàng ngày)",
    phone: "024 3754 8888",
    verified: true,
  },
  {
    id: "hp-4",
    name: "Điểm lưu giữ Ga Sài Gòn",
    address: "01 Nguyễn Thông, Phường 9, Quận 3, TP.HCM",
    district: "Quận 3",
    city: "TP.HCM",
    distance: "2.1 km",
    hours: "24/7 (Quầy thông tin ga)",
    phone: "028 3843 6528",
    verified: true,
  },
];

export function HoldingPointDrawer({
  open,
  onOpenChange,
  selectedBranchId = "hp-1",
  onSelectBranch,
}: HoldingPointDrawerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(selectedBranchId);

  const filteredPoints = mockHoldingPoints.filter(
    (hp) =>
      hp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hp.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hp.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentSelected = mockHoldingPoints.find((hp) => hp.id === selectedId);

  const handleConfirm = () => {
    if (currentSelected) {
      onSelectBranch(currentSelected);
    }
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent width="max-w-lg">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-plum" />
            Chọn điểm lưu giữ (Holding Point)
          </DrawerTitle>
        </DrawerHeader>

        <DrawerBody>
          <div className="space-y-4">
            <p className="text-xs text-brand-muted leading-relaxed">
              Bạn có thể mang vật phẩm nhặt được đến trạm lưu giữ an toàn của FoundMatch hoặc các đối tác ủy quyền để lưu kho bảo vệ.
            </p>

            {/* Search Input */}
            <div className="relative">
              <Input
                placeholder="Tìm trạm theo quận, đường, tên hub..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* List Branches */}
            <div className="space-y-3 pt-1">
              {filteredPoints.map((branch) => {
                const isSelected = selectedId === branch.id;
                return (
                  <div
                    key={branch.id}
                    onClick={() => setSelectedId(branch.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? "border-brand-plum bg-brand-soft/30 shadow-xs ring-1 ring-brand-plum/30"
                        : "border-brand-border bg-white hover:bg-brand-cream/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-brand-heading">{branch.name}</span>
                        {branch.verified && (
                          <Badge variant="found" className="text-[10px] py-0 px-2">
                            <ShieldCheck className="w-3 h-3 mr-0.5" />
                            Đã xác minh
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs font-bold text-brand-plum bg-brand-soft px-2 py-0.5 rounded-full shrink-0">
                        {branch.distance}
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5 text-xs text-brand-muted">
                      <MapPin className="w-3.5 h-3.5 text-brand-plum shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-muted pt-1 border-t border-brand-border/40">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {branch.hours}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {branch.phone}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="primary" type="button" onClick={handleConfirm} className="gap-1.5">
            <Check className="w-4 h-4" />
            Chọn trạm này
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
