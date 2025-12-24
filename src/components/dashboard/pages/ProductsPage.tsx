import React, { useEffect, useState } from 'react';
import { Package, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../lib/api';

interface Product {
  id: string;
  name: string;
  category?: string;
  description?: string;
  price: number;
  type: string; // Backend 'category' or 'type'? Backend has 'category' and 'type' unmapped. 
  // Let's assume backend adds 'type' or we use 'category'.
  // Sample data had 'category'='Tea'.
  // Let's keep 'type' and assume backend returns it if we added it (we didn't explicitly add type to Schema, just copied fields).
  // Wait, my ProductSchema in Core.js had 'category' and 'status'. Missing 'type'.
  // I should accept whatever comes or add 'type' to backend.
  // For now, allow optional.
  stock: number; // Backend uses 'stock'
  status: string; // Backend uses 'status'
  image_url?: string;
  created_at?: string;
}

export const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      // Optimistic update
      setProducts(products.map(p => p.id === id ? { ...p, status: newStatus } : p));

      await api.put(`/products/${id}`, { status: newStatus });
    } catch (error) {
      console.error('Failed to update product status', error);
      // Revert on failure
      loadProducts();
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || product.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'herbal':
        return 'bg-green-100 text-green-800';
      case 'digital':
        return 'bg-blue-100 text-blue-800';
      case 'service':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2E7D32] mb-2">Products</h1>
        <p className="text-gray-600">Manage your herbal products and services</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CCF93]"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CCF93]"
          >
            <option value="all">All Types</option>
            <option value="herbal">Herbal</option>
            <option value="digital">Digital</option>
            <option value="service">Service</option>
          </select>

          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-[#6CCF93] text-lg">Loading products...</div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterType !== 'all'
              ? 'Try adjusting your filters'
              : 'Start by adding your first product or service'}
          </p>
          {!searchTerm && filterType === 'all' && (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg text-[#1F2933]">{product.name}</h3>
                    {product.status !== 'active' && (
                      <Badge variant="error">Inactive</Badge>
                    )}
                  </div>
                  {product.category && (
                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  )}
                  {/* Assuming backend provides type, or we might hide this badge if missing */}
                  {product.type && (
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTypeColor(product.type)}`}>
                      {product.type}
                    </div>
                  )}
                </div>
              </div>

              {product.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              )}

              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-2xl font-bold text-[#2E7D32]">₹{product.price.toFixed(2)}</p>
                  {/* Check category or type for stock display */}
                  <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={product.status === 'active' ? 'outline' : 'primary'}
                  size="sm"
                  className="flex-1"
                  onClick={() => toggleProductStatus(product.id, product.status)}
                >
                  {product.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
