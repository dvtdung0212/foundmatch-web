"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  X,
  Plus,
  MapPin,
  Calendar,
  Clock,
  Lock,
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
} from "lucide-react";
import { ReportStepper, StepItem } from "./ReportStepper";
import { ReportTipsCard } from "./ReportTipsCard";
import { LocationPickerModal } from "../modals/LocationPickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const lostSteps: StepItem[] = [
  { id: 1, title: "Thông tin đồ vật", description: "Mô tả chi tiết món đồ" },
  { id: 2, title: "Thời gian & địa điểm", description: "Khi nào và ở đâu bị mất" },
  { id: 3, title: "Bảo mật & xác minh", description: "Minh chứng và đối chiếu" },
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

export function LostReportWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [saveDraftMessage, setSaveDraftMessage] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "Ví da nam màu đen",
    category: "Túi ví / Balo",
    brand: "Pedro",
    material: "Da thật",
    color: "Đen",
    size: "11 x 8 x 2 cm (gập)",
    style: "Ví gập đôi ngang",
    genderTarget: "Nam",
    description: "Ví da nam màu đen, kiểu gập đôi. Bên trong có nhiều ngăn thẻ và ngăn đựng tiền. Góc phải mặt ngoài có logo Pedro dập chìm.",
    
    // Time & Location
    date: "2024-05-20",
    timeSlot: "14:00 - 16:00",
    locationName: "Vincom Center Bà Triệu",
    locationArea: "Hai Bà Trưng, Hà Nội",
    locationDetail: "Khu vực sảnh tầng 1, gần cửa ra vào số 3, cạnh cửa hàng The Coffee House.",
    
    // Media
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80",
      "https://images.unsplash.com/photo-1554415707-9e49fe83083f?w=400&q=80",
    ],
    
    // Security & Verification
    distinctiveFeatures: "Một trong ngăn cái có in tên viết tắt 'M.D' màu bạc. Đường chỉ may màu đen.",
    secretVerificationAnswers: "Bên trong ngăn khóa kéo bí mật có 1 đồng xu kỷ niệm và 1 thẻ sinh viên trường Bách Khoa.",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-save draft
  const handleSaveDraft = () => {
    try {
      localStorage.setItem("foundmatch_lost_draft", JSON.stringify(formData));
      setSaveDraftMessage("Đã lưu bản nháp thành công!");
      setTimeout(() => setSaveDraftMessage(""), 3000);
    } catch {
      // fallback
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Vui lòng nhập tên đồ vật";
      if (!formData.category) newErrors.category = "Vui lòng chọn danh mục";
      if (!formData.color) newErrors.color = "Vui lòng chọn màu sắc";
      if (!formData.description.trim()) newErrors.description = "Vui lòng nhập mô tả chi tiết";
    }
    if (step === 2) {
      if (!formData.date) newErrors.date = "Vui lòng chọn ngày bị mất";
      if (!formData.timeSlot) newErrors.timeSlot = "Vui lòng chọn khung thời gian";
      if (!formData.locationName.trim()) newErrors.locationName = "Vui lòng chọn hoặc nhập địa điểm bị mất";
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
        // Submit
        router.push(`/reports/create/success?code=FM240520-8X7K2&type=lost&title=${encodeURIComponent(formData.title)}`);
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
        images: [...prev.images, "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80"],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
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
        <span className="text-brand-plum">Tạo báo cáo mất đồ</span>
      </nav>

      {/* Header */}
      <div className="space-y-2 text-left">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-heading tracking-tight">
            Tạo báo cáo mất đồ
          </h1>
          <Badge variant="lost" className="text-xs px-3 py-1">Báo cáo mất</Badge>
        </div>
        <p className="text-sm sm:text-base text-brand-muted">
          Cung cấp thông tin chi tiết để tăng cơ hội tìm lại đồ thất lạc nhanh chóng và an toàn.
        </p>
      </div>

      {/* Stepper Navigation */}
      <ReportStepper
        steps={lostSteps}
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
        variant="lost"
      />

      {/* Main Grid: Form on left, Tips on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form Area (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: THÔNG TIN ĐỒ VẬT */}
          {currentStep === 1 && (
            <Card className="border-brand-border shadow-xs">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="border-b border-brand-border/60 pb-4 text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-brand-heading">
                    Bước 1: Mô tả chi tiết món đồ
                  </h3>
                  <p className="text-sm text-brand-muted mt-0.5">
                    Các thông tin dưới đây sẽ được hiển thị công khai để mọi người nhận diện.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Category & Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Select
                      label="Danh mục đồ vật"
                      required
                      options={categoryOptions}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      error={errors.category}
                    />
                    <div>
                      <label className="block text-sm font-bold text-brand-heading mb-1.5 text-left">
                        Tên đồ vật <span className="text-brand-lost">*</span>
                      </label>
                      <Input
                        placeholder="Ví dụ: Ví da nam Pedro, Tai nghe AirPods Pro 2..."
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className={`h-11 text-sm font-medium ${errors.title ? "border-brand-lost" : ""}`}
                      />
                      {errors.title && <p className="text-xs text-brand-lost font-medium mt-1 text-left">{errors.title}</p>}
                    </div>
                  </div>

                  {/* Brand & Material */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-brand-heading mb-1.5 text-left">
                        Thương hiệu / Hãng sản xuất
                      </label>
                      <Input
                        placeholder="Ví dụ: Apple, Sony, Pedro, Charles & Keith..."
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="h-11 text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-heading mb-1.5 text-left">
                        Chất liệu
                      </label>
                      <Input
                        placeholder="Ví dụ: Da thật, Kim loại, Vải Canvas..."
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        className="h-11 text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Color, Size & Style */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Select
                      label="Màu sắc chủ đạo"
                      required
                      options={colorOptions}
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      error={errors.color}
                    />
                    <div>
                      <label className="block text-sm font-bold text-brand-heading mb-1.5 text-left">
                        Kích thước (nếu biết)
                      </label>
                      <Input
                        placeholder="Ví dụ: 11 x 8 cm, Size M..."
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className="h-11 text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-brand-heading mb-1.5 text-left">
                        Kiểu dáng
                      </label>
                      <Input
                        placeholder="Ví dụ: Ví gấp đôi, Dáng đứng..."
                        value={formData.style}
                        onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                        className="h-11 text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <Textarea
                    label="Mô tả chi tiết đồ vật"
                    required
                    hint={`${formData.description.length}/500`}
                    rows={4}
                    placeholder="Mô tả cụ thể về hình dáng bên ngoài, vết xước, phụ kiện đính kèm, logo..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    error={errors.description}
                    className="text-sm"
                  />

                  {/* Image Upload Area */}
                  <div className="space-y-2 text-left pt-2">
                    <label className="block text-sm font-bold text-brand-heading">
                      Hình ảnh đồ vật (Tối đa 5 ảnh)
                    </label>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Upload Box */}
                      <button
                        type="button"
                        onClick={handleAddSampleImage}
                        className="h-28 rounded-2xl border-2 border-dashed border-brand-border bg-brand-cream/40 hover:bg-brand-cream hover:border-brand-plum/40 transition-all flex flex-col items-center justify-center p-3 text-center gap-1.5 group cursor-pointer"
                      >
                        <UploadCloud className="w-6 h-6 text-brand-plum group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-brand-heading">Tải ảnh lên</span>
                        <span className="text-[10px] text-brand-muted">JPG, PNG, WEBP</span>
                      </button>

                      {/* Uploaded Images List */}
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

          {/* STEP 2: THỜI GIAN & ĐỊA ĐIỂM */}
          {currentStep === 2 && (
            <Card className="border-brand-border shadow-xs">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="border-b border-brand-border/60 pb-4 text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-brand-heading">
                    Bước 2: Thời gian & Địa điểm bị mất
                  </h3>
                  <p className="text-sm text-brand-muted mt-0.5">
                    Xác định vị trí và thời gian ước tính để AI khoanh vùng tìm kiếm.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <DatePicker
                      label="Ngày bị mất"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      error={errors.date}
                    />
                    <Select
                      label="Khoảng thời gian ước tính"
                      required
                      options={timeSlotOptions}
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      error={errors.timeSlot}
                    />
                  </div>

                  {/* Location Picker Field */}
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-brand-heading">
                        Địa điểm bị mất <span className="text-brand-lost">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsLocationModalOpen(true)}
                        className="text-sm font-bold text-brand-plum hover:underline flex items-center gap-1"
                      >
                        <MapPin className="w-4 h-4" />
                        Ghim vị trí trên bản đồ
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <MapPin className="w-4 h-4 text-brand-plum absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                    {formData.locationArea && (
                      <p className="text-xs text-brand-muted flex items-center gap-1 pt-1">
                        <CheckCircle2 className="w-4 h-4 text-brand-found" />
                        Khu vực: <strong className="text-brand-heading">{formData.locationArea}</strong> (bán kính bảo mật ~200m)
                      </p>
                    )}
                  </div>

                  {/* Location Detail */}
                  <Textarea
                    label="Mô tả cụ thể vị trí xảy ra (chi tiết phòng, cửa, tuyến xe...)"
                    hint={`${formData.locationDetail.length}/300`}
                    rows={3}
                    placeholder="Ví dụ: Đã ngồi uống cà phê tại bàn ngoài hiên gần quầy thanh toán..."
                    value={formData.locationDetail}
                    onChange={(e) => setFormData({ ...formData, locationDetail: e.target.value })}
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: BẢO MẬT & XÁC MINH */}
          {currentStep === 3 && (
            <Card className="border-brand-border shadow-xs">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="border-b border-brand-border/60 pb-4 text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-brand-heading">
                    Bước 3: Thông tin bảo mật đối chiếu
                  </h3>
                  <p className="text-sm text-brand-muted mt-0.5">
                    Các thông tin này chỉ bạn và hệ thống biết, dùng để xác minh chủ nhân khi có người nhặt được.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Distinctive Features */}
                  <Textarea
                    label="Đặc điểm nhận dạng nổi bật (Hiển thị có kiểm soát)"
                    hint={`${formData.distinctiveFeatures.length}/300`}
                    rows={3}
                    placeholder="Ví dụ: Có khắc chữ M.D nhỏ ở mép trong, đường may chỉ đen..."
                    value={formData.distinctiveFeatures}
                    onChange={(e) => setFormData({ ...formData, distinctiveFeatures: e.target.value })}
                    className="text-sm"
                  />

                  {/* Private Verification Fact Box */}
                  <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-left space-y-3">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base">
                      <Lock className="w-5 h-5 text-amber-700 shrink-0" />
                      <span>Thông tin bí mật chỉ dùng để đối chiếu (Bảo mật tuyệt đối)</span>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Thông tin này <strong>tuyệt đối không công khai trên mạng</strong>. Chỉ người nhặt được vật phẩm thật sự mới có thể đối chiếu câu trả lời này khi xử lý trao trả.
                    </p>
                    <Textarea
                      placeholder="Ví dụ: Số tiền chính xác bên trong ví, số seri đuôi, giấy tờ mang tên ai, ảnh chụp kẹp bên trong..."
                      value={formData.secretVerificationAnswers}
                      onChange={(e) => setFormData({ ...formData, secretVerificationAnswers: e.target.value })}
                      rows={3}
                      className="bg-white border-amber-300 focus-visible:ring-amber-500/20 text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 4: XÁC NHẬN & XEM TRƯỚC */}
          {currentStep === 4 && (
            <Card className="border-brand-border shadow-xs">
              <CardContent className="p-6 sm:p-8 space-y-6 text-left">
                <div className="border-b border-brand-border/60 pb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-brand-heading">
                    Bước 4: Kiểm tra lại thông tin báo cáo
                  </h3>
                  <p className="text-sm text-brand-muted mt-0.5">
                    Vui lòng rà soát lại thông tin trước khi hoàn tất đăng báo cáo lên hệ thống.
                  </p>
                </div>

                {/* Review Summary Card */}
                <div className="p-5 rounded-2xl bg-brand-cream/50 border border-brand-border space-y-4">
                  <div className="flex gap-4 items-start">
                    {formData.images[0] && (
                      <div className="w-28 h-28 rounded-xl overflow-hidden bg-white shrink-0 border border-brand-border">
                        <img src={formData.images[0]} alt={formData.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 space-y-1.5 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="lost">Báo cáo mất đồ</Badge>
                        <span className="font-bold text-base text-brand-heading truncate">{formData.title}</span>
                      </div>
                      <p className="text-brand-muted">Danh mục: <strong className="text-brand-heading">{formData.category}</strong> • Màu: <strong className="text-brand-heading">{formData.color}</strong></p>
                      <p className="text-brand-muted flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-brand-plum shrink-0" />
                        {formData.locationName} ({formData.locationArea})
                      </p>
                      <p className="text-brand-muted flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-brand-plum shrink-0" />
                        {formData.date} ({formData.timeSlot})
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-brand-border/60 text-sm text-brand-muted space-y-1">
                    <strong className="text-brand-heading block">Mô tả chi tiết:</strong>
                    <p className="italic text-xs sm:text-sm text-brand-heading">&ldquo;{formData.description}&rdquo;</p>
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="p-4 bg-brand-soft/40 rounded-xl border border-brand-plum/20 text-xs sm:text-sm text-brand-heading flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-plum shrink-0 mt-0.5" />
                  <span>
                    Tôi cam kết các thông tin cung cấp là chính xác và trung thực, chịu trách nhiệm theo đúng quy định cộng đồng của FoundMatch.
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
                onClick={handleSaveDraft}
                className="gap-1.5 text-sm font-semibold text-brand-muted border-brand-border hover:bg-brand-cream"
              >
                <Save className="w-4 h-4" />
                Lưu nháp
              </Button>
              {saveDraftMessage && (
                <span className="text-xs font-semibold text-brand-found animate-in fade-in">
                  {saveDraftMessage}
                </span>
              )}
            </div>

            <Button
              variant="primary"
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto gap-2 bg-brand-plum hover:bg-brand-dark px-8 h-12 font-bold text-sm sm:text-base shadow-xs"
            >
              {currentStep === 4 ? (
                <>
                  Gửi báo cáo mất đồ
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

        {/* Right Sidebar Tips Area (1 col) */}
        <div className="space-y-6">
          <ReportTipsCard step={currentStep} type="lost" />
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
    </div>
  );
}
