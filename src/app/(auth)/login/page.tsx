import { getCurrentProfile } from "@/features/profiles/actions/profile.actions";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LoginForm } from "@/features/auth/components/login-form";
import { ShieldCheck, Users, Lock } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const profileResult = await getCurrentProfile();
  const profile = profileResult.success ? profileResult.data : null;

  if (profile) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] text-[#2A1B17]">
      {/* Shared Navbar */}
      <Navbar profile={profile} />

      {/* Main container vertically & horizontally centered */}
      <main className="flex-1 flex w-full items-center justify-center p-4 sm:p-8 py-10 lg:py-12">
        {/* Unified Card Container */}
        <div className="w-full max-w-[1200px] bg-white rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.08)] flex overflow-hidden">
          
          {/* Left Half (Hidden on Mobile) */}
          <div className="hidden lg:flex w-1/2 flex-col justify-between bg-[#FFF9F2] pt-12 xl:pt-16 border-r border-[#EFE8DF] relative">
            <div className="px-10 xl:px-16 w-full space-y-10 z-10 pb-8">
              <div className="space-y-4">
                <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-[#2A1B17] leading-tight">
                  Kết nối để trả lại <br /> đúng người, lan tỏa <br /> sự tử tế.
                </h1>
                <p className="text-base xl:text-lg text-[#7A6E67] font-medium leading-relaxed max-w-md">
                  FoundMatch giúp cộng đồng kết nối để tìm và trả lại đồ thất lạc
                  một cách nhanh chóng, minh bạch và an toàn.
                </p>
              </div>

              {/* 3 Feature Points */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white border border-[#EFE8DF] text-[#5B0E2D] shrink-0 shadow-sm">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-[#2A1B17]">
                      Minh bạch & đáng tin cậy
                    </h4>
                    <p className="text-sm text-[#7A6E67] leading-relaxed mt-1">
                      Thông tin được xác minh và bảo vệ để đảm bảo an toàn cho mọi người.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white border border-[#EFE8DF] text-[#37783C] shrink-0 shadow-sm">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-[#2A1B17]">
                      Cộng đồng tử tế
                    </h4>
                    <p className="text-sm text-[#7A6E67] leading-relaxed mt-1">
                      Hàng ngàn thành viên sẵn sàng giúp đỡ và lan tỏa điều tốt đẹp.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white border border-[#EFE8DF] text-[#D97C17] shrink-0 shadow-sm">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-[#2A1B17]">
                      Bảo mật tuyệt đối
                    </h4>
                    <p className="text-sm text-[#7A6E67] leading-relaxed mt-1">
                      Chúng tôi bảo vệ dữ liệu của bạn với các tiêu chuẩn bảo mật cao nhất.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Illustration sitting at the bottom */}
            <div className="w-full relative aspect-[16/9] mt-auto">
              <Image 
                src="/images/auth-hero-login.png?v=2" 
                alt="Đăng nhập FoundMatch" 
                fill 
                className="object-cover object-bottom"
                sizes="(max-width: 1024px) 0vw, 50vw"
                priority
              />
              {/* Gradient overlay to blend top of image into background */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#FFF9F2] via-[#FFF9F2]/80 to-transparent"></div>
            </div>
          </div>

          {/* Right Half (Form) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-16 bg-white">
            <div className="w-full max-w-[480px]">
              <LoginForm />
            </div>
          </div>

        </div>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
