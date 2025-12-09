// api/ingredients.js

// ⚠️ IMPORTANT: In a real-world application, this array will reset
// every time a new serverless instance is spun up or the old one
// goes cold. For production, replace this with a persistent database (e.g., Vercel KV, Redis).
let ingredients = [
  { id: 1, name: "Milk", amount: "1 Gallon", expiryDate: "2025-12-15", addedOn: "2025-12-09" },
  { id: 2, name: "Eggs", amount: "1 Dozen", expiryDate: "2025-12-28", addedOn: "2025-12-09" },
];

let nextId = 3; // Simple auto-incrementing ID

// Helper function to reliably parse JSON body in a Vercel environment
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        // If parsing fails (e.g., non-JSON data), return an empty object or null
        resolve({}); 
      }
    });
    req.on('error', reject);
  });
}


// Utility function to handle requests
export default async function handler(req, res) {
  // Set CORS headers for security and browser compatibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // --- GET /api/ingredients ---
  if (req.method === 'GET') {
    // Return all ingredients
    return res.status(200).json({
      success: true,
      data: ingredients,
    });
  }

  // --- POST /api/ingredients ---
  if (req.method === 'POST') {
    // ⚠️ FIX: Manually parse the request body stream 
    const body = await parseBody(req);
    const { name, amount, expiryDate } = body;

    // Error Handling: Check for required fields
    if (!name || !amount || !expiryDate) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: 'name', 'amount', and 'expiryDate' are mandatory.",
      });
    }

    // Input Validation: Check if expiryDate is a valid date format (must not be 'Invalid Date')
    const dateCheck = new Date(expiryDate);
    if (isNaN(dateCheck.getTime())) {
        return res.status(400).json({
            success: false,
            error: "Invalid format for 'expiryDate'. Please use a valid date string (e.g., YYYY-MM-DD).",
        });
    }

    // Create a new ingredient object
    const newIngredient = {
      id: nextId++,
      name: name,
      amount: amount,
      expiryDate: expiryDate,
      addedOn: new Date().toISOString().split('T')[0] 
    };

    // Add the new ingredient to the array (In-memory storage)
    ingredients.push(newIngredient);

    // Return the newly created ingredient and a 201 Created status
    return res.status(201).json({
      success: true,
      message: "Ingredient added successfully.",
      data: newIngredient,
    });
  }

  // --- Handle Unsupported Methods ---
  return res.status(405).json({
    success: false,
    error: `Method ${req.method} Not Allowed`,
  });
}
