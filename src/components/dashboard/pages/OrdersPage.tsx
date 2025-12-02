import React, { useEffect, useState } from 'react';
import { Package, Calendar, User, MapPin, Truck } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { ORDER_STATUS } from '../../../lib/constants';

type FilterTab = 'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered';

interface Order {
  id: string;
  quantity: number;
  total_amount: number;
  status: keyof typeof ORDER_STATUS;
  tracking_number?: string;
  order_date: string;
  patients: {
    full_name: string;
    email: string;
    phone?: string;
  };
  products: {
    name: string;
    price: number;
  };
}

export const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user, activeTab]);

  const loadOrders = async () => {
    if (!user) return;

    setLoading(true);
    let query = supabase
      .from('orders')
      .select('*, patients(full_name, email, phone), products(name, price)')
      .eq('doctor_id', user.id);

    if (activeTab !== 'all') {
      query = query.eq('status', activeTab);
    }

    const { data } = await query.order('order_date', { ascending: false });

    if (data) {
      setOrders(data as Order[]);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    loadOrders();
  };

  const getStatusVariant = (status: keyof typeof ORDER_STATUS) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'confirmed':
        return 'info';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2E7D32] mb-2">Orders</h1>
        <p className="text-gray-600">Manage product orders from patients</p>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { key: 'all' as FilterTab, label: 'All Orders' },
            { key: 'pending' as FilterTab, label: 'Pending' },
            { key: 'confirmed' as FilterTab, label: 'Confirmed' },
            { key: 'shipped' as FilterTab, label: 'Shipped' },
            { key: 'delivered' as FilterTab, label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === tab.key
                  ? 'text-[#2E7D32]'
                  : 'text-gray-600 hover:text-[#2E7D32]'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6CCF93]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-[#6CCF93] text-lg">Loading orders...</div>
        </div>
      ) : orders.length === 0 ? (
        <Card className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders found</h3>
          <p className="text-gray-500">
            {activeTab === 'all'
              ? "You don't have any orders yet"
              : `No ${activeTab} orders`}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-[#1F2933] mb-1">
                        {order.products.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Order ID: {order.id.slice(0, 8)}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(order.status)}>
                      {ORDER_STATUS[order.status]?.label || order.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-600">Customer</p>
                        <p className="font-medium text-[#1F2933]">{order.patients.full_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-600">Order Date</p>
                        <p className="font-medium text-[#1F2933]">
                          {new Date(order.order_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-600">Quantity</p>
                        <p className="font-medium text-[#1F2933]">{order.quantity}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-600">Total Amount</p>
                        <p className="font-medium text-[#2E7D32]">₹{order.total_amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {order.tracking_number && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <span className="font-medium">Tracking Number:</span> {order.tracking_number}
                      </p>
                    </div>
                  )}
                </div>

                <div className="lg:w-48 flex lg:flex-col gap-2">
                  {order.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        size="sm"
                        className="flex-1"
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        size="sm"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                      size="sm"
                      className="flex-1"
                    >
                      Mark as Shipped
                    </Button>
                  )}
                  {order.status === 'shipped' && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      size="sm"
                      className="flex-1"
                    >
                      Mark as Delivered
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
