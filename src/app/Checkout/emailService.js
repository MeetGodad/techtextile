
import emailjs from '@emailjs/browser';

emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_USER_ID);

export const sendOrderConfirmationEmails = async (orderDetails) => {
  try {
    const cartItemsHtml = orderDetails.cart.map(item => `
      <tr>
        <td style="border-bottom: 1px solid #dddddd; padding: 10px;">
          ${item.product_name} (Quantity: ${item.quantity})
          ${item.selected_variants && item.selected_variants.length > 0 ? `
            <div>
              ${item.selected_variants.map(variant => `
                <div>
                  <span class="font-semibold">${variant.variant_name.toUpperCase()}: </span>
                  ${variant.variant_name.toLowerCase() === 'color' ? `
                    <span style="display: inline-block; background-color: ${variant.variant_value}; width: 20px; height: 20px; border-radius: 50%;"></span>
                  ` : `
                    <span>${variant.variant_value}</span>
                  `}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </td>
        <td style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: center;">
          <img src="${item.image_url.split(',')[0]}" alt="${item.product_name}" style="width: 80px; height: 80px; object-fit: cover;">
        </td>
      </tr>
    `).join('');
    
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_BUYER,
      {
        to_email: orderDetails.shippingInfo.email,
        firstName: orderDetails.shippingInfo.firstName,
        lastName: orderDetails.shippingInfo.lastName,
        address: orderDetails.shippingInfo.street,
        address: orderDetails.shippingInfo.street,
        city: orderDetails.shippingInfo.city,
        state: orderDetails.shippingInfo.state,
        zip: orderDetails.shippingInfo.zip,
        email: orderDetails.shippingInfo.email,
        totalAmount: orderDetails.totalPrice,
        cartItemsHtml: cartItemsHtml
      }
    );
    
    

    // Fetch unique seller emails from cart items
    const sellerEmails = Array.from(new Set(orderDetails.cart.map(item => item.seller_email)));

    // Send email to each seller
    for (const sellerEmail of sellerEmails) {
      const sellerCartItems = orderDetails.cart.filter(item => item.seller_email === sellerEmail).map(item => `
      <tr>
        <td style="border-bottom: 1px solid #dddddd; padding: 10px;">
          ${item.product_name} (Quantity: ${item.quantity})
          ${item.selected_variants && item.selected_variants.length > 0 ? `
            <div>
              ${item.selected_variants.map(variant => `
                <div>
                  <span class="font-semibold">${variant.variant_name.toUpperCase()}: </span>
                  ${variant.variant_name.toLowerCase() === 'color' ? `
                    <span style="display: inline-block; background-color: ${variant.variant_value}; width: 20px; height: 20px; border-radius: 50%;"></span>
                  ` : `
                    <span>${variant.variant_value}</span>
                  `}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </td>
        <td style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: center;">
          <img src="${item.image_url.split(',')[0]}" alt="${item.product_name}" style="width: 80px; height: 80px; object-fit: cover;">
        </td>
      </tr>
    `).join('');
    
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_SELLER,
        {
          to_email: `${sellerEmail}, techtextile19@gmail.com`,
          order_number: orderDetails.orderId,
          customer_name: `${orderDetails.shippingInfo.firstName} ${orderDetails.shippingInfo.lastName}`,
          customer_email: orderDetails.shippingInfo.email,
          shipping_address: `${orderDetails.shippingInfo.street}, ${orderDetails.shippingInfo.city}, ${orderDetails.shippingInfo.state}, ${orderDetails.shippingInfo.zip}`,
          order_total: orderDetails.totalPrice,
          cartItems: sellerCartItems
        }
      );
    }

    console.log('Order confirmation emails sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send order confirmation emails:', error);
    return false;
  }
};
