
import React, { useState, useEffect, useRef } from 'react';
import { Order, VerificationStatus } from '../types';

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
  initialEditMode: boolean;
  scrollToId?: string | null;
  onSave: (updatedOrder: Order) => void;
}

const SectionHeader: React.FC<{ number: number; title: string; id?: string; color?: string; action?: React.ReactNode }> = ({ number, title, id, color = "bg-[#00a651]", action }) => (
  <div id={id} className={`${color} px-4 py-2.5 flex items-center gap-3 shadow-sm rounded-t-lg mt-4`}>
    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white text-[11px] font-black border border-white/20">{number}</div>
    <h3 className="text-white font-bold text-[13px] uppercase tracking-wider">{title}</h3>
    {action && <div className="ml-auto">{action}</div>}
    {!action && (
      <div className="ml-auto">
        <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    )}
  </div>
);

const InputGroup: React.FC<{ label: string; value: string; required?: boolean; placeholder?: string; suffix?: string; disabled?: boolean; isEditing?: boolean; className?: string; type?: string }> = ({ label, value, required, placeholder, suffix, disabled, isEditing, className, type = "text" }) => (
  <div className={`space-y-1 ${className}`}>
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label} {required && <span className="text-red-500">*</span>}</label>
    <div className="relative">
      <input 
        type={type}
        disabled={disabled || !isEditing} 
        className={`w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-[11px] outline-none transition-all font-medium text-slate-800 ${(!isEditing || disabled) ? 'bg-slate-50 text-slate-400' : 'hover:border-emerald-300 focus:border-emerald-500 shadow-sm'}`} 
        defaultValue={value} 
        placeholder={placeholder}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">{suffix}</span>}
    </div>
  </div>
);

const OrderDetail: React.FC<OrderDetailProps> = ({ order, onBack, initialEditMode, scrollToId, onSave }) => {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [currentVerification, setCurrentVerification] = useState<VerificationStatus | undefined>(order.verificationStatus);

  useEffect(() => {
    if (scrollToId) {
      setTimeout(() => {
        const element = document.getElementById(scrollToId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [scrollToId]);

  const handleUpdateVerification = (status: VerificationStatus) => {
    setCurrentVerification(status);
    onSave({ ...order, verificationStatus: status });
  };

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto pb-24 bg-[#f8fafc]">
      {/* 0. STICKY HEADER ACTIONS */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <button onClick={onBack} className="text-slate-500 hover:text-emerald-600 flex items-center gap-1.5 text-xs font-bold uppercase transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            Quay lại
          </button>
          <div className="h-8 w-px bg-slate-100"></div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">MÃ ĐƠN HÀNG (CỐ ĐỊNH)</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900 tracking-tight">{order.orderCode}</span>
              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-500 text-[8px] font-black rounded border border-blue-100 uppercase">HỆ THỐNG</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">TRẠNG THÁI HIỆN TẠI</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wide">Đang thực hiện cứu hộ</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-6 py-2 bg-white border border-red-200 text-red-600 text-[11px] font-black rounded hover:bg-red-50 transition-all uppercase flex items-center gap-2">
             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
             Hủy đơn
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-8 py-2 text-white text-[11px] font-black rounded transition-all uppercase flex items-center gap-2 shadow-lg ${isEditing ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-700/10' : 'bg-[#00a651] hover:bg-[#009245] shadow-emerald-700/10'}`}
          >
             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
             {isEditing ? 'Lưu thông tin' : 'Cập nhật'}
          </button>
        </div>
      </div>

      {/* 1. THÔNG TIN KHÁCH HÀNG LIÊN HỆ */}
      <section id="section-1" className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <SectionHeader number={1} title="Thông tin khách hàng liên hệ" />
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <InputGroup label="Tên KH liên hệ *" value={order.customer.name} required isEditing={isEditing} />
            <InputGroup label="SĐT *" value={order.customer.phone} required isEditing={isEditing} />
            <InputGroup label="Tên KH gặp sự cố" value={order.customer.name} isEditing={isEditing} />
            <InputGroup label="SĐT" value={order.customer.phone} isEditing={isEditing} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <InputGroup label="Biển số xe *" value={order.vehicle.plate} required isEditing={isEditing} />
            <InputGroup label="Số khung (VIN)" value="R7C2X9M4A8" isEditing={isEditing} />
            <InputGroup label="Hãng xe" value={order.vehicle.brand} isEditing={isEditing} />
            <InputGroup label="Dòng xe" value={order.vehicle.model} isEditing={isEditing} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <InputGroup label="Trọng tải" value="1" suffix="TẤN" isEditing={isEditing} />
            <InputGroup label="Số chỗ" value="5" suffix="CHỖ" isEditing={isEditing} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Vị trí cứu hộ *</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input disabled={!isEditing} className={`w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-[11px] font-medium pr-8 ${!isEditing ? 'bg-slate-50' : ''}`} defaultValue={order.address} />
                  <svg className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                </div>
                <button className="bg-[#00a651] text-white px-3 py-1.5 rounded text-[10px] font-black uppercase flex items-center gap-1.5 shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Chọn trên bản đồ
                </button>
              </div>
            </div>
            <InputGroup label="Kinh độ / Vĩ độ *" value="21.0285" required isEditing={isEditing} />
            <div className="pt-4">
               <input className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-400 font-medium" defaultValue="105.8452" disabled />
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Gói dịch vụ</label>
              <div className="relative">
                <input disabled className="w-full px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded text-[11px] font-black text-emerald-600" defaultValue="Gói cơ bản 10 dịch vụ" />
                <svg className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
            <button className="text-blue-600 text-[10px] font-black underline mb-2 hover:text-blue-800 transition-colors uppercase">Chi tiết gói</button>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Dịch vụ yêu cầu *</label>
             <div className="relative max-w-2xl">
                <input disabled={!isEditing} className="w-full px-3 py-2 border border-slate-200 rounded text-[11px] pl-8 outline-none font-medium" placeholder="Tìm kiếm dịch vụ (VETC hoặc Nhà cung cấp)..." />
                <svg className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <svg className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
             </div>
             <div className="flex flex-wrap gap-2 pt-1">
                {["Xe hết pin (Khác)", "Kích bình ắc quy (VETC)", "Đâm, lật, tai nạn (Khác)"].map((s, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-full text-[9px] font-black border flex items-center gap-1.5 shadow-sm ${i===1 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                    {s} <span className="opacity-50 cursor-pointer hover:opacity-100">✕</span>
                  </span>
                ))}
             </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tình trạng sự cố thực tế</label>
              <textarea disabled={!isEditing} className="w-full p-3 border border-slate-200 rounded text-[11px] font-medium min-h-[60px] outline-none placeholder:text-slate-300 italic focus:border-blue-400 transition-all" defaultValue="như trên"></textarea>
            </div>
            
            {/* ACTION: XÁC MINH ĐƠN HÀNG */}
            {isEditing && (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-3">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Hành động xác minh đơn hàng</span>
                    </div>
                    {currentVerification && (
                       <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase border ${currentVerification === 'Đã xác minh' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                          Kết quả hiện tại: {currentVerification}
                       </span>
                    )}
                 </div>
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleUpdateVerification('Không đạt')}
                      className={`flex-1 py-2 rounded-lg text-[11px] font-black uppercase flex items-center justify-center gap-2 transition-all border ${currentVerification === 'Không đạt' ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-200' : 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50'}`}
                    >
                       <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                       Xác minh: KHÔNG ĐẠT
                    </button>
                    <button 
                      onClick={() => handleUpdateVerification('Đã xác minh')}
                      className={`flex-1 py-2 rounded-lg text-[11px] font-black uppercase flex items-center justify-center gap-2 transition-all border ${currentVerification === 'Đã xác minh' ? 'bg-[#00a651] text-white border-[#00a651] shadow-lg shadow-emerald-200' : 'bg-white text-[#00a651] border-emerald-200 hover:bg-emerald-50'}`}
                    >
                       <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                       Xác minh: PHÊ DUYỆT
                    </button>
                 </div>
              </div>
            )}
          </div>

          {/* RSA-AI SUGGESTION BOX */}
          <div className="bg-[#fff9e6] border border-[#ffeeba] rounded-xl p-4 space-y-3 shadow-inner">
             <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#ffc107]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="text-[11px] font-black text-[#856404] uppercase tracking-wider">Đề xuất từ hệ thống RSA-AI</span>
             </div>
             <div className="space-y-2 text-[11px] text-[#856404] leading-relaxed">
                <p><span className="font-black underline">[PHÂN TÍCH AI]:</span> Hệ thống ghi nhận sự cố chưa xác định rõ nguyên nhân cơ bản. Cần thực hiện kiểm tra tổng quát tại hiện trường.</p>
                <div className="bg-white/40 p-2 rounded-lg border border-[#f5e0a0]">
                   <p><span className="font-black">[DỊCH VỤ ĐỀ XUẤT]:</span></p>
                   <p className="pl-4 font-bold">- Sửa chữa tại chỗ (Mobile Mechanic): 250,000 VNĐ</p>
                </div>
                <p><span className="font-black">[HƯỚNG DẪN XỬ LÝ]:</span> Kỹ thuật viên kiểm tra lỗi qua cổng OBD-II, xác định các mã lỗi hệ thống và đưa ra phương án xử lý cụ thể cho khách hàng.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 2. THÔNG TIN ĐIỀU PHỐI CỨU HỘ */}
      <section id="section-2" className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <SectionHeader number={2} title="Thông tin điều phối cứu hộ" />
        <div className="p-4 space-y-6">
          <div className="flex items-center gap-3">
            <button className="bg-[#00a651] text-white px-5 py-2.5 rounded-lg text-[11px] font-black uppercase flex items-center gap-2 shadow-lg shadow-emerald-700/10 active:scale-95 transition-all">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               Tìm trạm cứu hộ tự động
            </button>
            <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-lg text-[11px] font-black uppercase flex items-center gap-2 hover:bg-slate-50 transition-all">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               Tìm trạm thủ công
            </button>
            <div className="h-6 w-px bg-slate-100"></div>
            <span className="text-[10px] text-slate-400 italic font-medium">Hệ thống sẽ gợi ý trạm gần nhất dựa trên vị trí sự cố</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Đối tác cung cấp *</label>
                <select disabled={!isEditing} className="w-full px-3 py-1.5 border border-slate-200 rounded text-[11px] font-black text-slate-800 outline-none bg-slate-50">
                  <option>CARPLA - CARPLA SERVICE</option>
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Trạm cứu hộ cụ thể *</label>
                <select disabled={!isEditing} className="w-full px-3 py-1.5 border border-slate-200 rounded text-[11px] font-black text-slate-800 outline-none">
                  <option>Carpla Service - CN Hà Nội</option>
                </select>
             </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
             <InputGroup label="Loại xe cứu hộ" value="Xe kéo cẩu" isEditing={isEditing} />
             <InputGroup label="Biển số xe cứu hộ" value="30G-888.88" isEditing={isEditing} />
             <InputGroup label="Tài xế thực hiện *" value="Nguyễn Văn Tài" required isEditing={isEditing} />
             <InputGroup label="SĐT Tài xế" value="0911222333" isEditing={isEditing} />
          </div>

          <div className="grid grid-cols-3 gap-4 items-end">
            <InputGroup label="Khoảng cách (Ước tính)" value="8" suffix="KM" isEditing={isEditing} />
            <div className="col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Điểm kéo về (Destination) *</label>
              <div className="flex gap-2">
                 <input disabled={!isEditing} className="w-full px-3 py-1.5 border border-slate-200 rounded text-[11px] font-medium" defaultValue="Phường Việt Hưng, Quận Long Biên, Hà Nội" />
                 <button className="bg-[#00a651] text-white px-5 py-1.5 rounded text-[10px] font-black uppercase shadow-sm">Bản đồ</button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Dịch vụ thực tế & Chi phí</p>
             <div className="grid grid-cols-2 gap-4">
                {[ {name: "Xe hết pin", price: "200,000"}, {name: "Kích bình ắc quy", price: "100,000"} ].map((s, i) => (
                  <div key={i} className="p-3.5 border border-slate-100 rounded-xl flex items-center justify-between bg-slate-50/50 shadow-sm">
                    <div>
                      <p className="text-[12px] font-black text-slate-800">{s.name}</p>
                      <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Hạng mục cứu hộ</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase">Chi phí (VNĐ):</span>
                        <input disabled={!isEditing} className="w-28 px-3 py-1.5 border border-slate-200 rounded-lg text-right font-black text-[12px] text-emerald-600 bg-white shadow-inner" defaultValue={s.price} />
                      </div>
                    </div>
                  </div>
                ))}
             </div>
             <div className="flex justify-end">
                <button className="bg-[#00a651] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 shadow-md hover:shadow-emerald-700/20">
                  <span className="text-xl leading-none font-light">+</span> Thêm dịch vụ thực tế
                </button>
             </div>
          </div>

          {/* COMPLEX PRICING TABLES */}
          <div className="space-y-6 pt-4">
            {/* PRICING 1: GIÁ CỐ ĐỊNH */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 border-b-0 rounded-t-lg">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Giá cố định</span>
                <div className="ml-auto flex items-center gap-2">
                   <span className="text-[9px] font-bold text-slate-400">GIÁ CỐ ĐỊNH:</span>
                   <span className="text-[12px] font-black text-slate-900">600,000</span>
                </div>
              </div>
              <div className="overflow-hidden border border-slate-100 rounded-b-xl shadow-sm">
                <table className="w-full text-left text-[11px]">
                   <thead className="bg-slate-50 border-b border-slate-100">
                     <tr className="text-slate-400 font-bold uppercase tracking-tighter">
                       <th className="px-4 py-2.5 border-r border-slate-100 w-12 text-center">STT</th>
                       <th className="px-4 py-2.5 border-r border-slate-100">Loại</th>
                       <th className="px-4 py-2.5 border-r border-slate-100">Khoảng cách</th>
                       <th className="px-4 py-2.5 border-r border-slate-100 text-center">Ngưỡng trọng tải</th>
                       <th className="px-4 py-2.5 border-r border-slate-100 text-right">Giá cố định</th>
                       <th className="px-4 py-2.5 border-r border-slate-100 text-right">Giá thêm/1km</th>
                       <th className="px-4 py-2.5 text-right bg-emerald-50 text-emerald-700">Thành tiền</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     <tr className="bg-white">
                       <td className="px-4 py-3 border-r border-slate-50 text-center text-slate-300 font-bold">1</td>
                       <td className="px-4 py-3 border-r border-slate-50 font-black text-slate-700">Khoảng cách(km)</td>
                       <td className="px-4 py-3 border-r border-slate-50 font-medium">20.00km - 40.00km</td>
                       <td className="px-4 py-3 border-r border-slate-50 text-center text-slate-400">---</td>
                       <td className="px-4 py-3 border-r border-slate-50 text-right font-black text-slate-700">600,000</td>
                       <td className="px-4 py-3 border-r border-slate-50 text-right font-medium">0</td>
                       <td className="px-4 py-3 text-right font-black text-slate-900 bg-emerald-50/30">0</td>
                     </tr>
                   </tbody>
                </table>
              </div>
            </div>

            {/* PRICING 2: HỆ SỐ ĐIỀU CHỈNH */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 border-b-0 rounded-t-lg">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Hệ số điều chỉnh</span>
                <button className="ml-auto w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm font-light hover:border-emerald-500 hover:text-emerald-500 transition-colors shadow-sm">+</button>
              </div>
              <div className="overflow-hidden border border-slate-100 rounded-b-xl shadow-sm">
                <table className="w-full text-left text-[11px]">
                   <thead className="bg-slate-50 border-b border-slate-100">
                     <tr className="text-slate-400 font-bold uppercase tracking-tighter">
                       <th className="px-4 py-2.5 border-r border-slate-100 w-12 text-center">STT</th>
                       <th className="px-4 py-2.5 border-r border-slate-100 w-16 text-center">Thao tác</th>
                       <th className="px-4 py-2.5 border-r border-slate-100">Loại điều chỉnh</th>
                       <th className="px-4 py-2.5 border-r border-slate-100">Chi tiết</th>
                       <th className="px-4 py-2.5 border-r border-slate-100 text-center">Hệ số</th>
                       <th className="px-4 py-2.5 text-right bg-emerald-50 text-emerald-700">Thành tiền</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {[
                       { type: "Thời gian", detail: "Ban ngày", factor: "1.0", total: "600,000" },
                       { type: "Thời tiết", detail: "Bình thường", factor: "2.5", total: "1,500,000", isRed: true },
                       { type: "Khu vực", detail: "Nội thành", factor: "1.4", total: "840,000" },
                       { type: "Trọng tải xe KH", detail: "<= 1.4 tấn", factor: "1.3", total: "780,000" }
                     ].map((row, i) => (
                       <tr key={i} className="group">
                         <td className="px-4 py-2.5 border-r border-slate-50 text-center text-slate-300 font-bold">{i+1}</td>
                         <td className="px-4 py-2.5 border-r border-slate-50 text-center">
                            <button className="p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-colors"><svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                         </td>
                         <td className="px-4 py-2.5 border-r border-slate-50 font-black text-slate-600 uppercase text-[10px] tracking-tight">{row.type}</td>
                         <td className="px-4 py-2.5 border-r border-slate-50">
                           <div className="relative">
                              <select className="w-full bg-transparent border-none outline-none font-bold text-slate-800 appearance-none pr-6 cursor-pointer">
                                {row.detail && <option>{row.detail}</option>}
                              </select>
                              <svg className="w-3.5 h-3.5 absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" /></svg>
                           </div>
                         </td>
                         <td className={`px-4 py-2.5 border-r border-slate-50 text-center font-black ${row.isRed ? 'text-orange-600 bg-orange-50/20' : 'text-slate-800'}`}>{row.factor}</td>
                         <td className={`px-4 py-2.5 text-right font-black ${row.isRed ? 'text-red-600 bg-red-50/10' : 'text-slate-800'}`}>{row.total}</td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>

            {/* PRICING 3: GIÁ TRẦN */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 border-b-0 rounded-t-lg">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Giá trần</span>
              </div>
              <div className="overflow-hidden border border-slate-100 rounded-b-xl shadow-sm">
                <table className="w-full text-left text-[11px]">
                   <thead className="bg-slate-50 border-b border-slate-100">
                     <tr className="text-slate-400 font-bold uppercase tracking-tighter">
                       <th className="px-4 py-2.5 border-r border-slate-100 w-12 text-center">STT</th>
                       <th className="px-4 py-2.5 border-r border-slate-100">Loại</th>
                       <th className="px-4 py-2.5 border-r border-slate-100">Khoảng cách</th>
                       <th className="px-4 py-2.5 text-right bg-emerald-50 text-emerald-700">Giá max</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr className="bg-white">
                       <td className="px-4 py-3 border-r border-slate-50 text-center text-slate-300 font-bold">1</td>
                       <td className="px-4 py-3 border-r border-slate-50 font-black text-slate-700">Theo sự vụ</td>
                       <td className="px-4 py-3 border-r border-slate-50 text-slate-400">---</td>
                       <td className="px-4 py-3 text-right font-black text-slate-900 bg-emerald-50/30">2,000,000</td>
                     </tr>
                   </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FINANCIAL SUMMARY GRID */}
          <div className="grid grid-cols-2 gap-x-24 pt-8 border-t border-slate-100">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Chi phí tạm tính *</span>
                <div className="flex items-center gap-4">
                  <span className="text-[16px] font-black text-slate-900 tracking-tight">400,000</span>
                  <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 shadow-lg shadow-blue-700/10 active:scale-95 transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Tính lại chi phí cứu hộ
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between py-4 px-6 bg-red-50 border border-red-100 rounded-xl shadow-inner">
                <span className="text-[12px] font-black text-red-600 uppercase tracking-widest">Tổng thanh toán (KH)</span>
                <span className="text-[26px] font-black text-red-600 tracking-tighter">432,000</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
               <InputGroup label="Phí phát sinh (Nếu có)" value="0" isEditing={isEditing} suffix="VNĐ" type="number" />
               <InputGroup label="Thuế VAT (%)" value="8" suffix="%" isEditing={isEditing} type="number" />
               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tiền đã cọc</label>
                  <input className="w-full px-4 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-right text-[12px] rounded-xl shadow-inner" defaultValue="50,000" disabled />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Còn lại phải thu</label>
                  <input className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-900 font-black text-right text-[12px] rounded-xl shadow-inner" defaultValue="382,000" disabled />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. QUÁ TRÌNH CỨU HỘ */}
      <section id="section-3" className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden h-[550px] flex flex-col">
        <SectionHeader number={3} title="Quá trình cứu hộ (Theo dõi thời gian thực)" />
        <div className="flex-1 flex">
           {/* MAP MOCKUP */}
           <div className="flex-[2] relative bg-slate-200 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=21.0285,105.8452&zoom=15&size=1000x600&sensor=false&markers=color:red%7C21.0285,105.8452&markers=color:blue%7C21.0350,105.8600')] bg-cover bg-center"></div>
              {/* Map Floating Indicator */}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-white flex items-center gap-3 animate-in slide-in-from-left duration-500">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200">
                  <svg className="w-6 h-6 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Vị trí xe cứu hộ</p>
                  <p className="text-[12px] font-black text-slate-800">Cách hiện trường 2.5 km</p>
                </div>
              </div>
              {/* Map Zoom Controls Mock */}
              <div className="absolute bottom-6 right-6 flex flex-col gap-1">
                 <button className="w-9 h-9 bg-white shadow-xl rounded-t-lg flex items-center justify-center font-bold text-slate-600">+</button>
                 <button className="w-9 h-9 bg-white shadow-xl rounded-b-lg flex items-center justify-center font-bold text-slate-600">-</button>
              </div>
           </div>
           
           {/* LOG TIMELINE */}
           <div className="flex-1 flex flex-col border-l border-slate-100 bg-white">
              <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Nhật ký hành trình</h4>
                <button className="text-[10px] font-black text-blue-600 hover:underline uppercase">Chi tiết GPS</button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
                 {[
                   { status: 'CỨU HỘ ĐANG THỰC HIỆN', desc: 'Xe cứu hộ đã đến hiện trường và đang xử lý lỗi ắc quy.', time: '02/02/2026 14:15:00', active: true },
                   { status: 'ĐANG DI CHUYỂN', desc: 'Bắt đầu di chuyển từ trạm cứu hộ Hà Nội.', time: '02/02/2026 14:00:30' },
                   { status: 'TÀI XẾ ĐÃ NHẬN ĐƠN', desc: 'Hệ thống ghi nhận tài xế Nguyễn Văn Tài tiếp nhận đơn hàng.', time: '02/02/2026 13:55:12' },
                 ].map((item, i) => (
                   <div key={i} className="relative pl-8">
                     <div className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${item.active ? 'bg-emerald-500 ring-4 ring-emerald-500/10' : 'bg-blue-500'}`}></div>
                     {i < 2 && <div className="absolute left-[6.5px] top-6 w-px h-[calc(100%+8px)] bg-slate-100"></div>}
                     <div className="space-y-1">
                       <p className={`text-[10px] font-black uppercase tracking-tight ${item.active ? 'text-emerald-600' : 'text-blue-600'}`}>{item.status}</p>
                       <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                       <div className="flex items-center gap-1.5 pt-0.5">
                          <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{item.time}</p>
                       </div>
                     </div>
                   </div>
                 ))}
              </div>
              <div className="p-4 border-t border-slate-50">
                 <button className="w-full py-3 bg-[#00a651] text-white text-[11px] font-black uppercase rounded-xl shadow-lg shadow-emerald-700/10 hover:shadow-emerald-700/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Cập nhật trạng thái thủ công
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* 4. HÌNH ẢNH SỰ CỐ */}
      <section id="section-4" className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <SectionHeader number={4} title="Hình ảnh sự cố & Quá trình thực hiện" />
        <div className="p-6 space-y-10">
           {[ 
             { label: 'HIỆN TRƯỜNG SỰ CỐ', count: 5, img: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=400', color: 'bg-orange-500' },
             { label: 'QUÁ TRÌNH XỬ LÝ', count: 10, img: 'https://images.unsplash.com/photo-1530046339160-ce3e5b0c7a2f?auto=format&fit=crop&q=80&w=400', color: 'bg-blue-500' },
             { label: 'HOÀN TẤT CỨU HỘ', count: 5, img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400', color: 'bg-emerald-500' }
           ].map((row, i) => (
             <div key={i} className="space-y-4">
                <div className="flex items-center justify-between border-l-4 border-slate-100 pl-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${row.color}`}></div>
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{row.label}</span>
                  </div>
                  <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 uppercase tracking-widest">Tối đa {row.count} ảnh</span>
                </div>
                <div className="flex gap-4 pl-4 overflow-x-auto pb-2 scrollbar-thin">
                   <div className="relative group shrink-0">
                      <img src={row.img} className="w-32 h-32 object-cover rounded-xl shadow-md border-2 border-slate-100 group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                         <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </div>
                   </div>
                   {isEditing && (
                     <button className="w-32 h-32 border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all gap-1 shadow-inner shrink-0">
                       <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                       <span className="text-[9px] font-black uppercase">Tải ảnh</span>
                     </button>
                   )}
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* 5. THÔNG TIN GIÁM SÁT, THỰC THI */}
      <section id="section-5" className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <SectionHeader number={5} title="Thông tin giám sát, thực thi" />
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-8">
            <InputGroup label="Mã tham chiếu VETC RSA" value={order.orderCode} disabled isEditing={isEditing} />
            <div className="space-y-2">
               <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Đánh giá chất lượng dịch vụ</label>
               <div className="flex items-center gap-4 h-9 bg-slate-50/50 px-4 rounded-xl border border-slate-100">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => <svg key={s} className={`w-5 h-5 ${s <= 4 ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                  </div>
                  <div className="h-4 w-px bg-slate-200"></div>
                  <span className="text-[13px] font-black text-slate-700 tracking-tight">4.0 / 5.0</span>
               </div>
            </div>
            <InputGroup label="Ghi chú NPS (Phản hồi khách hàng)" value="" placeholder="Khách hàng có hài lòng về thời gian và thái độ tài xế không?" isEditing={isEditing} />
          </div>
          <div className="grid grid-cols-3 gap-8">
             <div className="space-y-2">
               <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Phân loại khiếu nại (Nếu có)</label>
               <select disabled={!isEditing} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 outline-none">
                 <option>Không có</option>
                 <option>Thái độ phục vụ</option>
                 <option>Thời gian chậm trễ</option>
                 <option>Giá cả phát sinh</option>
               </select>
             </div>
             <div className="col-span-2 space-y-2">
               <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Nội dung chi tiết xử lý khiếu nại</label>
               <textarea disabled={!isEditing} className="w-full p-4 border border-slate-200 rounded-xl text-[12px] font-medium min-h-[80px] outline-none placeholder:text-slate-300 shadow-inner focus:border-emerald-500 transition-all" placeholder="Ghi nhận nội dung phản ánh và hướng giải quyết của điều phối viên..."></textarea>
             </div>
          </div>
        </div>
      </section>

      {/* 6. THÔNG TIN HÓA ĐƠN */}
      <section id="section-6" className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-12">
        <SectionHeader number={6} title="Thông tin hóa đơn" />
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-4 gap-6">
             <div className="space-y-2">
               <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Phân loại khách hàng *</label>
               <select disabled={!isEditing} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-[12px] font-black text-emerald-600 bg-emerald-50 shadow-sm outline-none">
                 <option>Cá nhân</option>
                 <option>Doanh nghiệp</option>
               </select>
             </div>
             <InputGroup label="Tên doanh nghiệp / Công ty" value="" placeholder="Nhập tên đầy đủ của công ty..." isEditing={isEditing} />
             <InputGroup label="Mã số thuế" value="" placeholder="Nhập MST..." isEditing={isEditing} />
             <InputGroup label="Email nhận hóa đơn" value="" placeholder="email@company.com" isEditing={isEditing} />
          </div>
          <InputGroup label="Địa chỉ xuất hóa đơn" value="" placeholder="Nhập địa chỉ chính xác trên giấy phép kinh doanh..." isEditing={isEditing} />
          
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-3 text-[#4285f4] bg-blue-50/50 p-4 rounded-xl border border-blue-100 shadow-inner">
               <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <p className="text-[11px] font-bold leading-relaxed">Hóa đơn điện tử sẽ được gửi tự động qua email sau khi đơn hàng được xác nhận thanh toán thành công và hoàn tất cứu hộ. Vui lòng kiểm tra kỹ thông tin pháp nhân trước khi lưu.</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
               <button className="px-8 py-2.5 border border-blue-200 text-blue-600 text-[11px] font-black rounded-lg hover:bg-blue-50 transition-all uppercase flex items-center gap-2.5 shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Xem trước hóa đơn
               </button>
               <button className="px-10 py-2.5 bg-blue-600 text-white text-[11px] font-black rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-700/20 active:scale-95 transition-all uppercase flex items-center gap-2.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  Xuất hóa đơn
               </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderDetail;
