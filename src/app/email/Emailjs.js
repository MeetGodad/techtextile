import emailjs from 'emailjs-com';

const EMAILJS_SERVICE_ID = 'service_a8smqnk'; 
const EMAILJS_TEMPLATE_ID = 'template_204gdnt';
const EMAILJS_USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

const sendOrderEmail = async (shippingInfo, paymentInfo, cart, totalAmount) => {
  try {
    const templateParams = {
      firstName: shippingInfo.firstName,
      lastName: shippingInfo.lastName,
      address: shippingInfo.address,
      city: shippingInfo.city,
      state: shippingInfo.state,
      zip: shippingInfo.zip,
      email: shippingInfo.email,
      paymentMethod: paymentInfo.paymentMethod,
      totalAmount: `$${totalAmount.toFixed(2)}`,
    };

    const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_USER_ID);

    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
};

export default sendOrderEmail;