
let store = "fbla"
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Import node-fetch to make HTTP requests

const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Route to handle incoming POST requests with JSON data
app.post('/submit', async (req, res) => {
    const jsonData = req.body;

    // Log the received data
    console.log('Received data:', jsonData);

    try {
        // Send the received data to another API
        const apiResponse = await fetch(`https://${store}.mybrightsites.com/api/v2.6.1/orders/1?token=GXzAxWkkyYLsESGQTU15`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData), // Forward the received data as JSON
        });

        // Handle the response from the API
        const apiResult = await apiResponse.json();

        // Send the result from the API back to the original client
        res.status(200).json({
            message: 'Data forwarded successfully',
            apiResponse: apiResult,
        });
    } catch (error) {
        console.error('Error forwarding data:', error);
        res.status(500).json({ message: 'Error forwarding data' });
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

