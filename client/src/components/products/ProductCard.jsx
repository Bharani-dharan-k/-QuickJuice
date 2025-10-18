import { motion } from 'framer-motion'
import { ShoppingCart, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

/**
 * ProductCard Component
 * Displays a product with image, details, and add to cart functionality
 * 
 * @param {Object} product - Product object
 * @param {string} product._id - Product ID
 * @param {string} product.name - Product name
 * @param {string} product.slug - Product slug for URL
 * @param {Array} product.images - Product images array
 * @param {Array} product.variants - Product variants (sizes/prices)
 * @param {number} product.ratings.average - Average rating
 * @param {boolean} product.isAvailable - Availability status
 */
const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addItem)

  const primaryImage = product.images?.find((img) => img.isPrimary)?.url || 
                       product.images?.[0]?.url ||
                       '/placeholder-juice.jpg'

  // Get price range
  const prices = product.variants?.map((v) => v.price) || []
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceDisplay = minPrice === maxPrice 
    ? `$${minPrice.toFixed(2)}` 
    : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`

  // Get smallest variant for default add to cart
  const defaultVariant = product.variants?.[0]

  const handleAddToCart = (e) => {
    e.preventDefault() // Prevent navigation to product detail
    
    if (!defaultVariant) {
      toast.error('No variants available')
      return
    }

    // Optimistic UI update
    addToCart({
      productId: product._id,
      variantId: defaultVariant._id,
      quantity: 1,
    })

    toast.success(`${product.name} added to cart!`)
  }

  const handleToggleFavorite = (e) => {
    e.preventDefault()
    // TODO: Implement favorite toggle
    toast.success('Added to favorites!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/products/${product.slug || product._id}`}>
        <div className="card overflow-hidden relative">
          {/* Favorite button */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
          >
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>

          {/* Product image */}
          <div className="relative h-64 bg-gradient-to-br from-orange-100 to-yellow-50 rounded-lg overflow-hidden mb-4">
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            
            {/* Availability badge */}
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="badge-error text-lg">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="space-y-2">
            {/* Category badge */}
            <span className="badge badge-info text-xs uppercase">
              {product.category}
            </span>

            {/* Product name */}
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            {product.ratings?.average > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-medium">{product.ratings.average.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({product.ratings.count})</span>
              </div>
            )}

            {/* Price and add to cart */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-2xl font-bold text-primary-600">
                {priceDisplay}
              </span>
              
              <button
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className="p-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard
