
import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '../types';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  userRole: UserRole;
  currentUser: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle, userRole, currentUser }) => {
  return (
    <>
      {/* Backdrop for Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] transition-opacity duration-300"
          onClick={toggle}
        />
      )}
      
      <aside className={`fixed top-0 left-0 h-full ${isOpen ? 'translate-x-0 w-[250px]' : '-translate-x-full w-[250px]'} transition-transform duration-300 bg-white border-r border-slate-200 text-slate-700 flex flex-col shrink-0 overflow-hidden z-[80] shadow-2xl`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="w-8 h-8 bg-[#00a651] rounded flex items-center justify-center shrink-0">
          <span className="text-white font-black text-lg">V</span>
        </div>
        <span className="ml-3 font-bold text-lg text-slate-800 tracking-tight">VETC</span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {/* Đã xóa khối thông tin User tại đây */}

        <div className="group">
          <button className="w-full flex items-center px-3 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <svg className="w-4 h-4 mr-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Quản trị hệ thống</span>
            <svg className="w-3.5 h-3.5 ml-auto opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="space-y-1">
          <div className="w-full flex items-center px-3 py-2.5 text-[13px] font-bold text-white bg-[#00a651] rounded-lg shadow-sm">
            <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>Chăm sóc khách hàng</span>
          </div>
          <div className="pl-4 space-y-1">
            <NavLink 
              to="/order-management"
              className={({ isActive }) => `flex items-center w-full gap-3 py-2 px-6 text-[12px] font-medium transition-colors ${isActive ? 'text-[#00a651] font-bold' : 'text-slate-500 hover:text-[#00a651]'}`}
            >
              <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              Quản lý đơn hàng
            </NavLink>
          </div>
        </div>

        <div className="space-y-1 pt-2">
          <div className="w-full flex items-center px-3 py-2.5 text-[13px] font-medium text-slate-600 bg-slate-50/50 rounded-lg">
            <svg className="w-4 h-4 mr-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            <span>Giám sát cứu hộ</span>
          </div>
          <div className="pl-4 space-y-1">
            <NavLink 
              to="/rescue-supervision"
              className={({ isActive }) => `flex items-center w-full gap-3 py-2 px-6 text-[12px] font-medium transition-colors border-r-2 ${isActive ? 'text-[#00a651] font-bold bg-emerald-50/50 border-[#00a651]' : 'text-slate-500 hover:text-[#00a651] border-transparent'}`}
            >
              <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              Giám sát
            </NavLink>
            <NavLink 
              to="/active-support"
              className={({ isActive }) => `flex items-center w-full gap-3 py-2 px-6 text-[12px] font-medium transition-colors border-r-2 ${isActive ? 'text-[#00a651] font-bold bg-blue-50/50 border-[#00a651]' : 'text-slate-500 hover:text-[#00a651] border-transparent'}`}
            >
              <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Đang hỗ trợ
            </NavLink>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 font-medium">PHIÊN BẢN 2.4.0 • 02/02/2026</p>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
