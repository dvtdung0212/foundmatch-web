"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  X,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle2,
  Building2,
  Shield,
  ShieldCheck,
  UserCheck,
  HelpCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { ReportStepper, StepItem } from "./ReportStepper";
import { ReportTipsCard } from "./ReportTipsCard";
import { LocationPickerModal } from "../modals/LocationPickerModal";
import { HoldingPointDrawer, HoldingPointBranch } from "../modals/HoldingPointDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const foundSteps: StepItem[] = [
  { id: 1, title: "Thông tin vật phẩm", description: "Mô tả chi tiết vật phẩm" },
  { id: 2, title: "Tình trạng & vị trí", description: "Nơi và thời gian nhặt được" },
  { id: 3, title: "Lưu giữ & quyền riêng tư", description: "Cách lưu giữ & chia sẻ" },
  { id: 4, title: "Xác nhận", description: "Kiểm tra và gửi báo cáo" },
];

const categoryOptions = [
  { label: "Túi ví / Balo / Cặp xách", value: "Túi ví / Balo" },
  { label: "Điện thoại / Tablet", value: "Điện thoại / Tablet" },
  { label: "Laptop / Thiết bị công nghệ", value: "Thiết bị công nghệ" },
  { label: "Ví tiền / Giấy tờ tùy thân", value: "Giấy tờ tùy thân" },
  { label: "Chìa khóa / Móc khóa", value: "Chìa khóa" },
  { label: "Trang sức / Đồng hồ", value: "Trang sức / Đồng hồ" },
  { label: "Quần áo / Phụ kiện thời trang", value: "Phụ kiện thời trang" },
  { label: "Thú cưng", value: "Thú cưng" },
  { label: "Khác", value: "Khác" },
];

const conditionOptions = [
  { label: "Còn mới, nguyên vẹn", value: "Còn mới nguyên vẹn" },
  { label: "Có trầy xước nhẹ", value: "Trầy xước nhẹ" },
  { label: "Đã qua sử dụng nhiều", value: "Đã qua sử dụng" },
  { label: "Bị hỏng hóc / vỡ màn hình", value: "Bị hỏng" },
];

const colorOptions = [
  { label: "Đen", value: "Đen" },
  { label: "Nâu / Be", value: "Nâu" },
  { label: "Xanh dương / Navy", value: "Xanh dương" },
  { label: "Đỏ / Mận", value: "Đỏ" },
  { label: "Trắng / Bạc", value: "Trắng" },
  { label: "Xám / Ghi", value: "Xám" },
  { label: "Vàng / Gold", value: "Vàng" },
  { label: "Nhiều màu / Họa tiết", value: "Nhiều màu" },
];

const timeSlotOptions = [
  { label: "06:00 - 09:00 (Sáng sớm)", value: "06:00 - 09:00" },
  { label: "09:00 - 12:00 (Buổi sáng)", value: "09:00 - 12:00" },
  { label: "12:00 - 14:00 (Buổi trưa)", value: "12:00 - 14:00" },
  { label: "14:00 - 16:00 (Đầu giờ chiều)", value: "14:00 - 16:00" },
  { label: "16:00 - 18:00 (Cuối giờ chiều)", value: "16:00 - 18:00" },
  { label: "18:00 - 21:00 (Buổi tối)", value: "18:00 - 21:00" },
  { label: "21:00 - 00:00 (Đêm muộn)", value: "21:00 - 00:00" },
  { label: "Không nhớ chính xác", value: "Không rõ" },
];

export function FoundReportWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isHoldingPointDrawerOpen, setIsHoldingPointDrawerOpen] = useState(false);
  const [saveDraftMessage, setSaveDraftMessage] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "Ví da nam màu đen, nhặt được tại TTTM",
    category: "Túi ví / Balo",
    condition: "Còn mới nguyên vẹn",
    color: "Đen",
    description: "Nhặt được ví da màu đen tại sảnh tầng 1 cạnh The Coffee House. Bên trong có thẻ và một số đồ cá nhân.",
    
    // Time & Location
    date: "2024-05-20",
    timeSlot: "14:00 - 16:00",
    locationName: "Vincom Center Bà Triệu",
    locationArea: "Hai Bà Trưng, Hà Nội",
    
    // Media
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80",
    ],
    
    // Custody & Privacy
    custodyType: "self_hold" as "self_hold" | "holding_point",
    holdingPointName: "FoundMatch Hub Quận 1",
    holdingPointAddress: "45 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM",
    privacySetting: "partial" as "partial" | "minimal" | "full",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Vui lòng nhập tên vật phẩm";
      if (!formData.category) newErrors.category = "Vui lòng chọn danh mục";
      if (!formData.color) newErrors.color = "Vui lòng chọn màu sắc";
      if (!formData.condition) newErrors.condition = "Vui lòng chọn tình trạng";
      if (!formData.description.trim()) newErrors.description = "Vui lòng nhập mô tả ngắn";
    }
    if (step === 2) {
      if (!formData.date) newErrors.date = "Vui lòng chọn ngày nhặt được";
      if (!formData.timeSlot) newErrors.timeSlot = "Vui lòng chọn khung thời gian";
      if (!formData.locationName.trim()) newErrors.locationName = "Vui lòng chọn địa điểm nhặt được";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push(`/reports/create/success?code=FM240520-9F2H1&type=found&title=${encodeURIComponent(formData.title)}`);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAddSampleImage = () => {
    if (formData.images.length < 5) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, "https://images.unsplash.com/photo-1554415707-9e49fe83083f?w=400&q=80"],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSelectHoldingPoint = (branch: HoldingPointBranch) => {
    setFormData((prev) => ({
      ...prev,
      custodyType: "holding_point",
      holdingPointName: branch.name,
      holdingPointAddress: branch.address,
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-6 px-4 sm:px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-semibold text-brand-muted">
        <Link href="/" className="hover:text-brand-plum transition-colors">
          Trang chủ
        </Link>
        <span>›</span>
        <Link href="/reports/create" className="hover:text-brand-plum transition-colors">
          Báo cáo
        </Link>
        <span>›</span>
        <span className="text-brand-found font-bold">Tạo báo cáo nhặt được đồ</span>
      </nav>

      {/* Header */}
      <div className="space-y-2 text-left">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-heading tracking-tight">
            Tạo báo cáo nhặt được đồ
          </h1>
          <Badge variant="found" className="text-xs px-3 py-1">Báo cáo nhặt được</Badge>
        </div>
        <p className="text-sm sm:text-base text-brand-muted">
          Cung cấp thông tin chi tiết để kết nối với chủ nhân một cách an toàn và minh bạch.
        </p>
      </div>

      {/* Stepper Navigation */}
      <ReportStepper
        steps={foundSteps}
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
        variant="found"
      />

      {/* Main Grid: Form on left, Summary/Tips on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form Area (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: THÔNG TIN VẬT PHẨM */}
          {currentStep === 1 && (
            <Card className="border-brand-border shadow-xs">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="border-b border-brand-border/60 pb-4 text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-brand-heading">
                    Bước 1: Mô tả chi tiết vật phẩm bạn đã nhặt được
                  </h3>
                  <p className="text-sm text-brand-muted mt-0.5">
                    Lưu ý: Không công khai các thông tin độc quyền (như họ tên trên CCCD, tiền mặt bên trong) để làm câu hỏi xác minh.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-brand-heading mb-1.5 text-left">
                        Tên vật phẩm <span className="text-brand-lost">*</span>
                      </label>
                      <Input
                        placeholder="Ví dụ: Ví da nam màu đen, Tai nghe AirPods Case..."
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className={`h-11 text-sm font-medium ${errors.title ? "border-brand-lost" : ""}`}
                      />
                      {errors.title && <p className="text-xs text-brand-lost font-medium mt-1 text-left">{errors.title}</p>}
                    </div>

                    <Select
                      label="Danh mục vật phẩm"
                      required
                      options={categoryOptions}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      error={errors.category}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Select
                      label="Màu sắc chủ đạo"
                      required
                      options={colorOptions}
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      error={errors.color}
                    />
                    <Select
                      label="Tình trạng vật phẩm"
                      required
                      options={conditionOptions}
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      error={errors.condition}
                    />
                  </div>

                  <Textarea
                    label="Mô tả ngắn về vật phẩm"
                    required
                    hint={`${formData.description.length}/500`}
                    rows={4}
                    placeholder="Mô tả các đặc điểm chung: thương hiệu, màu sắc, ký hiệu bên ngoài..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    error={errors.description}
                    className="text-sm"
                  />

                  {/* Images */}
                  <div className="space-y-2 text-left pt-2">
                    <label className="block text-sm font-bold text-brand-heading">
                      Hình ảnh chụp vật phẩm (Khuyên dùng chụp rõ góc cạnh)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button
                        type="button"
                        onClick={handleAddSampleImage}
                        className="h-28 rounded-2xl border-2 border-dashed border-brand-border bg-brand-cream/40 hover:bg-brand-cream hover:border-brand-found/40 transition-all flex flex-col items-center justify-center p-3 text-center gap-1.5 group cursor-pointer"
                      >
                        <UploadCloud className="w-6 h-6 text-brand-found group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-brand-heading">Tải ảnh lên</span>
                        <span className="text-[10px] text-brand-muted">JPG, PNG, WEBP</span>
                      </button>

                      {formData.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative h-28 rounded-2xl overflow-hidden border border-brand-border group">
                          <img src={imgUrl} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-brand-dark/80 text-white flex items-center justify-center hover:bg-brand-lost transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: TÌNH TRẠNG & VỊ TRÍ */}
          {currentStep === 2 && (
            <Card className="border-brand-border shadow-xs">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="border-b border-brand-border/60 pb-4 text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-brand-heading">
                    Bước 2: Thời gian và nơi bạn nhặt được
                  </h3>
                  <p className="text-sm text-brand-muted mt-0.5">
                    Thông tin địa điểm giúp hệ thống liên kết chính xác với người bị mất ở cùng khu vực.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <DatePicker
                      label="Ngày nhặt được"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      error={errors.date}
                    />
                    <Select
                      label="Khung giờ nhặt được"
                      required
                      options={timeSlotOptions}
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      error={errors.timeSlot}
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-brand-heading">
                        Địa điểm nhặt được <span className="text-brand-lost">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsLocationModalOpen(true)}
                        className="text-sm font-bold text-brand-found hover:underline flex items-center gap-1"
                      >
                        <MapPin className="w-4 h-4" />
                        Ghim vị trí trên bản đồ
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <MapPin className="w-4 h-4 text-brand-found absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <Input
                          placeholder="Ví dụ: Vincom Center Bà Triệu, Tầng 1 sảnh chính..."
                          value={formData.locationName}
                          onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                          className="pl-10 h-11 text-sm font-medium"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsLocationModalOpen(true)}
                        className="shrink-0 text-sm gap-1.5 font-bold"
                      >
                        <MapPin className="w-4 h-4" />
                        Bản đồ
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: LƯU GIỮ & QUYỀN RIÊNG TƯ */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Custody Method Card */}
              <Card className="border-brand-border text-left shadow-xs">
                <CardContent className="p-6 sm:p-8 space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-brand-heading">
                      Bạn đang lưu giữ vật phẩm như thế nào?
                    </h3>
                    <p className="text-sm text-brand-muted mt-0.5">
                      Chọn cách bạn sẽ giữ vật phẩm cho đến khi tìm được chủ nhân thực sự.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Self Hold Option */}
                    <div
                      onClick={() => setFormData({ ...formData, custodyType: "self_hold" })}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        formData.custodyType === "self_hold"
                          ? "border-brand-found bg-brand-foundBg/40 shadow-xs"
                          : "border-brand-border bg-white hover:bg-brand-cream/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-foundBg text-brand-found flex items-center justify-center shrink-0">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-sm sm:text-base text-brand-heading block font-bold">Tự lưu giữ</strong>
                          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mt-0.5">
                            Tôi sẽ tự giữ gìn vật phẩm an toàn và trực tiếp bàn giao khi xác minh đúng chủ sở hữu.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-found">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.custodyType === "self_hold" ? "border-brand-found bg-brand-found text-white" : "border-brand-border"}`}>
                          {formData.custodyType === "self_hold" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span>Đang chọn tự giữ</span>
                      </div>
                    </div>

                    {/* Holding Point Option */}
                    <div
                      onClick={() => {
                        setFormData({ ...formData, custodyType: "holding_point" });
                        setIsHoldingPointDrawerOpen(true);
                      }}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        formData.custodyType === "holding_point"
                          ? "border-brand-plum bg-brand-soft/40 shadow-xs"
                          : "border-brand-border bg-white hover:bg-brand-cream/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-soft text-brand-plum flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-sm sm:text-base text-brand-heading block font-bold">Gửi vào trạm Holding Point</strong>
                          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mt-0.5">
                            Tôi muốn gửi vật phẩm đến trạm tiếp nhận đối tác của FoundMatch để lưu kho an toàn.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-brand-border/40">
                        <span className="text-xs font-bold text-brand-plum truncate">
                          {formData.custodyType === "holding_point" ? formData.holdingPointName : "Chọn trạm gần nhất"}
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsHoldingPointDrawerOpen(true);
                          }}
                          className="text-xs h-8 px-3"
                        >
                          Thay đổi
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Setting Card */}
              <Card className="border-brand-border text-left shadow-xs">
                <CardContent className="p-6 sm:p-8 space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-brand-heading">
                      Cài đặt mức độ công khai bài đăng
                    </h3>
                    <p className="text-sm text-brand-muted mt-0.5">
                      Chọn lượng thông tin hiển thị trên bảng tin công khai.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {[
                      {
                        value: "partial",
                        title: "Công khai một phần (Khuyến nghị)",
                        desc: "Hiển thị danh mục, màu sắc, khung giờ và khu vực tổng quan. Ẩn đặc điểm nhạy cảm.",
                      },
                      {
                        value: "minimal",
                        title: "Công khai tối thiểu",
                        desc: "Chỉ hiển thị danh mục và màu sắc. Chỉ người mất chủ động tra cứu mới tìm thấy.",
                      },
                      {
                        value: "full",
                        title: "Công khai đầy đủ",
                        desc: "Hiển thị toàn bộ nội dung mô tả bạn đã nhập.",
                      },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        onClick={() => setFormData({ ...formData, privacySetting: opt.value as any })}
                        className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                          formData.privacySetting === opt.value
                            ? "border-brand-found bg-brand-foundBg/40 text-brand-heading"
                            : "border-brand-border bg-white text-brand-muted hover:bg-brand-cream/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="privacySetting"
                          checked={formData.privacySetting === opt.value}
                          onChange={() => {}}
                          className="mt-1 accent-brand-found"
                        />
                        <div>
                          <strong className="text-sm text-brand-heading block font-bold">{opt.title}</strong>
                          <p className="text-xs text-brand-muted mt-0.5">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* STEP 4: XÁC NHẬN & REVIEW */}
          {currentStep === 4 && (
            <Card className="border-brand-border shadow-xs">
              <CardContent className="p-6 sm:p-8 space-y-6 text-left">
                <div className="border-b border-brand-border/60 pb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-brand-heading">
                    Bước 4: Kiểm tra lại thông tin báo cáo
                  </h3>
                  <p className="text-sm text-brand-muted mt-0.5">
                    Cảm ơn sự đóng góp của bạn! Hãy rà soát lại thông tin trước khi hoàn tất gửi.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-brand-foundBg/30 border border-brand-found/30 space-y-4">
                  <div className="flex gap-4 items-start">
                    {formData.images[0] && (
                      <div className="w-28 h-28 rounded-xl overflow-hidden bg-white shrink-0 border border-brand-border">
                        <img src={formData.images[0]} alt={formData.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 space-y-1.5 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="found">Báo cáo nhặt được</Badge>
                        <span className="font-bold text-base text-brand-heading truncate">{formData.title}</span>
                      </div>
                      <p className="text-brand-muted">Danh mục: <strong className="text-brand-heading">{formData.category}</strong> • Tình trạng: <strong className="text-brand-heading">{formData.condition}</strong></p>
                      <p className="text-brand-muted flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-brand-found shrink-0" />
                        {formData.locationName} ({formData.locationArea})
                      </p>
                      <p className="text-brand-muted flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-brand-found shrink-0" />
                        {formData.date} ({formData.timeSlot})
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-brand-border/60 text-sm text-brand-muted space-y-1">
                    <strong className="text-brand-heading block">Phương thức lưu giữ:</strong> {formData.custodyType === "self_hold" ? "Tự lưu giữ" : `Gửi trạm ${formData.holdingPointName}`}
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="p-4 bg-brand-foundBg/40 rounded-xl border border-brand-found/30 text-xs sm:text-sm text-brand-heading flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-found shrink-0 mt-0.5" />
                  <span>
                    Tôi cam kết thông tin nhặt được là sự thật và sẵn sàng phối hợp trao trả cho đúng chủ sở hữu.
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {currentStep > 1 && (
                <Button variant="secondary" type="button" onClick={handleBack} className="gap-1.5 font-bold text-sm">
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </Button>
              )}
              <Button
                variant="outline"
                type="button"
                className="gap-1.5 text-sm font-semibold text-brand-muted border-brand-border hover:bg-brand-cream"
              >
                <Save className="w-4 h-4" />
                Lưu nháp
              </Button>
            </div>

            <Button
              variant="primary"
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto gap-2 bg-brand-found hover:bg-[#2F6733] px-8 h-12 font-bold text-sm sm:text-base shadow-xs"
            >
              {currentStep === 4 ? (
                <>
                  Gửi báo cáo nhặt được
                  <CheckCircle2 className="w-5 h-5" />
                </>
              ) : (
                <>
                  Tiếp tục
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Sidebar Area: Privacy Summary & Tips */}
        <div className="space-y-6">
          {/* Privacy Preview Card */}
          <Card className="border-brand-border text-left">
            <CardContent className="p-5 space-y-3 text-xs">
              <div className="font-bold text-brand-heading flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-found" />
                Tóm tắt thông tin công khai
              </div>
              <div className="space-y-2 pt-1 border-t border-brand-border/60 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-brand-muted">Tên vật phẩm:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Sẽ công khai
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-muted">Danh mục:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Sẽ công khai
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-muted">Màu sắc:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Sẽ công khai
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-muted">Thời gian nhặt được:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Sẽ công khai
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-muted">Địa điểm nhặt:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Sẽ công khai
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-muted">Chi tiết bên trong:</span>
                  <span className="text-brand-plum font-semibold flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> Ẩn bảo mật
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <ReportTipsCard step={currentStep} type="found" />
        </div>
      </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        open={isLocationModalOpen}
        onOpenChange={setIsLocationModalOpen}
        initialLocation={formData.locationName}
        onSelectLocation={(loc, area) => {
          setFormData((prev) => ({
            ...prev,
            locationName: loc,
            locationArea: area,
          }));
        }}
      />

      {/* Holding Point Drawer */}
      <HoldingPointDrawer
        open={isHoldingPointDrawerOpen}
        onOpenChange={setIsHoldingPointDrawerOpen}
        onSelectBranch={handleSelectHoldingPoint}
      />
    </div>
  );
}
