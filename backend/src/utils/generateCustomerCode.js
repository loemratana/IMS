const prisma = require('../config/database');

const generateCustomerCode = async () => {
    const count = await prisma.customer.count();
    const year = new Date().getFullYear();
    const code = `CUST-${year}-${(count + 1).toString().padStart(6, '0')}`;
    return code;
}

module.exports = generateCustomerCode;