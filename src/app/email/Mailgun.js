const MAILGUN_API_KEY = process.env.NEXT_PUBLIC_MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.NEXT_PUBLIC_MAILGUN_DOMAIN;
const MAILGUN_API_BASE_URL = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}`;

export async function sendOrderEmail(templateParams) {
  const formData = new URLSearchParams();
  formData.append('from', 'Your Name <techtextile19@gmail.com>');
  formData.append('to', templateParams.email);
  formData.append('subject', templateParams.subject);
  formData.append('html', templateParams.body);

  console.log('Sending email with data:', formData.toString());

  const response = await fetch(`${MAILGUN_API_BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  const responseText = await response.text();
  console.log('Mailgun response:', responseText);

  if (!response.ok) {
    throw new Error(`Failed to send order confirmation email: ${responseText}`);
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${responseText}`);
  }
}
