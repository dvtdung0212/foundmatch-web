export function ProfileQuoteCard() {
  return (
    <div className="bg-[#FFF4F1]/30 rounded-2xl p-3.5 sm:p-4 border border-[#FFC7BA]/30 flex items-start gap-3">
      <div className="text-brand-lost opacity-50 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M11 18H7a3 3 0 0 1-3-3v-4h4V6h5v5h-4v3a2 2 0 0 0 2 2v2zm10 0h-4a3 3 0 0 1-3-3v-4h4V6h5v5h-4v3a2 2 0 0 0 2 2v2z"/></svg>
      </div>
      <div className="flex-1">
        <p className="text-[13px] font-semibold text-brand-heading italic leading-relaxed">
          &quot;Tôi tin rằng mỗi món đồ đều có giá trị và mỗi hành động tử tế đều tạo nên sự khác biệt. Hãy cùng nhau xây dựng cộng đồng văn minh và giàu lòng tốt!&quot;
        </p>
      </div>
    </div>
  );
}
