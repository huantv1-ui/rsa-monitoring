
import React, { useState, useEffect } from 'react';
import { Order } from '../types';

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
  initialEditMode: boolean;
  scrollToId?: string | null;
  onSave: (updatedOrder: Order) => void;
}

const SectionHeader: React.FC<{ number: number; title: string; id?: string }> = ({ number, title, id }) => (
  <div id={id} className="bg-[#00a651] px-4 py-2.5 flex items-center gap-3 shadow-sm rounded-t-lg">
    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white text-[11px] font-black border border-white/20">
      {number}
    </div>
    <h3 className="text-white font-bold text-[13px] uppercase tracking-wider">{title}</h3>
    <div className="ml-auto">
      <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

const InputGroup: React.FC<{ label: string; value: string; required?: boolean; placeholder?: string; suffix?: string; disabled?: boolean; isEditing?: boolean; className?: string }> = ({ label, value, required, placeholder, suffix, disabled, isEditing, className }) => (
  <div className={`space-y-1 ${className}`}>
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input 
        disabled={disabled || !isEditing}
        className={`w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-[11px] outline-none transition-all font-medium text-slate-800 ${(!isEditing || disabled) ? 'bg-slate-50 text-slate-400' : 'hover:border-emerald-300 focus:border-emerald-500'}`}
        defaultValue={value}
        placeholder={placeholder}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">{suffix}</span>
      )}
    </div>
  </div>
);

const OrderDetail: React.FC<OrderDetailProps> = ({ order, onBack, initialEditMode, scrollToId, onSave }) => {
  const [isEditing, setIsEditing] = useState(initialEditMode);

  useEffect(() => {
    if (scrollToId) {
      setTimeout(() => {
        const element = document.getElementById(scrollToId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [scrollToId]);

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto pb-20 bg-[#f8fafc]">
      {/* Sticky Header Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-12">
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">MÃ ĐƠN HÀNG (CỐ ĐỊNH)</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900">{order.orderCode}</span>
              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-500 text-[8px] font-black rounded border border-blue-100 uppercase">HỆ THỐNG</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">TRẠNG THÁI HIỆN TẠI</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-[11px] font-bold text-orange-600 uppercase">Đang thực hiện cứu hộ</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-red-200 text-red-600 text-[11px] font-black rounded hover:bg-red-50 transition-all uppercase flex items-center gap-2">
             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
             Hủy đơn
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-2 bg-[#00a651] text-white text-[11px] font-black rounded hover:bg-[#009245] transition-all uppercase flex items-center gap-2 shadow-lg shadow-emerald-700/10"
          >
             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
             Cập nhật
          </button>
        </div>
      </div>

      {/* 1. Thông tin khách hàng liên hệ */}
      <section className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <SectionHeader number={1} title="Thông tin khách hàng liên hệ" />
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <InputGroup label="Tên KH liên hệ" value={order.customer.name} required isEditing={isEditing} />
            <InputGroup label="SĐT" value={order.customer.phone} required isEditing={isEditing} />
            <InputGroup label="Tên KH gặp sự cố" value={order.customer.name} isEditing={isEditing} />
            <InputGroup label="SĐT" value={order.customer.phone} isEditing={isEditing} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <InputGroup label="Biển số xe" value={order.vehicle.plate} required isEditing={isEditing} />
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
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Vị trí cứu hộ <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input disabled={!isEditing} className={`w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-[11px] pr-8 ${!isEditing ? 'bg-slate-50' : ''}`} defaultValue={order.address} />
                  <svg className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                </div>
                <button className="bg-[#00a651] text-white px-3 py-1.5 rounded text-[10px] font-black uppercase flex items-center gap-1 shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Chọn trên bản đồ
                </button>
              </div>
            </div>
            <InputGroup label="Kinh độ / Vĩ độ" value="21.0285" required isEditing={isEditing} />
            <div className="pt-4">
               <input className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-400" defaultValue="105.8452" disabled />
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Gói dịch vụ</label>
              <div className="relative">
                <input disabled className="w-full px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded text-[11px] font-bold text-emerald-600" defaultValue="Gói cơ bản 10 dịch vụ" />
                <svg className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
            <button className="text-blue-600 text-[10px] font-bold underline mb-2">Chi tiết gói</button>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Dịch vụ yêu cầu <span className="text-red-500">*</span></label>
             <div className="relative max-w-2xl">
                <input className="w-full px-3 py-2 border border-slate-200 rounded text-[11px] pl-8 outline-none" placeholder="Tìm kiếm dịch vụ (VETC hoặc Nhà cung cấp)..." />
                <svg className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <svg className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
             </div>
             <div className="flex gap-2 pt-1">
                {["Xe hết pin (Khác)", "Kích bình ắc quy (VETC)", "Đâm, lật, tai nạn (Khác)"].map((s, i) => (
                  <span key={i} className={`px-2 py-1 rounded-full text-[9px] font-bold border flex items-center gap-1.5 ${i===1 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                    {s} <span className="opacity-50 cursor-pointer">✕</span>
                  </span>
                ))}
             </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tình trạng sự cố thực tế</label>
            <textarea className="w-full p-3 border border-slate-200 rounded text-[11px] min-h-[60px] outline-none" defaultValue="như trên"></textarea>
          </div>

          <div className="flex justify-end pt-2">
            <button className="bg-[#00a651] text-white px-6 py-2 rounded text-[11px] font-black uppercase flex items-center gap-2 shadow-md hover:bg-[#009245] transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              Xác nhận thông tin khách hàng
            </button>
          </div>

          {/* AI SUGGESTION BOX */}
          <div className="bg-[#fff9e6] border border-[#ffeeba] rounded-lg p-4 space-y-3">
             <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#ffc107]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                <span className="text-[11px] font-black text-[#856404] uppercase tracking-wider">Đề xuất từ hệ thống RSA-AI</span>
             </div>
             <div className="space-y-2 text-[11px] text-[#856404] leading-relaxed">
                <p><span className="font-bold">[PHÂN TÍCH AI]:</span> Hệ thống ghi nhận sự cố chưa xác định rõ nguyên nhân cơ bản. Cần thực hiện kiểm tra tổng quát tại hiện trường.</p>
                <p><span className="font-bold">[DỊCH VỤ ĐỀ XUẤT]:</span></p>
                <p className="pl-4">- Sửa chữa tại chỗ (Mobile Mechanic): 250,000 VNĐ</p>
                <p><span className="font-bold">[HƯỚNG DẪN XỬ LÝ]:</span> Kỹ thuật viên kiểm tra lỗi qua cổng OBD-II, xác định các mã lỗi hệ thống và đưa ra phương án xử lý cụ thể cho khách hàng.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 2. Thông tin điều phối cứu hộ & Đối tác */}
      <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <SectionHeader number={2} title="Thông tin điều phối cứu hộ & Đối tác" />
        <div className="p-4 space-y-6">
          <div className="flex items-center gap-3">
            <button className="bg-[#00a651] text-white px-4 py-2 rounded text-[11px] font-black uppercase flex items-center gap-2 shadow-sm">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               Điều phối tự động
            </button>
            <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded text-[11px] font-black uppercase flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
               Điều phối thủ công
            </button>
            <span className="text-[10px] text-slate-400 italic">Hệ thống sẽ gợi ý trạm gần nhất dựa trên vị trí sự cố</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <InputGroup label="Đối tác cung cấp" value="CARPLA - CARPLA SERVICE" required isEditing={isEditing} />
             <InputGroup label="Trạm cứu hộ cụ thể" value="Carpla Service - CN Hà Nội" required isEditing={isEditing} />
          </div>

          <div className="grid grid-cols-4 gap-4">
             <InputGroup label="Loại xe cứu hộ" value="Xe kéo cẩu" isEditing={isEditing} />
             <InputGroup label="Biển số xe cứu hộ" value="30G-888.88" isEditing={isEditing} />
             <InputGroup label="Tài xế thực hiện" value="Nguyễn Văn Tài" isEditing={isEditing} />
             <InputGroup label="SĐT Tài xế" value="0911222333" isEditing={isEditing} />
          </div>

          <div className="grid grid-cols-3 gap-4 items-end">
            <InputGroup label="Khoảng cách (Ước tính)" value="8" suffix="KM" isEditing={isEditing} />
            <div className="col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Điểm kéo về (Destination) <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                 <input className="w-full px-3 py-1.5 border border-slate-200 rounded text-[11px]" defaultValue="Phường Việt Hưng, Quận Long Biên, Hà Nội" />
                 <button className="bg-[#00a651] text-white px-4 py-1.5 rounded text-[10px] font-black uppercase">Bản đồ</button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dịch vụ thực tế & Chi phí</p>
             <div className="grid grid-cols-2 gap-4">
                {[ {name: "Xe hết pin", price: "200,000"}, {name: "Kích bình ắc quy", price: "100,000"} ].map((s, i) => (
                  <div key={i} className="p-3 border border-slate-100 rounded-lg flex items-center justify-between bg-slate-50/30">
                    <div>
                      <p className="text-[11px] font-bold text-slate-800">{s.name}</p>
                      <p className="text-[8px] text-slate-400 font-bold uppercase">Hạng mục cứu hộ</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Chi phí (VNĐ):</span>
                        <input className="w-24 px-2 py-1 border border-slate-200 rounded text-right font-black text-[11px]" defaultValue={s.price} />
                      </div>
                    </div>
                  </div>
                ))}
             </div>
             <div className="flex justify-end">
                <button className="bg-[#00a651] text-white px-3 py-1.5 rounded text-[10px] font-black uppercase flex items-center gap-1.5">
                  <span className="text-lg leading-none">+</span> Thêm dịch vụ thực tế
                </button>
             </div>
          </div>

          {/* Pricing Details Table */}
          <div className="space-y-4 pt-4">
            {/* Table: Giá cố định */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 border-b-0 rounded-t-lg">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                <span className="text-[10px] font-black text-slate-600 uppercase">Giá cố định</span>
              </div>
              <div className="overflow-hidden border border-slate-100 rounded-b-lg">
                <table className="w-full text-left text-[10px]">
                   <thead className="bg-slate-50 border-b border-slate-100">
                     <tr className="text-slate-500 font-bold">
                       <th className="px-4 py-2 border-r border-slate-100">STT</th>
                       <th className="px-4 py-2 border-r border-slate-100">Loại</th>
                       <th className="px-4 py-2 border-r border-slate-100">Khoảng cách</th>
                       <th className="px-4 py-2 border-r border-slate-100 text-center">Ngưỡng trọng tải</th>
                       <th className="px-4 py-2 border-r border-slate-100 text-right">Giá cố định</th>
                       <th className="px-4 py-2 border-r border-slate-100 text-right">Giá thêm/1km</th>
                       <th className="px-4 py-2 text-right">Thành tiền</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr className="border-b border-slate-50">
                       <td className="px-4 py-2 border-r border-slate-50">1</td>
                       <td className="px-4 py-2 border-r border-slate-50 font-medium">Khoảng cách(km)</td>
                       <td className="px-4 py-2 border-r border-slate-50">20.00km - 40.00km</td>
                       <td className="px-4 py-2 border-r border-slate-50 text-center">-</td>
                       <td className="px-4 py-2 border-r border-slate-50 text-right font-bold text-slate-700">600,000</td>
                       <td className="px-4 py-2 border-r border-slate-50 text-right">0</td>
                       <td className="px-4 py-2 text-right font-black text-slate-900">0</td>
                     </tr>
                   </tbody>
                </table>
              </div>
            </div>

            {/* Table: Hệ số điều chỉnh */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 border-b-0 rounded-t-lg">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                <span className="text-[10px] font-black text-slate-600 uppercase">Hệ số điều chỉnh</span>
                <div className="ml-auto w-5 h-5 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-400 text-xs">+</div>
              </div>
              <div className="overflow-hidden border border-slate-100 rounded-b-lg">
                <table className="w-full text-left text-[10px]">
                   <thead className="bg-slate-50 border-b border-slate-100">
                     <tr className="text-slate-500 font-bold">
                       <th className="px-4 py-2 border-r border-slate-100">STT</th>
                       <th className="px-4 py-2 border-r border-slate-100">Thao tác</th>
                       <th className="px-4 py-2 border-r border-slate-100">Loại điều chỉnh</th>
                       <th className="px-4 py-2 border-r border-slate-100">Chi tiết</th>
                       <th className="px-4 py-2 border-r border-slate-100 text-center">Hệ số</th>
                       <th className="px-4 py-2 text-right">Thành tiền</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {[
                       { type: "Thời gian", detail: "Ban ngày", factor: "1.0", total: "600,000" },
                       { type: "Thời tiết", detail: "Bình thường", factor: "2.5", total: "1,500,000", highlight: true },
                       { type: "Khu vực", detail: "Nội thành", factor: "1.4", total: "840,000" },
                       { type: "Trọng tải xe KH", detail: "<= 1.4 tấn", factor: "1.3", total: "780,000" }
                     ].map((row, i) => (
                       <tr key={i}>
                         <td className="px-4 py-1.5 border-r border-slate-50">{i+1}</td>
                         <td className="px-4 py-1.5 border-r border-slate-50 text-center">
                            <svg className="w-3.5 h-3.5 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                         </td>
                         <td className="px-4 py-1.5 border-r border-slate-50">{row.type}</td>
                         <td className="px-4 py-1.5 border-r border-slate-50">
                           <select className="w-full bg-transparent border-none outline-none">{row.detail && <option>{row.detail}</option>}</select>
                         </td>
                         <td className={`px-4 py-1.5 border-r border-slate-50 text-center font-black ${row.highlight ? 'text-orange-600' : 'text-slate-800'}`}>{row.factor}</td>
                         <td className={`px-4 py-1.5 text-right font-black ${row.highlight ? 'text-red-600' : 'text-slate-800'}`}>{row.total}</td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>

            {/* Table: Giá trần */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 border-b-0 rounded-t-lg">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                <span className="text-[10px] font-black text-slate-600 uppercase">Giá trần</span>
              </div>
              <div className="overflow-hidden border border-slate-100 rounded-b-lg">
                <table className="w-full text-left text-[10px]">
                   <thead className="bg-slate-50 border-b border-slate-100">
                     <tr className="text-slate-500 font-bold">
                       <th className="px-4 py-2 border-r border-slate-100">STT</th>
                       <th className="px-4 py-2 border-r border-slate-100">Loại</th>
                       <th className="px-4 py-2 border-r border-slate-100">Khoảng cách</th>
                       <th className="px-4 py-2 text-right">Giá max</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr className="border-b border-slate-50">
                       <td className="px-4 py-2 border-r border-slate-50">1</td>
                       <td className="px-4 py-2 border-r border-slate-50">Theo sự vụ</td>
                       <td className="px-4 py-2 border-r border-slate-50">-</td>
                       <td className="px-4 py-2 text-right font-black text-slate-800">2,000,000</td>
                     </tr>
                   </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pricing Summary Grid */}
          <div className="grid grid-cols-2 gap-x-24 pt-6 border-t border-slate-100">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Chi phí tạm tính <span className="text-red-500">*</span></span>
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-black text-slate-900">400,000</span>
                  <button className="bg-[#4285f4] text-white px-2 py-1 rounded text-[9px] font-black uppercase flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Tính lại chi phí cứu hộ
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 px-4 bg-red-50 border border-red-100 rounded">
                <span className="text-[11px] font-black text-red-600 uppercase">Tổng thanh toán (KH)</span>
                <span className="text-[20px] font-black text-red-600 tracking-tight">432,000</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <InputGroup label="Phí phát sinh (Nếu có)" value="0" isEditing={isEditing} />
               <InputGroup label="Thuế VAT (%)" value="8" suffix="%" isEditing={isEditing} />
               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tiền đã cọc</label>
                  <input className="w-full px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 font-black text-right text-[11px] rounded" defaultValue="50,000" disabled />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Còn lại phải thu</label>
                  <input className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-900 font-black text-right text-[11px] rounded" defaultValue="382,000" disabled />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quá trình cứu hộ */}
      <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden h-[500px] flex flex-col">
        <SectionHeader number={3} title="Quá trình cứu hộ (Theo dõi thời gian thực)" />
        <div className="flex-1 flex">
           <div className="flex-[2] relative bg-slate-200">
              <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=21.0285,105.8452&zoom=14&size=800x600&sensor=false')] bg-cover"></div>
              <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-xl border border-white flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Vị trí xe cứu hộ</p>
                  <p className="text-[10px] font-black text-slate-800">Cách hiện trường 2.5 km</p>
                </div>
              </div>
           </div>
           
           <div className="flex-1 flex flex-col border-l border-slate-100">
              <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-500 uppercase">Nhật ký hành trình</h4>
                <button className="text-[9px] font-bold text-blue-600">Chi tiết GPS</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
                 {[
                   { status: 'CỨU HỘ ĐANG THỰC HIỆN', desc: 'Xe cứu hộ đã đến hiện trường và đang xử lý lỗi ắc quy.', time: '02/02/2026 14:15:00', active: true },
                   { status: 'ĐANG DI CHUYỂN', desc: 'Bắt đầu di chuyển từ trạm cứu hộ Hà Nội.', time: '02/02/2026 14:00:30' },
                   { status: 'TÀI XẾ ĐÃ NHẬN ĐƠN', desc: 'Hệ thống ghi nhận tài xế Nguyễn Văn Tài tiếp nhận.', time: '02/02/2026 13:55:12' },
                 ].map((item, i) => (
                   <div key={i} className="relative pl-6">
                     <div className={`absolute left-0 top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${item.active ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-blue-500'}`}></div>
                     {i < 2 && <div className="absolute left-[4.5px] top-4 w-px h-10 bg-slate-100"></div>}
                     <div className="space-y-0.5">
                       <p className={`text-[9px] font-black uppercase ${item.active ? 'text-emerald-600' : 'text-blue-600'}`}>{item.status}</p>
                       <p className="text-[9px] text-slate-500 leading-relaxed">{item.desc}</p>
                       <p className="text-[8px] font-bold text-slate-300">{item.time}</p>
                     </div>
                   </div>
                 ))}
              </div>
              <div className="p-3">
                 <button className="w-full py-2 bg-[#00a651] text-white text-[10px] font-black uppercase rounded flex items-center justify-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Cập nhật trạng thái thủ công
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* 4. Hình ảnh sự cố */}
      <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <SectionHeader number={4} title="Hình ảnh sự cố & Quá trình thực hiện" />
        <div className="p-4 space-y-8">
           {[ 
             { label: 'HIỆN TRƯỜNG SỰ CỐ', count: 5, imgs: [
               'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=300',
               'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=300',
               'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=300',
               'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=300',
               'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=300'
             ] },
             { label: 'QUÁ TRÌNH XỬ LÝ', count: 5, imgs: [
               'https://images.unsplash.com/photo-1530046339160-ce3e5b0c7a2f?auto=format&fit=crop&q=80&w=300',
               'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=300',
               'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=300',
               'https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&q=80&w=300',
               'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=300'
             ] },
             { label: 'HOÀN TẤT CỨU HỘ', count: 5, imgs: [
               'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=300',
               'https://images.unsplash.com/photo-1562141989-c5c79ac8f576?auto=format&fit=crop&q=80&w=300',
               'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&q=80&w=300',
               'https://images.unsplash.com/photo-1578844541663-47139a33cce5?auto=format&fit=crop&q=80&w=300',
               'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=300'
             ] }
           ].map((row, i) => (
             <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${i===0 ? 'bg-orange-500' : i===1 ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                    <span className="text-[10px] font-black text-slate-700 uppercase">{row.label}</span>
                  </div>
                  <span className="text-[8px] font-black text-orange-600 uppercase">Tối đa {row.count}</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                   {row.imgs.map((img, idx) => (
                     <img key={idx} src={img} className="w-28 h-28 object-cover rounded shadow-sm border border-slate-100 shrink-0" referrerPolicy="no-referrer" />
                   ))}
                   {isEditing && (
                     <div className="w-28 h-28 border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-300 rounded shrink-0">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                     </div>
                   )}
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* 5. Thông tin giám sát, thực thi */}
      <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <SectionHeader number={5} title="Thông tin giám sát, thực thi" />
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <InputGroup label="Mã tham chiếu VETC RSA" value={order.orderCode} disabled isEditing={isEditing} />
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Đánh giá chất lượng dịch vụ</label>
               <div className="flex items-center gap-2 h-7">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => <svg key={s} className={`w-4 h-4 ${s <= 4 ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                  </div>
                  <span className="text-[11px] font-black text-slate-700">4.0 / 5.0</span>
               </div>
            </div>
            <InputGroup label="Ghi chỉ NPS (Phản hồi khách hàng)" value="" placeholder="Khách hàng có hài lòng về thời gian và thái độ tài xế không?" isEditing={isEditing} />
          </div>
          <div className="grid grid-cols-3 gap-4">
             <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Phân loại khiếu nại (Nếu có)</label>
               <select disabled className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px]">
                 <option>Không có</option>
               </select>
             </div>
             <div className="col-span-2 space-y-1">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Nội dung chi tiết xử lý khiếu nại</label>
               <textarea className="w-full p-2 border border-slate-200 rounded text-[11px] min-h-[40px] outline-none" placeholder="Ghi nhận nội dung phản ánh và hướng giải quyết của điều phối viên..."></textarea>
             </div>
          </div>
        </div>
      </section>

      {/* 6. Thông tin hóa đơn */}
      <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-12">
        <SectionHeader number={6} title="Thông tin hóa đơn" />
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-4 gap-4">
             <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Phân loại khách hàng <span className="text-red-500">*</span></label>
               <select className="w-full px-2 py-1.5 border border-slate-200 rounded text-[11px] font-bold">
                 <option>Cá nhân</option>
               </select>
             </div>
             <InputGroup label="Tên doanh nghiệp / Công ty" value="" placeholder="Nhập tên đầy đủ của công ty..." isEditing={isEditing} />
             <InputGroup label="Mã số thuế" value="" placeholder="Nhập MST..." isEditing={isEditing} />
             <InputGroup label="Email nhận hóa đơn" value="" placeholder="email@company.com" isEditing={isEditing} />
          </div>
          <InputGroup label="Địa chỉ xuất hóa đơn" value="" placeholder="Nhập địa chỉ chính xác trên giấy phép kinh doanh..." isEditing={isEditing} />
          
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2 text-blue-500 pt-2">
               <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <p className="text-[10px] font-bold leading-relaxed">Hóa đơn điện tử sẽ được gửi tự động qua email sau khi đơn hàng được xác nhận thanh toán thành công và hoàn tất cứu hộ. Vui lòng kiểm tra kỹ thông tin pháp nhân trước khi lưu.</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
               <button className="px-6 py-2 border border-blue-200 text-[#4285f4] text-[11px] font-black rounded hover:bg-blue-50 transition-all uppercase flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Xem trước hóa đơn
               </button>
               <button className="px-8 py-2 bg-[#1b64f2] text-white text-[11px] font-black rounded hover:bg-blue-700 shadow-lg shadow-blue-700/20 transition-all uppercase flex items-center gap-2">
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
