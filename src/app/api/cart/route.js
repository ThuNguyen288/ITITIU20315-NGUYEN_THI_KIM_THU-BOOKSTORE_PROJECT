import db from '../dbConect'; // Ensure correct path to your DB connection

// POST method to add product to cart
export async function POST(req) {
  const { CustomerID, ProductID, Quantity } = await req.json();

  if (!CustomerID || !ProductID || !Quantity) {
    return new Response(
      JSON.stringify({ message: 'Missing required fields.' }),
      { status: 400 }
    );
  }

  try {
    const [[stock]] = await db.execute(`SELECT Stock FROM Products WHERE ProductID = ?`, [ProductID]);

    if (stock?.Stock < Quantity) {
      return new Response(
        JSON.stringify({ message: 'Insufficient stock.' }),
        { status: 400 }
      );
    }

    const [existingItem] = await db.execute(
      'SELECT * FROM cart WHERE CustomerID = ? AND ProductID = ?',
      [CustomerID, ProductID]
    );

    if (existingItem.length > 0) {
      await db.execute(
        'UPDATE cart SET Quantity = Quantity + ? WHERE CustomerID = ? AND ProductID = ?',
        [Quantity, CustomerID, ProductID]
      );
    } else {
      await db.execute(
        'INSERT INTO cart (CustomerID, ProductID, Quantity, AddedAt) VALUES (?, ?, ?, NOW())',
        [CustomerID, ProductID, Quantity]
      );
    }

    // 🟩 TĂNG ĐIỂM TƯƠNG TÁC CHO USER VỚI TAG CỦA SẢN PHẨM
   // Lấy các tag của sản phẩm
    const [tags] = await db.execute(`
      SELECT TagID FROM products WHERE ProductID = ?
    `, [ProductID]);
 
    if (tags.length === 0) {
      return new Response(JSON.stringify({ error: 'Không tìm thấy sản phẩm' }), { status: 404 });
    }

    const tagString = tags[0].TagID; // Ví dụ: "1,4,7"
    const tagIds = tagString.split(',').map(tag => parseInt(tag.trim())).filter(Number.isInteger);

    // Duyệt từng TagID và cập nhật Score
    for (const tagId of tagIds) {
      await db.execute(`
        INSERT INTO customer_tag_scores (CustomerID, TagID, Score)
        VALUES (?, ?, 2)
        ON DUPLICATE KEY UPDATE Score = Score + 2
      `, [CustomerID, tagId]);
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

    if (cart.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No items in cart' }),
        { status: 404 }
      );
    }

    // Retrieve product details for the products in the cart
    const [products] = await db.execute(
      'SELECT p.ProductID, p.Name, p.Price, p.Cost, pi.ImageURL FROM products p ' +
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
        Cost: product?.Cost || 0,
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
// PUT method to update quantity in the cart
export async function PUT(req) {
  try {
    const { CustomerID, ProductID, Quantity } = await req.json();

    // Validate required fields
    if (!CustomerID || !ProductID || !Number.isInteger(Quantity)) {
      return new Response(
        JSON.stringify({ message: 'Invalid or missing required fields.' }),
        { status: 400 }
      );
    }

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


// DELETE method to remove a product from the cart
export async function DELETE(req) {
  const { CustomerID, ProductID } = await req.json();

  if (!CustomerID || !ProductID) {
    return new Response(
      JSON.stringify({ message: 'Invalid or missing required fields.' }),
      { status: 400 }
    );
  }

  try {
    // Remove the product from the cart
    await db.execute(
      'DELETE FROM cart WHERE CustomerID = ? AND ProductID = ?',
      [CustomerID, ProductID]
    );

    return new Response(
      JSON.stringify({ message: 'Product removed from cart successfully.' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing product from cart:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error.' }),
      { status: 500 }
    );
  }
}