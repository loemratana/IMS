class StockAlertTemplate {
    getSubject(productName) {
        return `⚠️ Low Stock Alert: ${productName}`;
    }

    getHtml({ productName, currentQuantity, minStockLevel, warehouseName, productSku }) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container { font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; }
                .header { background-color: #f44336; color: white; padding: 10px; text-align: center; border-radius: 5px; }
                .content { padding: 20px; line-height: 1.6; }
                .footer { color: #888; font-size: 12px; margin-top: 20px; text-align: center; }
                .alert-box { background-color: #fff3e0; border-left: 5px solid #ff9800; padding: 15px; margin: 20px 0; }
                .product-details { border-collapse: collapse; width: 100%; margin-top: 20px; }
                .product-details td { padding: 8px; border-bottom: 1px solid #eee; }
                .product-details td:first-child { font-weight: bold; width: 40%; }
                .action-btn { display: inline-block; padding: 10px 20px; background-color: #2196f3; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Inventory Alert</h1>
                </div>
                <div class="content">
                    <p>This is an automated notification from your Inventory Management System.</p>
                    
                    <div class="alert-box">
                        <strong>The stock level for the following product has dropped below the minimum threshold.</strong>
                    </div>

                    <table class="product-details">
                        <tr>
                            <td>Product Name</td>
                            <td>\${productName}</td>
                        </tr>
                        <tr>
                            <td>SKU</td>
                            <td>\${productSku}</td>
                        </tr>
                        <tr>
                            <td>Warehouse</td>
                            <td>\${warehouseName}</td>
                        </tr>
                        <tr>
                            <td>Current Stock</td>
                            <td style="color: #f44336; font-weight: bold;">\${currentQuantity}</td>
                        </tr>
                        <tr>
                            <td>Minimum Level</td>
                            <td>\${minStockLevel}</td>
                        </tr>
                    </table>

                    <p>Please consider restocking this product to avoid potential stockouts.</p>
                    
                    <a href="\${process.env.FRONTEND_URL}/inventory/products/\${productSku}" class="action-btn">View Product</a>
                </div>
                <div class="footer">
                    <p>&copy; \${new Date().getFullYear()} IMS System. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    getText({ productName, currentQuantity, minStockLevel, warehouseName, productSku }) {
        return `
        INVENTORY ALERT: Low Stock Detected
        
        Product: \${productName} (\${productSku})
        Warehouse: \${warehouseName}
        Current Stock: \${currentQuantity}
        Minimum Level: \${minStockLevel}
        
        Please restock this product soon.
        View details at: \${process.env.FRONTEND_URL}/inventory/products/\${productSku}
        `;
    }
}

module.exports = new StockAlertTemplate();
