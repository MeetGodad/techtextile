// pages/api/reviews.js
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      const { rating, comment, productId } = fields;
      const image = files.image.path;

      // Handle saving data to the database here

      res.status(200).json({ message: 'Review submitted successfully' });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
