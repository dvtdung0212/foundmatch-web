"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  X,
  MapPin,
  Clock,
  Lock,
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle2,
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
import { buildReportSubmission } from "../../api/report-form-mapper";
import { useReportComposer } from "../../hooks/use-report-composer";

const lostSteps: StepItem[] = [
  { id: 1, title: "Thông tin đồ vật", description: "Mô tả chi tiết món đồ" },
  { id: 2, title: "Thời gian & địa điểm", description: "Khi nào và ở đâu bị mất" },
  { id: 3, title: "Bảo mật & xác minh", description: "Minh chứng và đối chiếu" },
  { id: 4, title: "Xác nhận", description: "Kiểm tra và gửi báo cáo" },
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [saveDraftMessage, setSaveDraftMessage] = useState("");
  const {
    addImages,
    categories,
    error: submissionError,
    images,
    isLoadingCategories,
    isSaving,
    persist,
    removeImage,
  } = useReportComposer("LOST");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    brand: "",
    material: "",
    color: "",
    size: "",
    style: "",
    genderTarget: "",
    description: "",
    
    // Time & Location
    date: "",
    timeSlot: "",
    locationName: "",
    locationArea: "",
    locationDetail: "",
    
    // Security & Verification
    distinctiveFeatures: "",
    secretVerificationAnswers: "",
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

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const category = categories.find(({ id }) => id === formData.category);
        if (!category) {
          setErrors({ category: "Vui lòng chọn danh mục hợp lệ" });
          setCurrentStep(1);
          return;
        }

        try {
          const result = await persist(
            buildReportSubmission({
              additionalPublicFacts: [
                { label: "Chất liệu", value: formData.material },
                { label: "Kích thước", value: formData.size },
                { label: "Kiểu dáng", value: formData.style },
                { label: "Đối tượng", value: formData.genderTarget },
              ],
              brand: formData.brand,
              categoryId: category.id,
              categoryName: category.name,
              color: formData.color,
              date: formData.date,
              description: formData.description,
              distinctiveFeatures: formData.distinctiveFeatures,
              files: [],
              locationArea: formData.locationArea,
              locationDetail: formData.locationDetail,
              locationName: formData.locationName,
              secretVerificationAnswers: formData.secretVerificationAnswers,
              timeSlot: formData.timeSlot,
              title: formData.title,
              type: "LOST",
            }),
            true,
          );
          router.push(
            `/reports/create/success?code=${encodeURIComponent(result.publicCode ?? "")}&reportId=${encodeURIComponent(result.id ?? "")}&type=lost&title=${encodeURIComponent(formData.title)}`,
          );
        } catch {
          // A safe request-correlated error is rendered below the form.
        }
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
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    removeImage(index);
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
        onStepClick={(step) => {
          if (step < currentStep) setCurrentStep(step);
        }}
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
                      options={categories.map(({ id, name }) => ({ label: name, value: id }))}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      error={errors.category}
                      disabled={isLoadingCategories || isSaving}
                      placeholder={isLoadingCategories ? "Đang tải danh mục..." : "Chọn danh mục"}
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
                        disabled={images.length >= 5 || isSaving}
                        className="h-28 rounded-2xl border-2 border-dashed border-brand-border bg-brand-cream/40 hover:bg-brand-cream hover:border-brand-plum/40 transition-all flex flex-col items-center justify-center p-3 text-center gap-1.5 group cursor-pointer"
                      >
                        <UploadCloud className="w-6 h-6 text-brand-plum group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-brand-heading">Tải ảnh lên</span>
                        <span className="text-[10px] text-brand-muted">JPG, PNG, WEBP</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="sr-only"
                        onChange={(event) => {
                          addImages(Array.from(event.target.files ?? []));
                          event.target.value = "";
                        }}
                      />

                      {/* Uploaded Images List */}
                      {images.map((image, idx) => (
                        <div key={image.previewUrl} className="relative h-28 rounded-2xl overflow-hidden border border-brand-border group">
                          <img src={image.previewUrl} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
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
                    {images[0] && (
                      <div className="w-28 h-28 rounded-xl overflow-hidden bg-white shrink-0 border border-brand-border">
                        <img src={images[0].previewUrl} alt={formData.title} className="w-full h-full object-cover" />
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
          {submissionError && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <strong>Không thể lưu báo cáo.</strong> {submissionError.message}
              {submissionError.requestId && (
                <span className="mt-1 block text-xs">Mã yêu cầu: {submissionError.requestId}</span>
              )}
            </div>
          )}
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
              disabled={isSaving}
              className="w-full sm:w-auto gap-2 bg-brand-plum hover:bg-brand-dark px-8 h-12 font-bold text-sm sm:text-base shadow-xs"
            >
              {isSaving ? (
                <>Đang gửi báo cáo...</>
              ) : currentStep === 4 ? (
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
