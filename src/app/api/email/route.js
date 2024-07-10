import { sendOrderEmail } from '../../../app/email/Mailgun';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let body;

    // Parse JSON body
    try {
      body = JSON.parse(req.body);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return res.status(400).json({ message: 'Invalid JSON' });
    }

    const { to, subject, body: emailBody } = body;

    const templateParams = {
      email: to,
      subject: subject,
      body: emailBody,
    };

    try {
      const emailResponse = await sendOrderEmail(templateParams);
      console.log('Email sent successfully:', emailResponse);
      res.status(200).json({ message: 'Email sent successfully', response: emailResponse });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send email', details: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
