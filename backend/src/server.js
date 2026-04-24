const app = require('./app');
const prisma = require('./config/database.js'); // ✅ fixed
const PORT = process.env.PORT || 5000;

async function startServer() {
    try{
        await prisma.$connect()
        console.log('Database connected successfully');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📝 Environment: ${process.env.NODE_ENV}`);
            console.log(`🔗 Test API: http://localhost:${PORT}/health`);
          })

    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
      }
    
}
startServer();
