import { Product } from '../models/index.js';
import { sequelize } from '../database/index.js';

const sampleProducts = [
  {
    name: "Cotton Comfort T-Shirt",
    description: "Soft and breathable cotton t-shirt perfect for everyday wear. Made from 100% organic cotton.",
    price: 899.00,
    category: "women",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    stock: 50,
    size: "M",
    color: "White"
  },
  {
    name: "Nepali Cotton Kurta",
    description: "Traditional Nepali cotton kurta with handcrafted details. Comfortable and elegant design.",
    price: 1299.00,
    category: "women",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
    stock: 30,
    size: "L",
    color: "Blue"
  },
  {
    name: "Kids Cotton Dress",
    description: "Adorable cotton dress for kids with colorful prints. Safe and comfortable for children.",
    price: 699.00,
    category: "kids",
    image: "https://images.unsplash.com/photo-1553451191-6d8f2c5e3b3a?w=400",
    stock: 25,
    size: "S",
    color: "Pink"
  },
  {
    name: "Cotton Bed Sheets",
    description: "Luxurious cotton bed sheets for a comfortable night's sleep. 100% cotton, 300 thread count.",
    price: 1499.00,
    category: "home-linens",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400",
    stock: 20,
    size: "One Size",
    color: "White"
  },
  {
    name: "Handcrafted Cotton Cushion",
    description: "Beautiful handcrafted cotton cushion with traditional Nepali patterns.",
    price: 399.00,
    category: "home-linens",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400",
    stock: 40,
    size: "One Size",
    color: "Multi"
  },
  {
    name: "Cotton Summer Dress",
    description: "Light and airy cotton summer dress perfect for warm weather. Features a flattering silhouette.",
    price: 999.00,
    category: "women",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
    stock: 35,
    size: "M",
    color: "Yellow"
  },
  {
    name: "Kids Cotton Pajamas",
    description: "Comfortable cotton pajamas for kids with fun prints. Perfect for bedtime.",
    price: 549.00,
    category: "kids",
    image: "https://images.unsplash.com/photo-1553451191-6d8f2c5e3b3a?w=400",
    stock: 30,
    size: "M",
    color: "Blue"
  },
  {
    name: "Cotton Table Runner",
    description: "Elegant cotton table runner with traditional Nepali embroidery. Perfect for special occasions.",
    price: 299.00,
    category: "home-linens",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400",
    stock: 25,
    size: "One Size",
    color: "Cream"
  }
];

const seedProducts = async () => {
  try {
    await sequelize.sync({ force: true });
    
    for (const product of sampleProducts) {
      await Product.create(product);
    }
    
    console.log('Sample products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts(); 