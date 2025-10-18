import { motion } from 'framer-motion';
import { Heart, Leaf, Truck, Award, Users, Clock } from 'lucide-react';
import orange1Image from '@/assets/orange1.jpg';

function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About QuickJuice
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to deliver the freshest, most delicious orange juice 
              right to your doorstep in minutes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2024, QuickJuice started with a simple idea: everyone deserves 
                access to fresh, healthy orange juice without the hassle of juicing at home.
              </p>
              <p className="text-gray-600 mb-4">
                We source only the finest oranges from local farms, cold-press them daily, 
                and deliver them to your door within minutes. No preservatives, no added sugar, 
                just pure, delicious orange juice.
              </p>
              <p className="text-gray-600">
                Today, we serve thousands of happy customers across the city, delivering 
                freshness and health with every bottle.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-96 rounded-2xl shadow-xl overflow-hidden"
            >
              <img 
                src={orange1Image} 
                alt="Fresh Oranges" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 to-transparent flex items-end justify-center pb-8">
                <p className="text-white text-2xl font-bold">Fresh Since 2024</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">What makes QuickJuice special</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <Leaf className="text-orange-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Natural</h3>
              <p className="text-gray-600">
                No preservatives, no additives, no artificial flavors. Just pure, 
                cold-pressed orange juice.
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
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="text-orange-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick Delivery</h3>
              <p className="text-gray-600">
                We deliver your fresh juice in 15-30 minutes. Fast, reliable, 
                and always on time.
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
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <Heart className="text-orange-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Made with Love</h3>
              <p className="text-gray-600">
                Every bottle is made with care and attention to detail. We love 
                what we do, and it shows.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Users size={48} className="mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-orange-100">Happy Customers</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Truck size={48} className="mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-orange-100">Deliveries Made</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Clock size={48} className="mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">20 min</div>
              <div className="text-orange-100">Average Delivery Time</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Award size={48} className="mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-orange-100">Customer Rating</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to sustainability, quality, and customer satisfaction. 
              Every decision we make is guided by these principles.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Leaf className="mr-2 text-green-600" size={24} />
                Sustainability
              </h3>
              <p className="text-gray-600">
                We use eco-friendly packaging and work with local farms to reduce our carbon footprint.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Award className="mr-2 text-orange-600" size={24} />
                Quality First
              </h3>
              <p className="text-gray-600">
                Only the best oranges make it into our bottles. We never compromise on quality.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Heart className="mr-2 text-red-600" size={24} />
                Customer Focus
              </h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're always here to help and improve.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
