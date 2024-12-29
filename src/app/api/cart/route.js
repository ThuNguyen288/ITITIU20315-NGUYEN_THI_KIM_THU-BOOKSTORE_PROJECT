import db from '../dbConect'; // Ensure correct path to your DB connection

// POST method to add product to cart
export async function POST(req) {
  const { CustomerID, ProductID, Quantity } = await req.json(); // Get data from request body

  if (!CustomerID || !ProductID || !Quantity) {
    return new Response(
      JSON.stringify({ message: 'Missing required fields.' }),
      { status: 400 }
    );
  }

  try {
    // Check if the product already exists in the cart for the given customer
    const [existingItem] = await db.execute(
      'SELECT * FROM cart WHERE CustomerID = ? AND ProductID = ?',
      [CustomerID, ProductID]
    );

    if (existingItem.length > 0) {
      // If the product exists, update the quantity
      await db.execute(
        'UPDATE cart SET Quantity = Quantity + ? WHERE CustomerID = ? AND ProductID = ?',
        [Quantity, CustomerID, ProductID]
      );
    } else {
      // If the product doesn't exist, insert a new record
      await db.execute(
        'INSERT INTO cart (CustomerID, ProductID, Quantity, AddedAt) VALUES (?, ?, ?, NOW())',
        [CustomerID, ProductID, Quantity]
      );
    }

    return new Response(
      JSON.stringify({ message: 'Product added to cart successfully.' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error.' }),
      { status: 500 }
    );
  }
}

// GET method to retrieve cart items for a specific customer
export async function GET(req) {
  try {
    // Extract CustomerID from query string (URL)
    const url = new URL(req.url);
    const CustomerID = url.searchParams.get('CustomerID');

    if (!CustomerID) {
      return new Response(
        JSON.stringify({ error: 'CustomerID is required' }),
        { status: 400 }
      );
    }

    // Retrieve cart items for the given CustomerID from the database
    const [cart] = await db.execute(
      'SELECT * FROM cart WHERE CustomerID = ?',
      [CustomerID]
    );
    console.log(cart);

    if (cart.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No items in cart' }),
        { status: 404 }
      );
    }

    // Retrieve product details for the products in the cart
    const [products] = await db.execute(
      'SELECT p.ProductID, p.Name, p.Price, pi.ImageURL FROM products p ' +
      'JOIN productimages pi ON p.ProductID = pi.ProductID ' +
      'WHERE p.ProductID IN (SELECT ProductID FROM cart WHERE CustomerID = ?)',
      [CustomerID]
    );

    if (products.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No product details found' }),
        { status: 404 }
      );
    }

    // Combine cart items with product details
    const updatedCart = cart.map(item => {
      const product = products.find(product => product.ProductID === item.ProductID);
      return {
        ...item,
        Name: product?.Name || 'Unknown',
        Price: product?.Price || 0,
        Image: product?.ImageURL || 'https://via.placeholder.com/80',
      };
    });

    return new Response(
      JSON.stringify({ cart: updatedCart }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching data:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// PUT method to update quantity in the cart
export async function PUT(req) {
  const { CustomerID, ProductID, Quantity } = await req.json();

  if (!CustomerID || !ProductID || !Number.isInteger(Quantity)) {
    return new Response(
      JSON.stringify({ message: 'Invalid or missing required fields.' }),
      { status: 400 }
    );
  }

  try {
    // Update quantity for the given product in the cart
    await db.execute(
      `
      UPDATE cart
      SET Quantity = GREATEST(0, Quantity + ?)
      WHERE CustomerID = ? AND ProductID = ?
      `,
      [Quantity, CustomerID, ProductID]
    );

    return new Response(
      JSON.stringify({ message: 'Quantity updated successfully.' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating quantity:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error.' }),
      { status: 500 }
    );
  }
}
