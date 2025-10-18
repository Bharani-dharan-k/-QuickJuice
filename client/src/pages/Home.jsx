import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Leaf, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import orangeImage from '@/assets/orange.jpg';

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Fresh Orange Juice
                <span className="text-primary-600"> Delivered Fast</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                100% natural, cold-pressed orange juice delivered to your doorstep in minutes.
                No preservatives, just pure freshness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products" className="btn-primary inline-flex items-center justify-center">
                  Order Now
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link to="/about" className="btn-outline inline-flex items-center justify-center">
                  Learn More
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 rounded-3xl shadow-2xl overflow-hidden">
                <img 
                  src={orangeImage} 
                  alt="Fresh Orange Juice" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose QuickJuice?</h2>
            <p className="text-xl text-gray-600">We deliver freshness, quality, and speed.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <Clock className="text-primary-600" size={32} />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your fresh juice delivered in 15-30 minutes. Quick commerce at its best!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <Leaf className="text-primary-600" size={32} />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3">100% Natural</h3>
              <p className="text-gray-600">
                No preservatives, no added sugar. Just pure, cold-pressed orange juice.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <Zap className="text-primary-600" size={32} />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Always Fresh</h3>
              <p className="text-gray-600">
                Freshly pressed every day. We guarantee the highest quality and taste.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-black mb-6">
              Ready to Experience Freshness?
            </h2>
            <p className="text-xl text-black/90 mb-8 max-w-2xl mx-auto">
              Order now and get your first delivery with free shipping. 
              Join thousands of happy customers!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Browse Products
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
