const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');

// Ensure the Firebase Admin SDK is initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: 'gs://techtextile-ca673.appspot.com' // Replace with your Firebase Storage bucket name
  });
}

// Initialize Cloud Storage and get a reference to the service
const storage = new Storage();
const bucket = storage.bucket('gs://techtextile-ca673.appspot.com'); // Replace with your Firebase Storage bucket name

module.exports = { bucket, admin };
