export function ProfileStatsRow() {
  return (
    <div className="bg-transparent rounded-3xl p-4 sm:p-5 border border-brand-border grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
      <div className="flex flex-col sm:flex-row items-center gap-2.5 text-center sm:text-left justify-center sm:justify-start">
        <div className="h-10 w-10 rounded-full bg-[#FFF4F1] text-brand-lost flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9" /><path d="M10 20v-4h4v4" /><path d="M4 10h16" /><path d="M12 2v8" /><path d="m8 6 4-4 4 4" /></svg>
        </div>
        <div>
          <p className="text-xl font-extrabold text-brand-heading leading-none">24</p>
          <p className="text-xs uppercase font-bold text-brand-muted mt-1">Đồ đã tìm lại</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2.5 text-center sm:text-left pl-0 sm:pl-4 justify-center sm:justify-start ">
        <div className="h-10 w-10 rounded-full bg-[#F3F9F1] text-brand-found flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
        </div>
        <div>
          <p className="text-xl font-extrabold text-brand-heading leading-none">18</p>
          <p className="text-xs uppercase font-bold text-brand-muted mt-1">Đồ đã hoàn trả</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2.5 text-center sm:text-left pl-0 sm:pl-4 justify-center sm:justify-start pt-4 sm:pt-0 border-t border-brand-border sm:border-t-0 col-span-2 sm:col-span-1 border-l-0 ">
        <div className="h-10 w-10 rounded-full bg-[#F9ECE3] text-brand-plum flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        </div>
        <div>
          <p className="text-xl font-extrabold text-brand-heading leading-none">96%</p>
          <p className="text-xs uppercase font-bold text-brand-muted mt-1">Tỉ lệ phản hồi</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2.5 text-center sm:text-left pl-0 sm:pl-4 justify-center sm:justify-start pt-4 sm:pt-0 border-t border-brand-border sm:border-t-0 col-span-2 sm:col-span-1">
        <div className="h-10 w-10 rounded-full bg-brand-plum/10 text-brand-plum flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
        </div>
        <div>
          <p className="text-xl font-extrabold text-brand-heading leading-none">4.8<span className="text-xs text-brand-muted font-bold">/5</span></p>
          <p className="text-xs uppercase font-bold text-brand-muted mt-1">Điểm uy tín</p>
        </div>
      </div>
    </div>
  );
}
