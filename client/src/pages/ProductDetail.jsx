import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, ArrowLeft, Plus, Minus, Loader2 } from 'lucide-react';
import * as productsApi from '../api/products.api';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getProduct(slug);
      const productData = response.data?.data || response.data;
      setProduct(productData);
      if (productData.variants && productData.variants.length > 0) {
        setSelectedVariant(productData.variants[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    try {
      setAddingToCart(true);
      await addItem({
        productId: product._id,
        variantId: selectedVariant._id,
        quantity: quantity
      });
      toast.success(`Added ${quantity} ${product.name} to cart!`);
    } catch (error) {
      // Error toast is shown by the store
      console.error('Add to cart error:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (selectedVariant?.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-600 mb-4">Product not found</p>
        <Link to="/products" className="text-orange-600 hover:text-orange-700 font-semibold">
          Back to Products
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || 0;
  const discountedPrice = product.discount
    ? currentPrice * (1 - product.discount.value / 100)
    : currentPrice;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0].url || product.images[0]} 
                  alt={product.images[0].alt || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <span className="text-9xl">🍊</span>
                </div>
              )}
            </div>

            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {!product.isAvailable && (
                <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Out of Stock
                </div>
              )}
              {product.discount && (
                <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {product.discount.value}% OFF
                </div>
              )}
            </div>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`absolute top-4 left-4 p-3 rounded-full shadow-lg transition-colors ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold mb-3">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex text-yellow-400 text-xl">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(product.ratings.average) ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.ratings.average} ({product.ratings.count} reviews)
              </span>
            </div>

            <div className="mb-6">
              {product.discount ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-orange-600">${discountedPrice.toFixed(2)}</span>
                  <span className="text-2xl text-gray-400 line-through">${currentPrice.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-4xl font-bold text-gray-900">${currentPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="text-gray-700 text-lg mb-6 leading-relaxed">{product.description}</p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Size</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant._id}
                    onClick={() => { setSelectedVariant(variant); setQuantity(1); }}
                    disabled={variant.stock === 0}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedVariant?._id === variant._id
                        ? 'border-orange-600 bg-orange-50'
                        : variant.stock === 0
                        ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-900">{variant.volume}</div>
                    <div className="text-xs text-gray-600 capitalize">{variant.size}</div>
                    <div className="text-sm font-bold text-orange-600 mt-1">${variant.price}</div>
                    {variant.stock === 0 && <div className="text-xs text-red-600 mt-1">Out of stock</div>}
                    {variant.stock > 0 && variant.stock <= 5 && (
                      <div className="text-xs text-orange-600 mt-1">Only {variant.stock} left</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selectedVariant && selectedVariant.stock > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-6 py-2 font-semibold text-lg">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= selectedVariant.stock}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-gray-600">{selectedVariant.stock} available</span>
                </div>
              </div>
            )}

            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.isAvailable || !selectedVariant || addingToCart}
                className={`flex-1 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2 ${
                  product.isAvailable && selectedVariant
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {addingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShoppingCart className="w-5 h-5" />Add to Cart</>}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.isAvailable || !selectedVariant || addingToCart}
                className={`flex-1 py-4 rounded-lg font-semibold text-lg transition-colors ${
                  product.isAvailable && selectedVariant
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Buy Now
              </button>
            </div>

            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.nutritionalInfo && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Nutritional Information</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white p-4 rounded-lg">
                  {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                    value && (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{value}</div>
                        <div className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}</div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;