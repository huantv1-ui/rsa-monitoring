
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-[60px] bg-[#f8f9fa] border-b border-emerald-500 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <span className="text-emerald-600 font-bold text-3xl italic tracking-tighter">VETC</span>
          <span className="ml-2 text-emerald-600 font-medium text-lg uppercase tracking-wide">- CỔNG THÔNG TIN DÀNH CHO ĐẠI LÝ</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 cursor-pointer hover:bg-slate-100 p-2 rounded transition-colors">
          <span className="text-sm text-slate-600">rsa_test1</span>
          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
