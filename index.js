import fetch from 'node-fetch';
import express from 'express';
import bodyParser from "body-parser"

let store = "fbla"

let store_key = [
    {
        store_id: "1234",
        store_subdomain: "fbla"
    },
    {
        store_id: "234",
        store_subdomain: "other"
    }
]

const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());

// Route to handle incoming POST requests with JSON data
app.post('/submit', async (req, res) => {
    const jsonData = req.body;

    try {
        const apiResponse = await fetch('https://example-api.com/endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        });

        // Check if the response body is non-empty before trying to parse it
        const text = await apiResponse.text(); // Get raw text response

        // Try to parse the response as JSON only if it contains data
        let apiResult;
        try {
            apiResult = text ? JSON.parse(text) : {};
        } catch (err) {
            console.warn('Failed to parse JSON, returning raw text instead.');
            apiResult = { rawResponse: text };
        }

        // Send the result from the API back to the original client
        res.status(200).json({
            message: 'Data forwarded successfully',
            apiResponse: apiResult,
        });
    } catch (error) {
        console.error('Error forwarding data:', error);
        res.status(500).json({ message: 'Error forwarding data', error: error.message });
    }
});



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

