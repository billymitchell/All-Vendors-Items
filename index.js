import fetch from 'node-fetch';
import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';

let store_key = [
    { STORE_ID: "21633", API_KEY: process.env.STORE_21633 },
    { STORE_ID: "40348", API_KEY: process.env.STORE_40348 },
    { STORE_ID: "12803", API_KEY: process.env.STORE_12803 },
    { STORE_ID: "9672", API_KEY: process.env.STORE_9672 },
    { STORE_ID: "47219", API_KEY: process.env.STORE_47219 },
    { STORE_ID: "8366", API_KEY: process.env.STORE_8366 },
    { STORE_ID: "16152", API_KEY: process.env.STORE_16152 },
    { STORE_ID: "8466", API_KEY: process.env.STORE_8466 },
    { STORE_ID: "15521", API_KEY: process.env.STORE_15521 },
    { STORE_ID: "24121", API_KEY: process.env.STORE_24121 },
    { STORE_ID: "14077", API_KEY: process.env.STORE_14077 },
    { STORE_ID: "12339", API_KEY: process.env.STORE_12339 },
    { STORE_ID: "43379", API_KEY: process.env.STORE_43379 },
    { STORE_ID: "9369", API_KEY: process.env.STORE_9369 },
    { STORE_ID: "9805", API_KEY: process.env.STORE_9805 },
    { STORE_ID: "67865", API_KEY: process.env.STORE_67865 },
    { STORE_ID: "48371", API_KEY: process.env.STORE_48371 },
    { STORE_ID: "48551", API_KEY: process.env.STORE_48551 },
    { STORE_ID: "110641", API_KEY: process.env.STORE_110641 },
    { STORE_ID: "41778", API_KEY: process.env.STORE_41778 },
    { STORE_ID: "8267", API_KEY: process.env.STORE_8267 },
    { STORE_ID: "75092", API_KEY: process.env.STORE_75092 },
    { STORE_ID: "8402", API_KEY: process.env.STORE_8402 },
    { STORE_ID: "68125", API_KEY: process.env.STORE_68125 },
    { STORE_ID: "8729", API_KEY: process.env.STORE_8729 },
    { STORE_ID: "47257", API_KEY: process.env.STORE_47257 },
    { STORE_ID: "8636", API_KEY: process.env.STORE_8636 },
  ];

  const app = express();
  app.use(bodyParser.json());
  
  app.post('/submit', async (request, response) => {
    const jsonData = request.body;
    const tracking_number = jsonData.tracking_number;
    const shipment_date = jsonData.shipment_date;
    const [storeId] = jsonData.order_number.split('-'); // Extract store ID
    const sourceId = jsonData.order_number;
  
    console.log(storeId, sourceId);
  
    const store = store_key.find(store => store.STORE_ID === storeId);
    if (!store) return response.status(400).json({ message: 'Invalid store ID' });
  
    const apiKey = store.API_KEY;
    if (!apiKey) return response.status(500).json({ message: 'API key not found for the store' });
  
    try {
      // First, make the GET request
      const getRequest = await fetch(`https://app.orderdesk.me/api/v2/orders?source_id=${sourceId}`, {
        method: "GET",
        headers: {
          "ORDERDESK-STORE-ID": storeId,
          "ORDERDESK-API-KEY": apiKey,
          "Content-Type": "application/json"
        }
      });
  
      if (getRequest.ok) {
        const orderData = await getRequest.json();
        console.log('GET request successful:', orderData);
  
        const order_id = orderData.orders[0].id; // Assuming you want the first order
        const [carrier_code, shipment_method] = orderData.orders[0].shipping_method.split(" ");
  
        const postBody = {
          tracking_number: tracking_number,
          carrier_code: carrier_code,
          shipment_method: shipment_method,
          shipment_date: shipment_date
        };
  
        const postRequest = await fetch(`https://app.orderdesk.me/api/v2/orders/${order_id}/shipments`, {
          method: "POST",
          headers: {
            "ORDERDESK-STORE-ID": storeId,
            "ORDERDESK-API-KEY": apiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(postBody)
        });
  
        const postResponse = await postRequest.json();
        console.log('POST request successful:', postResponse);
  
        response.status(200).json({
          message: 'Order and shipment successfully processed',
          getResponse: orderData,
          postResponse: postResponse
        });
      } else {
        const errorData = await getRequest.json();
        console.log('GET request failed:', errorData);
        response.status(400).json({ message: 'Failed to fetch order', error: errorData });
      }
    } catch (error) {
      console.error('Error forwarding data:', error);
      response.status(500).json({ message: 'Error forwarding data', error: error.message });
    }
  });
  
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });