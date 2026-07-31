import { getCurrentProfile } from "@/features/profiles/actions/profile.actions";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SignUpForm } from "@/features/auth/components/signup-form";
import { ShieldCheck, Users, Heart } from "lucide-react";
import Image from "next/image";

interface SignUpPageProps {
  searchParams?: {
    next?: string;
  };
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const profileResult = await getCurrentProfile();
  const profile = profileResult.success ? profileResult.data : null;
  const nextUrl = searchParams?.next || "/profile";

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
                  Tham gia FoundMatch <br />
                  và giúp trả lại đồ <br /> thất lạc
                </h1>
                <p className="text-base xl:text-lg text-[#7A6E67] font-medium leading-relaxed max-w-md">
                  Cùng cộng đồng hàng chục nghìn người tốt bụng, chúng ta có thể
                  kết nối và trao trả những món đồ thất lạc đến đúng người.
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
                      An toàn & bảo mật
                    </h4>
                    <p className="text-sm text-[#7A6E67] leading-relaxed mt-1">
                      Thông tin của bạn được bảo vệ tuyệt đối và chỉ dùng để hỗ trợ cộng đồng.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white border border-[#EFE8DF] text-[#37783C] shrink-0 shadow-sm">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-[#2A1B17]">
                      Cộng đồng tin cậy
                    </h4>
                    <p className="text-sm text-[#7A6E67] leading-relaxed mt-1">
                      Hàng chục nghìn thành viên đã và đang giúp nhau mỗi ngày.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white border border-[#EFE8DF] text-[#5B0E2D] shrink-0 shadow-sm">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-[#2A1B17]">
                      Ý nghĩa mỗi ngày
                    </h4>
                    <p className="text-sm text-[#7A6E67] leading-relaxed mt-1">
                      Mỗi hành động nhỏ của bạn có thể giúp ai đó tìm lại điều quan trọng.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Illustration sitting at the bottom */}
            <div className="w-full relative aspect-[16/9] mt-auto">
              <Image 
                src="/images/auth-hero-signup.png?v=2" 
                alt="Đăng ký FoundMatch" 
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
              <SignUpForm nextUrl={nextUrl} />
            </div>
          </div>

        </div>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
