const express = require('express');
const { GET } = require('./api/sellerproducts/route');

const app = express();

app.get('/api/sellerproducts/:seller_id', (req, res) => {
    GET(req)
        .then(response => {
            res.status(response.status).send(response.body);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send({ message: 'Internal server error' });
        });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
