// import emailjs from '@emailjs/browser';

// // Initialize EmailJS
// // Send Email to Customer
// emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_USER_ID);

// export const sendOrderConfirmationEmails = async (orderDetails) => {
//   try {
//     const cartItemsHtml = orderDetails.cart.map(item => `
//       <tr>
//         <td style="border-bottom: 1px solid #dddddd; padding: 10px;">
//           ${item.product_name} (Quantity: ${item.quantity})
//           ${item.selected_variants && item.selected_variants.length > 0 ? `
//             <div>
//               ${item.selected_variants.map(variant => `
//                 <div>
//                   <span class="font-semibold">${variant.variant_name.toUpperCase()}: </span>
//                   ${variant.variant_name.toLowerCase() === 'color' ? `
//                     <span style="display: inline-block; background-color: ${variant.variant_value}; width: 20px; height: 20px; border-radius: 50%;"></span>
//                   ` : `
//                     <span>${variant.variant_value}</span>
//                   `}
//                 </div>
//               `).join('')}
//             </div>
//           ` : ''}
//         </td>
//         <td style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: center;">
//           <img src="${item.image_url.split(',')[0]}" alt="${item.product_name}" style="width: 80px; height: 80px; object-fit: cover;">
//         </td>
//       </tr>
//     `).join('');
    
//     await emailjs.send(
//       process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
//       process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_BUYER,
//       {
//         to_email: orderDetails.shippingInfo.email,
//         firstName: orderDetails.shippingInfo.firstName,
//         lastName: orderDetails.shippingInfo.lastName,
//         address: orderDetails.shippingInfo.address,
//         city: orderDetails.shippingInfo.city,
//         state: orderDetails.shippingInfo.state,
//         zip: orderDetails.shippingInfo.zip,
//         email: orderDetails.shippingInfo.email,
//         paymentMethod: orderDetails.selectedPaymentMethod,
//         totalAmount: orderDetails.totalPrice,
//         cartItemsHtml: cartItemsHtml
//       }
//     );
    
    

//     // Send email to business
//     const cartItems = orderDetails.cart.map(item => `
//       <tr>
//         <td style="border-bottom: 1px solid #dddddd; padding: 10px;">
//           ${item.product_name} (Quantity: ${item.quantity})
//           ${item.selected_variants && item.selected_variants.length > 0 ? `
//             <div style="margin-top: 5px; font-size: 12px;">
//               ${item.selected_variants.map(variant => `
//                 <div>
//                   <span style="font-weight: bold;">${variant.variant_name.toUpperCase()}: </span>
//                   ${variant.variant_name.toLowerCase() === 'color' ? `
//                     <span style="display: inline-block; background-color: ${variant.variant_value}; width: 12px; height: 12px; border-radius: 50%; vertical-align: middle;"></span>
//                     <span style="margin-left: 5px;">${variant.variant_value}</span>
//                   ` : `
//                     <span>${variant.variant_value}</span>
//                   `}
//                 </div>
//               `).join('')}
//             </div>
//           ` : ''}
//         </td>
//         <td style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: center;">
//           <img src="${item.image_url.split(',')[0]}" alt="${item.product_name}" style="width: 60px; height: 60px; object-fit: cover;">
//         </td>
//         <td style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: right;">
//           $${(Number(item.price) * item.quantity).toFixed(2)}
//         </td>
//       </tr>
//     `).join('');
    
//     await emailjs.send(
//       process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
//       process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_SELLER,
//       {
//         customer_name: `${orderDetails.shippingInfo.firstName} ${orderDetails.shippingInfo.lastName}`,
//         customer_email: orderDetails.shippingInfo.email,
//         order_number: orderDetails.orderId,
//         order_total: orderDetails.totalPrice,
//         shipping_address: `${orderDetails.shippingInfo.address}, ${orderDetails.shippingInfo.city}, ${orderDetails.shippingInfo.state}, ${orderDetails.shippingInfo.zip}`,
//         payment_method: orderDetails.selectedPaymentMethod,
//         cartItems: cartItems
//       }
//     );
//     console.log('Order confirmation emails sent successfully');
//     return true;
//   } catch (error) {
//     console.error('Failed to send order confirmation emails:', error);
//     return false;
//   }
// };