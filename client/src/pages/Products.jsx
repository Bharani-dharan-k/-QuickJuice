import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as productsApi from '../api/products.api';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterAvailable, setFilterAvailable] = useState(false);

  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsApi.getProducts();
        
        // Handle both response formats
        // If response is { data: [...] }, use response.data
        // If response is { data: { data: [...] } }, use response.data.data
        let productsData;
        if (Array.isArray(response.data)) {
          productsData = response.data;
        } else if (Array.isArray(response.data?.data)) {
          productsData = response.data.data;
        } else if (response.data) {
          productsData = [response.data];
        } else {
          productsData = [];
        }
        
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAvailability = !filterAvailable || product.isAvailable;
      return matchesSearch && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0);
        case 'price-high':
          return (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0);
        case 'rating':
          return (b.ratings?.average || 0) - (a.ratings?.average || 0);
        default:
          return 0;
      }
    });

  const handleAddToCart = async (product) => {
    try {
      const variant = product.variants[0];
      await addItem({
        productId: product._id,
        variantId: variant._id,
        quantity: 1
      });
      // Success toast is shown by the store
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      // Error toast is shown by the store
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Fresh Orange Juices</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our range of cold-pressed orange juices</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filterAvailable} 
                  onChange={(e) => setFilterAvailable(e.target.checked)} 
                  className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500" 
                />
                <span className="ml-2 text-gray-700">Available only</span>
              </label>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </motion.div>
        
        {filteredProducts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-xl text-gray-600">No products found</p>
            <button 
              onClick={() => { setSearchTerm(''); setFilterAvailable(false); }} 
              className="mt-4 text-orange-600 hover:text-orange-700 font-semibold"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product._id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.05 }} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <Link to={`/products/${product.slug}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0].url || product.images[0]} 
                        alt={product.images[0].alt || product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <span className="text-6xl">🍊</span>
                      </div>
                    )}
                    {!product.isAvailable && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Out of Stock
                      </div>
                    )}
                    {product.discount && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {product.discount.value}% OFF
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.round(product.ratings?.average || 0))}
                      {'☆'.repeat(5 - Math.round(product.ratings?.average || 0))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">({product.ratings?.count || 0})</span>
                  </div>
                  
                  <div className="mb-4">
                    {product.variants && product.variants.length > 1 ? (
                      <p className="text-xl font-bold text-gray-900">
                        ${product.variants[0]?.price || 0} - ${product.variants[product.variants.length - 1]?.price || 0}
                      </p>
                    ) : (
                      <p className="text-xl font-bold text-gray-900">
                        ${product.variants?.[0]?.price || 0}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      {product.variants?.map(v => v.size).join(', ') || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link 
                      to={`/products/${product.slug}`} 
                      className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors text-center font-semibold"
                    >
                      View Details
                    </Link>
                    <button 
                      onClick={() => handleAddToCart(product)} 
                      disabled={!product.isAvailable} 
                      className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                        product.isAvailable 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;