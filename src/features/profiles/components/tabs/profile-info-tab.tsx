"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  CheckCircle2,
  Edit2,
  Eye,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import {
  FeedbackAlert,
  resolveApiFormFieldErrors,
  useActionFeedback,
} from "@/features/feedback";
import {
  getPublicProvinces,
  getPublicWards,
} from "@/features/geography/actions/geography.actions";
import type { AdministrativeUnit } from "@/features/geography/types/geography.types";
import type { UserProfileDTO } from "@/types/profile.types";

import { updateProfile } from "../../actions/profile.actions";
import {
  updateProfileSchema,
  type UpdateProfileSchemaInput,
} from "../../schemas/profile.schema";
import { parseAddress } from "../../utils/address.utils";

interface ProfileInfoTabProps {
  profile: UserProfileDTO;
}

const GENDER_OPTIONS: SelectOption[] = [
  { label: "Nam", value: "male" },
  { label: "Nữ", value: "female" },
  { label: "Khác", value: "other" },
  { label: "Không chia sẻ", value: "prefer_not_to_say" },
];

const GENDER_LABEL_MAP: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
  prefer_not_to_say: "Không chia sẻ",
};

type ProfileFormField = keyof UpdateProfileSchemaInput;

function getProfileFormValues(
  profile: UserProfileDTO,
): UpdateProfileSchemaInput {
  const legacyAddress = parseAddress(profile.address);
  return {
    fullName: profile.fullName ?? "",
    phone: profile.phone ?? "",
    dateOfBirth: profile.dateOfBirth?.slice(0, 10) ?? "",
    gender: profile.gender ?? "prefer_not_to_say",
    addressLine: profile.addressLine ?? legacyAddress.streetAddress,
    countryCode: profile.countryCode,
    administrativeAreaLevel1Id: profile.administrativeAreaLevel1Id,
    administrativeAreaLevel2Id: profile.administrativeAreaLevel2Id,
    localityGeographyId: profile.localityGeographyId,
    occupation: profile.occupation ?? "",
  };
}

function isPersistedGeographyId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

interface ReadOnlyFieldProps {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
  placeholder?: string;
}

function ReadOnlyField({
  label,
  value,
  icon,
  placeholder = "Chưa cập nhật",
}: ReadOnlyFieldProps) {
  const hasValue = Boolean(value?.trim());

  return (
    <div className="space-y-1">
      <span className="block text-xs font-bold text-brand-muted uppercase tracking-wider">
        {label}
      </span>
      <div className="flex min-h-[44px] items-center gap-2 py-1.5 text-sm font-semibold text-brand-heading">
        {icon ? (
          <div className="shrink-0 text-brand-plum/80">{icon}</div>
        ) : null}
        {hasValue ? (
          <span className="break-words">{value}</span>
        ) : (
          <span className="font-normal italic text-brand-muted/50">
            {placeholder}
          </span>
        )}
      </div>
    </div>
  );
}

export function ProfileInfoTab({ profile }: ProfileInfoTabProps) {
  const initialAddress = React.useMemo(
    () => parseAddress(profile.address),
    [profile.address],
  );
  const [savedProfile, setSavedProfile] = React.useState(profile);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [pendingUpdate, setPendingUpdate] =
    React.useState<UpdateProfileSchemaInput | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null,
  );
  const [city, setCity] = React.useState(initialAddress.city);
  const [ward, setWard] = React.useState(initialAddress.ward);
  const [provinces, setProvinces] = React.useState<AdministrativeUnit[]>([]);
  const [wards, setWards] = React.useState<AdministrativeUnit[]>([]);
  const [loadingProvinces, setLoadingProvinces] = React.useState(false);
  const [loadingWards, setLoadingWards] = React.useState(false);
  const feedback = useActionFeedback();

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch,
  } = useForm<UpdateProfileSchemaInput>({
    defaultValues: getProfileFormValues(profile),
    resolver: zodResolver(updateProfileSchema),
  });

  const fullName = watch("fullName") ?? "";
  const phone = watch("phone") ?? "";
  const dateOfBirth = watch("dateOfBirth") ?? "";
  const gender = watch("gender") ?? "prefer_not_to_say";
  const occupation = watch("occupation") ?? "";
  const streetAddress = watch("addressLine") ?? "";

  React.useEffect(() => {
    let mounted = true;

    async function loadInitialGeography() {
      setLoadingProvinces(true);
      try {
        const list = (await getPublicProvinces()).filter((item) =>
          isPersistedGeographyId(item.id),
        );
        if (!mounted) return;
        setProvinces(list);

        const matchedProvince =
          list.find((item) => item.id === profile.administrativeAreaLevel1Id) ??
          (initialAddress.city
            ? list.find(
                (item) =>
                  item.name.toLowerCase() ===
                    initialAddress.city.toLowerCase() ||
                  item.name
                    .toLowerCase()
                    .includes(initialAddress.city.toLowerCase()) ||
                  initialAddress.city
                    .toLowerCase()
                    .includes(item.name.toLowerCase()),
              )
            : undefined);

        if (!matchedProvince) return;
        setCity(matchedProvince.name);
        setValue("countryCode", profile.countryCode ?? "VN");
        setValue("administrativeAreaLevel1Id", matchedProvince.id);
        setLoadingWards(true);

        const wardList = (await getPublicWards(matchedProvince.id)).filter(
          (item) => isPersistedGeographyId(item.id),
        );
        if (!mounted) return;
        setWards(wardList);

        const matchedWard =
          wardList.find((item) => item.id === profile.localityGeographyId) ??
          (initialAddress.ward
            ? wardList.find(
                (item) =>
                  item.name.toLowerCase() === initialAddress.ward.toLowerCase(),
              )
            : undefined);
        if (matchedWard) {
          setWard(matchedWard.name);
          setValue("localityGeographyId", matchedWard.id);
        }
      } finally {
        if (mounted) {
          setLoadingProvinces(false);
          setLoadingWards(false);
        }
      }
    }

    void loadInitialGeography();
    return () => {
      mounted = false;
    };
  }, [
    initialAddress.city,
    initialAddress.ward,
    profile.administrativeAreaLevel1Id,
    profile.countryCode,
    profile.localityGeographyId,
    setValue,
  ]);

  const handleCityChange = async (
    cityName: string,
    option?: ComboboxOption,
  ) => {
    setCity(cityName);
    setWard("");
    setValue("localityGeographyId", null, { shouldDirty: true });

    if (!option?.id) {
      setValue("countryCode", null, { shouldDirty: true });
      setValue("administrativeAreaLevel1Id", null, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setWards([]);
      return;
    }

    setValue("countryCode", "VN", { shouldDirty: true });
    setValue("administrativeAreaLevel1Id", option.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setLoadingWards(true);
    try {
      setWards(
        (await getPublicWards(option.id)).filter((item) =>
          isPersistedGeographyId(item.id),
        ),
      );
    } finally {
      setLoadingWards(false);
    }
  };

  const handleWardChange = (wardName: string, option?: ComboboxOption) => {
    setWard(wardName);
    setValue("localityGeographyId", option?.id ?? null, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleCancel = () => {
    const savedAddress = parseAddress(savedProfile.address);
    reset(getProfileFormValues(savedProfile));
    setCity(
      provinces.find(
        (item) => item.id === savedProfile.administrativeAreaLevel1Id,
      )?.name ?? savedAddress.city,
    );
    setWard(
      wards.find((item) => item.id === savedProfile.localityGeographyId)
        ?.name ?? savedAddress.ward,
    );
    feedback.clearError();
    setSuccessMessage(null);
    setIsEditing(false);
  };

  const requestConfirmation = handleSubmit((values) => {
    feedback.clearError();
    setSuccessMessage(null);
    setPendingUpdate(values);
    setIsConfirmOpen(true);
  });

  const confirmUpdate = async () => {
    if (!pendingUpdate) return;
    setIsSaving(true);
    const result = await updateProfile(pendingUpdate);
    setIsSaving(false);

    if (!result.success || !result.data) {
      feedback.showInlineError(
        result.error,
        "Cập nhật thất bại. Vui lòng kiểm tra lại thông tin.",
      );
      const fieldErrors = resolveApiFormFieldErrors<ProfileFormField>(
        result.error,
      );
      for (const [field, message] of Object.entries(fieldErrors)) {
        setError(field as ProfileFormField, { type: "server", message });
      }
      if (Object.keys(fieldErrors).length > 0) setIsConfirmOpen(false);
      return;
    }

    setSavedProfile(result.data);
    reset(getProfileFormValues(result.data));
    feedback.clearError();
    setSuccessMessage(result.message || "Cập nhật hồ sơ thành công!");
    setIsConfirmOpen(false);
    setPendingUpdate(null);
    setIsEditing(false);
    window.dispatchEvent(
      new CustomEvent("profile-updated", { detail: result.data }),
    );
  };

  const provinceOptions: ComboboxOption[] = provinces.map((item) => ({
    id: item.id,
    label: item.name,
    value: item.code || item.name,
  }));
  const wardOptions: ComboboxOption[] = wards.map((item) => ({
    id: item.id,
    label: item.name,
    value: item.code || item.name,
  }));

  return (
    <>
      <form noValidate onSubmit={requestConfirmation}>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="relative h-full space-y-6 rounded-[32px] border border-brand-border bg-white p-6 sm:p-8 lg:col-span-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h3 className="text-xl font-extrabold text-brand-heading">
                  Thông tin cá nhân
                </h3>
                <p className="mt-1 text-[13px] font-semibold text-brand-muted">
                  Cập nhật thông tin để giúp cộng đồng tin tưởng và kết nối tốt
                  hơn.
                </p>
              </div>

              {!isEditing ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsEditing(true);
                    feedback.clearError();
                    setSuccessMessage(null);
                  }}
                  className="shrink-0"
                >
                  <Edit2 className="mr-1.5 h-3.5 w-3.5" /> Chỉnh sửa
                </Button>
              ) : (
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X className="mr-1.5 h-4 w-4" /> Hủy
                  </Button>
                  <Button type="submit" size="sm" disabled={isSaving}>
                    <CheckCircle2 className="mr-1.5 h-4 w-4" /> Lưu
                  </Button>
                </div>
              )}
            </div>

            <FeedbackAlert
              error={feedback.error}
              message={feedback.error ? null : successMessage}
              variant={successMessage ? "success" : "error"}
              onClose={() => {
                feedback.clearError();
                setSuccessMessage(null);
              }}
              className="mt-5"
            />

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-brand-border/60 pb-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-plum/10 text-brand-plum">
                    <User className="h-4 w-4" />
                  </div>
                  <h4 className="text-base font-bold text-brand-heading">
                    Thông tin cá nhân
                  </h4>
                </div>

                {!isEditing ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ReadOnlyField label="Họ và tên" value={fullName} />
                    <ReadOnlyField label="Nghề nghiệp" value={occupation} />
                    <ReadOnlyField
                      label="Ngày sinh"
                      value={
                        dateOfBirth
                          ? dateOfBirth.split("-").reverse().join("/")
                          : ""
                      }
                      icon={<Calendar className="h-4 w-4" />}
                    />
                    <ReadOnlyField
                      label="Giới tính"
                      value={GENDER_LABEL_MAP[gender] || "Không chia sẻ"}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="Họ và tên"
                      placeholder="VD: Nguyễn Văn A"
                      error={errors.fullName?.message}
                      {...register("fullName")}
                    />
                    <Input
                      label="Nghề nghiệp"
                      placeholder="VD: Kỹ sư"
                      error={errors.occupation?.message}
                      {...register("occupation")}
                    />
                    <Controller
                      control={control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <DatePicker
                          id="profile-date-of-birth"
                          label="Ngày sinh"
                          value={field.value ?? ""}
                          onChange={(value) =>
                            field.onChange(
                              typeof value === "string"
                                ? value
                                : (value?.target.value ?? ""),
                            )
                          }
                          placeholder="Chọn ngày"
                          error={errors.dateOfBirth?.message}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="gender"
                      render={({ field }) => (
                        <Select
                          id="profile-gender"
                          label="Giới tính"
                          value={field.value ?? "prefer_not_to_say"}
                          onChange={field.onChange}
                          options={GENDER_OPTIONS}
                          error={errors.gender?.message}
                        />
                      )}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-3 border-b border-brand-border/60 pb-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-plum/10 text-brand-plum">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h4 className="text-base font-bold text-brand-heading">
                    Thông tin liên lạc &amp; Địa chỉ
                  </h4>
                </div>

                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <ReadOnlyField
                        label="Số điện thoại"
                        value={phone}
                        icon={<Phone className="h-4 w-4" />}
                      />
                      <ReadOnlyField
                        label="Địa chỉ Email"
                        value={savedProfile.email}
                        icon={<Mail className="h-4 w-4" />}
                      />
                      <ReadOnlyField label="Tỉnh / Thành phố" value={city} />
                      <ReadOnlyField label="Phường / Xã" value={ward} />
                    </div>
                    <ReadOnlyField
                      label="Địa chỉ cụ thể"
                      value={streetAddress}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Input
                        label="Số điện thoại"
                        placeholder="VD: 0901234567"
                        icon={<Phone className="h-4 w-4 text-brand-muted" />}
                        error={errors.phone?.message}
                        {...register("phone")}
                      />
                      <Input
                        label="Địa chỉ Email"
                        type="email"
                        value={savedProfile.email}
                        disabled
                        icon={<Mail className="h-4 w-4 text-slate-400" />}
                        className="cursor-not-allowed border-slate-200 bg-slate-100/80 text-slate-500 opacity-75 shadow-none"
                        hint="Email đăng nhập không thể thay đổi tại đây"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Combobox
                        id="profile-administrative-area-level-1"
                        label="Tỉnh / Thành phố"
                        value={city}
                        onChange={(value, option) =>
                          void handleCityChange(value, option)
                        }
                        options={provinceOptions}
                        placeholder={
                          loadingProvinces
                            ? "Đang tải danh sách..."
                            : "Chọn hoặc tìm Tỉnh/Thành phố..."
                        }
                        disabled={loadingProvinces}
                        loading={loadingProvinces}
                        allowCustomInput={false}
                        error={
                          errors.administrativeAreaLevel1Id?.message ??
                          errors.countryCode?.message
                        }
                      />
                      <Combobox
                        id="profile-locality-geography"
                        label="Phường / Xã"
                        value={ward}
                        onChange={handleWardChange}
                        options={wardOptions}
                        placeholder={
                          loadingWards
                            ? "Đang tải phường/xã..."
                            : !city
                              ? "Vui lòng chọn Tỉnh/Thành trước"
                              : "Chọn hoặc tìm Phường/Xã..."
                        }
                        disabled={loadingWards || !city}
                        loading={loadingWards}
                        allowCustomInput={false}
                        error={errors.localityGeographyId?.message}
                      />
                    </div>

                    <Input
                      label="Địa chỉ cụ thể"
                      placeholder="Số nhà, tên đường, ngõ, tòa nhà... (VD: 24 Đặng Tất)"
                      error={errors.addressLine?.message}
                      {...register("addressLine")}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <ProfilePrivacyCard />
        </div>
      </form>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={(open) => {
          if (!isSaving) setIsConfirmOpen(open);
        }}
        title="Xác nhận cập nhật hồ sơ"
        description="Thông tin cá nhân và địa chỉ đã lưu là dữ liệu riêng tư. Bạn có chắc chắn muốn lưu các thay đổi này?"
        confirmText="Xác nhận lưu"
        cancelText="Hủy"
        variant="default"
        loading={isSaving}
        onConfirm={confirmUpdate}
      />
    </>
  );
}

function ProfilePrivacyCard() {
  return (
    <aside className="space-y-6 rounded-[32px] border border-brand-border bg-white p-6 sm:p-8 lg:col-span-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F3F9F1] text-brand-found">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-[15px] font-extrabold text-brand-heading">
            Minh bạch quyền riêng tư
          </h4>
          <p className="text-[12px] font-semibold text-brand-muted">
            Cam kết bảo vệ dữ liệu cá nhân
          </p>
        </div>
      </div>
      <div className="h-px w-full bg-brand-border" />
      <PrivacyItem
        icon={<Eye className="h-4 w-4 text-brand-plum" />}
        title="Thông tin hiển thị công khai"
      >
        Ảnh đại diện, họ tên hiển thị và username giúp cộng đồng nhận biết tài
        khoản của bạn.
      </PrivacyItem>
      <PrivacyItem
        icon={<Lock className="h-4 w-4 text-brand-found" />}
        title="Thông tin riêng tư"
      >
        Số điện thoại, email, ngày sinh, giới tính, nghề nghiệp và địa chỉ không
        xuất hiện trong hồ sơ công khai.
      </PrivacyItem>
      <PrivacyItem
        icon={<MapPin className="h-4 w-4 text-brand-lost" />}
        title="Địa chỉ chính xác"
      >
        Địa chỉ là tùy chọn, chỉ dùng để điền nhanh khi bạn chủ động tạo báo cáo
        và không tự động được công khai.
      </PrivacyItem>
      <div className="rounded-2xl border border-brand-border/60 bg-[#FAF7F2] p-4 text-[11px] font-semibold leading-relaxed text-brand-muted">
        FoundMatch không bán hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ
        ba vì mục đích quảng cáo thương mại.
      </div>
    </aside>
  );
}

function PrivacyItem({
  children,
  icon,
  title,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-brand-heading">
        <span className="shrink-0">{icon}</span>
        <span className="text-[13px] font-bold">{title}</span>
      </div>
      <p className="pl-6 text-[12px] font-medium leading-relaxed text-brand-muted">
        {children}
      </p>
    </div>
  );
}
