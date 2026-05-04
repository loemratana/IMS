const prisma = require('../src/config/database');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'System Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // 2. Create Categories
  const categories = [
    { name: 'Electronics', slug: 'electronics', description: 'Gadgets and devices' },
    { name: 'Furniture', slug: 'furniture', description: 'Home and office furniture' },
    { name: 'Apparel', slug: 'apparel', description: 'Clothing and accessories' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log('Categories created');

  const electronics = await prisma.category.findUnique({ where: { name: 'Electronics' } });

  // 3. Create Warehouse
  const warehouse = await prisma.warehouse.upsert({
    where: { code: 'WH-MAIN' },
    update: {},
    create: {
      name: 'Main Distribution Center',
      code: 'WH-MAIN',
      location: 'New York, NY',
      address: '456 Warehouse St, NY',
      isActive: true,
    },
  });
  console.log('Warehouse created:', warehouse.name);

  // 4. Create Supplier
  const supplier = await prisma.supplier.upsert({
    where: { code: 'SUP-001' },
    update: {},
    create: {
      name: 'Global Tech Solutions',
      code: 'SUP-001',
      email: 'contact@globaltech.com',
      phone: '+1-555-0123',
      address: '123 Tech Lane, Silicon Valley, CA',
      status: 'ACTIVE',
    },
  });
  console.log('Supplier created:', supplier.name);

  // 5. Create Products
  const products = [
    {
      name: 'UltraWide Monitor 34"',
      sku: 'MON-UW-34',
      barcode: '123456789012',
      description: 'High performance gaming monitor',
      price: 499.99,
      minStockLevel: 5,
      categoryId: electronics.id,
    },
    {
      name: 'Wireless Mechanical Keyboard',
      sku: 'KBD-WL-RGB',
      barcode: '123456789013',
      description: 'RGB mechanical keyboard with brown switches',
      price: 89.50,
      minStockLevel: 10,
      categoryId: electronics.id,
    },
  ];

  for (const prod of products) {
    const p = await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {},
      create: prod,
    });

    // 6. Create Initial Stock
    await prisma.stock.upsert({
      where: {
        productId_warehouseId: {
          productId: p.id,
          warehouseId: warehouse.id,
        },
      },
      update: {},
      create: {
        productId: p.id,
        warehouseId: warehouse.id,
        quantity: 50,
      },
    });
  }
  console.log('Products and initial stock created');

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
