const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const User = require('./src/models/User');
require('dotenv').config();

const products = [
  {
    name: 'Classic Orange Juice',
    slug: 'classic-orange-juice',
    description: 'Fresh cold-pressed orange juice made from premium Valencia oranges. No preservatives, no added sugar, just pure natural goodness in every sip.',
    category: 'juice',
    variants: [
      { size: 'small', volume: '250ml', price: 3.99, stock: 50 },
      { size: 'medium', volume: '500ml', price: 6.99, stock: 30 },
      { size: 'large', volume: '1L', price: 11.99, stock: 20 }
    ],
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', alt: 'Classic Orange Juice', isPrimary: true }],
    ingredients: ['100% Fresh Oranges'],
    nutritionalInfo: {
      calories: 110,
      sugar: 21,
      vitamin_c: 124,
      protein: 2,
      carbs: 26
    },
    tags: ['fresh', 'natural', 'vitamin-c', 'bestseller'],
    isAvailable: true,
    discount: {
      type: 'percentage',
      value: 10
    },
    ratings: {
      average: 4.8,
      count: 120
    }
  },
  {
    name: 'Orange Mango Blend',
    slug: 'orange-mango-blend',
    description: 'Tropical paradise in a bottle! A perfect blend of sweet oranges and juicy mangoes creating an exotic flavor combination.',
    category: 'juice',
    variants: [
      { size: 'small', volume: '250ml', price: 4.49, stock: 40 },
      { size: 'medium', volume: '500ml', price: 7.99, stock: 25 },
      { size: 'large', volume: '1L', price: 13.99, stock: 15 }
    ],
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', alt: 'Orange Mango Blend', isPrimary: true }],
    ingredients: ['Fresh Oranges', 'Ripe Mangoes'],
    nutritionalInfo: {
      calories: 120,
      sugar: 24,
      vitamin_c: 110,
      protein: 1,
      carbs: 28
    },
    tags: ['tropical', 'mango', 'exotic', 'popular'],
    isAvailable: true,
    ratings: {
      average: 4.6,
      count: 85
    }
  },
  {
    name: 'Orange Carrot Fusion',
    slug: 'orange-carrot-fusion',
    description: 'A healthy fusion of sweet oranges and nutritious carrots. Packed with beta-carotene and vitamin A for your daily wellness.',
    category: 'juice',
    variants: [
      { size: 'small', volume: '250ml', price: 4.99, stock: 35 },
      { size: 'medium', volume: '500ml', price: 8.49, stock: 20 }
    ],
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', alt: 'Orange Carrot Fusion', isPrimary: true }],
    ingredients: ['Fresh Oranges', 'Organic Carrots'],
    nutritionalInfo: {
      calories: 95,
      sugar: 19,
      vitamin_c: 115,
      protein: 2,
      carbs: 22
    },
    tags: ['healthy', 'carrot', 'vitamin-a', 'wellness'],
    isAvailable: true,
    ratings: {
      average: 4.5,
      count: 65
    }
  },
  {
    name: 'Premium Valencia Orange',
    slug: 'premium-valencia-orange',
    description: 'Made exclusively from premium Valencia oranges sourced from local organic farms. This is our finest orange juice with superior taste and quality.',
    category: 'juice',
    variants: [
      { size: 'medium', volume: '500ml', price: 8.99, stock: 15 },
      { size: 'large', volume: '1L', price: 15.99, stock: 10 }
    ],
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', alt: 'Premium Valencia Orange', isPrimary: true }],
    ingredients: ['100% Premium Valencia Oranges'],
    nutritionalInfo: {
      calories: 115,
      sugar: 22,
      vitamin_c: 135,
      protein: 2,
      carbs: 27
    },
    tags: ['premium', 'valencia', 'organic', 'luxury'],
    isAvailable: true,
    ratings: {
      average: 4.9,
      count: 150
    }
  },
  {
    name: 'Orange Ginger Boost',
    slug: 'orange-ginger-boost',
    description: 'Energizing blend of fresh oranges with a kick of ginger. Perfect for boosting your immune system and starting your day with vitality.',
    category: 'juice',
    variants: [
      { size: 'small', volume: '250ml', price: 5.49, stock: 30 },
      { size: 'medium', volume: '500ml', price: 9.49, stock: 18 }
    ],
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', alt: 'Orange Ginger Boost', isPrimary: true }],
    ingredients: ['Fresh Oranges', 'Fresh Ginger Root'],
    nutritionalInfo: {
      calories: 105,
      sugar: 20,
      vitamin_c: 130,
      protein: 1,
      carbs: 25
    },
    tags: ['ginger', 'energy', 'immunity', 'spicy'],
    isAvailable: true,
    ratings: {
      average: 4.7,
      count: 92
    }
  },
  {
    name: 'Orange Turmeric Wellness',
    slug: 'orange-turmeric-wellness',
    description: 'Anti-inflammatory powerhouse combining oranges with golden turmeric. Great for overall wellness and natural healing.',
    category: 'juice',
    variants: [
      { size: 'small', volume: '250ml', price: 5.99, stock: 25 },
      { size: 'medium', volume: '500ml', price: 9.99, stock: 12 }
    ],
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', alt: 'Orange Turmeric Wellness', isPrimary: true }],
    ingredients: ['Fresh Oranges', 'Organic Turmeric', 'Black Pepper'],
    nutritionalInfo: {
      calories: 100,
      sugar: 19,
      vitamin_c: 125,
      protein: 2,
      carbs: 24
    },
    tags: ['turmeric', 'wellness', 'anti-inflammatory', 'healthy'],
    isAvailable: true,
    ratings: {
      average: 4.4,
      count: 48
    }
  },
  {
    name: 'Orange Strawberry Delight',
    slug: 'orange-strawberry-delight',
    description: 'Sweet and refreshing combination of oranges and strawberries. A fruity treat that kids and adults both love!',
    category: 'juice',
    variants: [
      { size: 'small', volume: '250ml', price: 4.99, stock: 45 },
      { size: 'medium', volume: '500ml', price: 8.99, stock: 28 }
    ],
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', alt: 'Orange Strawberry Delight', isPrimary: true }],
    ingredients: ['Fresh Oranges', 'Fresh Strawberries'],
    nutritionalInfo: {
      calories: 112,
      sugar: 23,
      vitamin_c: 140,
      protein: 1,
      carbs: 27
    },
    tags: ['strawberry', 'sweet', 'fruity', 'kids-favorite'],
    isAvailable: true,
    discount: {
      type: 'percentage',
      value: 5
    },
    ratings: {
      average: 4.7,
      count: 110
    }
  },
  {
    name: 'Orange Pineapple Paradise',
    slug: 'orange-pineapple-paradise',
    description: 'Transport yourself to a tropical island with this exotic blend of oranges and pineapple. Refreshingly sweet and tangy!',
    category: 'juice',
    variants: [
      { size: 'small', volume: '250ml', price: 4.49, stock: 38 },
      { size: 'medium', volume: '500ml', price: 7.99, stock: 22 }
    ],
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', alt: 'Orange Pineapple Paradise', isPrimary: true }],
    ingredients: ['Fresh Oranges', 'Fresh Pineapple'],
    nutritionalInfo: {
      calories: 118,
      sugar: 25,
      vitamin_c: 145,
      protein: 1,
      carbs: 29
    },
    tags: ['pineapple', 'tropical', 'tangy', 'refreshing'],
    isAvailable: true,
    ratings: {
      average: 4.6,
      count: 78
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Create demo users (using create() to trigger password hashing middleware)
    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@quickjuice.com',
        password: 'Admin@123',
        role: 'admin',
        phone: '+1234567890'
      },
      {
        name: 'Demo Customer',
        email: 'demo@example.com',
        password: 'Demo@123',
        role: 'customer',
        phone: '+1234567891'
      }
    ];

    // Use create() instead of insertMany() to trigger password hashing
    const insertedUsers = [];
    for (const userData of demoUsers) {
      const user = await User.create(userData);
      insertedUsers.push(user);
    }
    console.log(`✅ Inserted ${insertedUsers.length} demo users`);

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    // Display inserted users
    console.log('\n👥 Demo users added:');
    insertedUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Display inserted products
    console.log('\n📦 Products added:');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.variants.length} variants)`);
    });

    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
