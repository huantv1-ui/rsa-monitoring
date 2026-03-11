
import React from 'react';
import FilterPanel from '../components/FilterPanel';
import OrderTable from '../components/OrderTable';
import { Order, FilterState, UserRole } from '../types';

interface OrderManagementProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onSearch: () => void;
  onMySupport: () => void;
  onNotSupported: () => void;
  onClear: () => void;
  userRole: UserRole;
  filteredOrders: Order[];
  onVerifyClick: (order: Order) => void;
  onDetailClick: (order: Order) => void;
  onSupportClick: (order: Order) => void;
  onAssignClick: (order: Order) => void;
  onReassignOSA: (order: Order) => void;
  currentUser: string;
}

const OrderManagement: React.FC<OrderManagementProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onMySupport,
  onNotSupported,
  onClear,
  userRole,
  filteredOrders,
  onVerifyClick,
  onDetailClick,
  onSupportClick,
  onAssignClick,
  onReassignOSA,
  currentUser
}) => {
  return (
    <div className="p-4 space-y-4">
      <FilterPanel 
        filters={filters} 
        onFilterChange={onFilterChange} 
        onSearch={onSearch} 
        onMySupport={onMySupport}
        onNotSupported={onNotSupported}
        onClear={onClear}
        userRole={userRole}
      />
      <OrderTable 
        orders={filteredOrders} 
        onVerifyClick={onVerifyClick}
        onDetailClick={onDetailClick} 
        onSupportClick={onSupportClick}
        onAssignClick={onAssignClick}
        onReassignOSA={onReassignOSA}
        currentUser={currentUser}
        userRole={userRole}
      />
    </div>
  );
};

export default OrderManagement;
