"use client";

import { useState } from "react";
import { MapPin, Search, Shield, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LocationPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialLocation?: string;
  onSelectLocation: (location: string, area: string) => void;
}

export function LocationPickerModal({
  open,
  onOpenChange,
  initialLocation = "",
  onSelectLocation,
}: LocationPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState(initialLocation);
  const [selectedPlace, setSelectedPlace] = useState({
    name: initialLocation || "Vincom Center Bà Triệu",
    address: "191 Bà Triệu, Phường Lê Đại Hành, Quận Hai Bà Trưng, Hà Nội",
    area: "Hai Bà Trưng, Hà Nội",
  });

  const popularLocations = [
    {
      name: "Vincom Center Bà Triệu",
      address: "191 Bà Triệu, Phường Lê Đại Hành, Quận Hai Bà Trưng, Hà Nội",
      area: "Hai Bà Trưng, Hà Nội",
    },
    {
      name: "Chợ Bến Thành",
      address: "Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
      area: "Quận 1, TP.HCM",
    },
    {
      name: "Sân bay Quốc tế Nội Bài",
      address: "Xã Phú Minh, Huyện Sóc Sơn, Hà Nội",
      area: "Sóc Sơn, Hà Nội",
    },
    {
      name: "Trường Đại học Bách Khoa TP.HCM",
      address: "268 Lý Thường Kiệt, Phường 14, Quận 10, TP. Hồ Chí Minh",
      area: "Quận 10, TP.HCM",
    },
  ];

  const handleConfirm = () => {
    onSelectLocation(selectedPlace.name, selectedPlace.area);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-2xl" className="p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-plum" />
            Chọn vị trí trên bản đồ
          </DialogTitle>
          <DialogDescription>
            Ghim vị trí gần đúng nơi xảy ra sự việc để bảo vệ thông tin cá nhân.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Input
              placeholder="Nhập tên địa điểm, tòa nhà, tuyến đường..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Interactive Map Mockup */}
          <div className="relative w-full h-64 rounded-2xl bg-brand-cream/60 border border-brand-border overflow-hidden flex items-center justify-center group">
            {/* Map Grid Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#5B0E2D_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Simulated Map Illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Privacy Radius Circle */}
              <div className="w-36 h-36 rounded-full bg-brand-plum/10 border-2 border-brand-plum/30 animate-pulse flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-brand-plum/20 border border-brand-plum/40 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-brand-plum text-white flex items-center justify-center shadow-lg transform -translate-y-2 transition-transform group-hover:scale-110">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Floating Badge */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-brand-border text-xs font-semibold text-brand-heading flex items-center gap-1.5 shadow-xs">
              <Shield className="w-3.5 h-3.5 text-brand-found" />
              Bán kính bảo vệ tọa độ: ~200m
            </div>

            {/* Location Tag Bottom */}
            <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-brand-border shadow-md flex items-center justify-between">
              <div className="min-w-0 pr-3">
                <div className="text-xs font-bold text-brand-heading truncate">{selectedPlace.name}</div>
                <div className="text-[11px] text-brand-muted truncate">{selectedPlace.address}</div>
              </div>
              <span className="text-[11px] font-semibold text-brand-plum bg-brand-soft px-2.5 py-1 rounded-md shrink-0">
                Đã ghim
              </span>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div>
            <div className="text-xs font-bold text-brand-muted mb-2">Gợi ý địa điểm phổ biến:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {popularLocations.map((loc) => (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => {
                    setSelectedPlace(loc);
                    setSearchTerm(loc.name);
                  }}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                    selectedPlace.name === loc.name
                      ? "border-brand-plum bg-brand-soft/40 text-brand-heading font-semibold"
                      : "border-brand-border hover:bg-brand-cream/50 text-brand-muted"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{loc.name}</div>
                    <div className="text-[11px] opacity-75 truncate">{loc.area}</div>
                  </div>
                  {selectedPlace.name === loc.name && (
                    <Check className="w-4 h-4 text-brand-plum shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 border-t border-brand-border/60 bg-brand-cream/20">
          <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="primary" type="button" onClick={handleConfirm}>
            Xác nhận vị trí này
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
