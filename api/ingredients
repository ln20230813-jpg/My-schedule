// api/ingredients.js

// ⚠️ IMPORTANT: In a real-world application, this array will reset
// every time a new serverless instance is spun up or the old one
// goes cold. For production, replace this with a database (e.g., Vercel KV).
let ingredients = [
  { id: 1, name: "Milk", amount: "1 Gallon", expiryDate: "2025-12-15" },
  { id: 2, name: "Eggs", amount: "1 Dozen", expiryDate: "2025-12-28" },
];

let nextId = 3; // Simple auto-incrementing ID

// Utility function to handle requests
export default async function handler(req, res) {
  // Set CORS headers for local development/testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // --- GET /api/ingredients ---
  if (req.method === 'GET') {
    // Return all ingredients from the in-memory array
    return res.status(200).json({
      success: true,
      data: ingredients,
    });
  }

  // --- POST /api/ingredients ---
  if (req.method === 'POST') {
    const { name, amount, expiryDate } = req.body;

    // Error Handling: Check for required fields
    if (!name || !amount || !expiryDate) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: 'name', 'amount', and 'expiryDate' are mandatory.",
      });
    }

    // Input Validation: Check if expiryDate is a valid date format (basic check)
    if (isNaN(new Date(expiryDate))) {
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
      addedOn: new Date().toISOString().split('T')[0] // Add a timestamp for when it was added
    };

    // Add the new ingredient to the array
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
