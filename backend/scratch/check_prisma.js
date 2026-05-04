const prisma = require('../src/config/database');
console.log(Object.keys(prisma).filter(k => !k.startsWith('_')));
process.exit(0);
