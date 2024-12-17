import PDFDocument from 'pdfkit';
import mongoose from 'mongoose';
import Order from '../../model/orderItemSchema.mjs';
import User from '../../model/userSchema.mjs';
import Product from '../../model/productSchema.mjs';

export const generateOrderPDF = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session._id });
        const orderId = req.query.orderId;
        const order = await Order.findById(orderId).populate({
            path: 'products.product',
            select: 'product_name price product_image categories discount Flavor',
            model: Product,
            options: { strictPopulate: false },
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const shippingAddress = user.address.find((address) =>
            address._id.equals(order.shipping_address)
        );

        const fileName = `order-${orderId}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
 
        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        // Pipe the PDF document directly to the HTTP response
        doc.pipe(res);

        // PDF Content - Header
        doc.fontSize(20).text('Order Summary', { align: 'center' }).moveDown();

        // Order Details
        doc.fontSize(12)
            .text(`Order ID: ${order._id}`)
            .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`)
            .text(
                `Payment Mode: ${
                    order.paymentMode === 'cod'
                        ? 'Cash On Delivery'
                        : order.paymentMode === 'Razorpay'
                        ? 'Paid Using Razorpay'
                        : order.paymentMode === 'wallet'
                        ? 'Paid Using Wallet'
                        : ''
                }`
            )
            .moveDown();

        // Shipping Address
        doc.fontSize(14).text('Shipping Address', { underline: true }).fontSize(12)
            .text(shippingAddress.contactName)
            .text(shippingAddress.building || '')
            .text(
                `${shippingAddress.city}, ${shippingAddress.district} ${shippingAddress.state}, ${shippingAddress.country}`
            )
            .text(`Pincode: ${shippingAddress.pincode}`)
            .text(`Phone: ${shippingAddress.phonenumber}`)
            .text(`Landmark: ${shippingAddress.landmark}`)
            .moveDown();

        // Items Table
        doc.fontSize(14).text('Items Purchased', { underline: true }).moveDown();

        const tableTop = doc.y;
        const itemX = 50,
            mrpX = 150,
            qtyX = 250,
            discountX = 320,
            taxX = 400,
            totalX = 480;

        doc.fontSize(12)
            .text('Product', itemX, tableTop)
            .text('MRP', mrpX, tableTop)
            .text('Qty', qtyX, tableTop)
            .text('Discount', discountX, tableTop)
            .text('Tax', taxX, tableTop)
            .text('Total', totalX, tableTop);

        doc.moveTo(50, doc.y + 10)
            .lineTo(550, doc.y + 10)
            .stroke();

        let yPosition = doc.y + 20;

        order.products.forEach((item) => {
            doc.text(`${item.product.product_name.slice(0, 11)}`, itemX, yPosition)
                .text(`₹${item.price.toString()}`, mrpX, yPosition)
                .text(item.quantity.toString(), qtyX, yPosition)
                .text(`₹${item.discount.toString()}`, discountX, yPosition)
                .text(`₹${item.gst.toString()}`, taxX, yPosition)
                .text(
                    `₹${
                        ((item.price * item.quantity) / 100) * (100 - item.discount) +
                        ((item.price * item.quantity) / 100) * item.gst
                    }`,
                    totalX,
                    yPosition
                );

            yPosition += 30; // Add space for the next row
        });

        yPosition += 20;

        // Draw a line before subtotal
        doc.moveTo(50, yPosition)
            .lineTo(550, yPosition)
            .stroke();
        yPosition += 10;

        // Display the subtotal
        doc.fontSize(12)
            .text('Subtotal:', 400, yPosition) // Label position
            .text(`₹${order.grandTottal}`, 500, yPosition, { align: 'right' }); // Value position

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Failed to generate PDF', error: error.message });
    }
};
