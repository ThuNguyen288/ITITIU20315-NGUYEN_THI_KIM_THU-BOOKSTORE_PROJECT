import db from "../../dbConect";

// GET method: Lấy danh mục, tags và sản phẩm
export async function GET(req) {
  try {
    const [categories] = await db.execute('SELECT * FROM categories');
    const [tags] = await db.execute('SELECT * FROM tags');
    const [products] = await db.execute(`
      SELECT
        p.*,
        pi.ImageURL AS image
      FROM products p
      LEFT JOIN productimages pi
      ON p.ProductID = pi.ProductID AND pi.IsPrimary = 1;
    `);

    return new Response(
      JSON.stringify({ categories, tags, products }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching data:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// POST method: Thêm sản phẩm mới
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      penType,
      inkColor,
      author,
      publishYear,
      tags,
      images,
    } = body;
    console.log("Product Data:", {
      name,
      description,
      price,
      stock,
      categoryId,
      penType,
      inkColor,
      author,
      publishYear,
      tags,
      images,
    });
    
    if (!name || !description || !price || !stock || !categoryId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Thêm sản phẩm vào bảng `products`
    const [product] = await db.execute(
      "INSERT INTO products (Name, Description, Price, Stock, CategoryID) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, stock, categoryId]
    );

    const productId = product.insertId;

    // Thêm chi tiết sản phẩm cụ thể (sách hoặc bút)
    if (categoryId === 1) {
      await db.execute(
        "INSERT INTO books (ProductID, Author, PublishYear) VALUES (?, ?, ?)",
        [productId, author, publishYear]
      );
    } else if (categoryId === 2) {
      await db.execute(
        "INSERT INTO pens (ProductID, PenType, InkColor) VALUES (?, ?, ?)",
        [productId, penType, inkColor]
      );
    }

    // Thêm tags
    if (Array.isArray(tags) && tags.length > 0) {
      await Promise.all(
        tags.map(async (tagId) => {
          await db.execute(
            "INSERT INTO product_tag (ProductID, TagID) VALUES (?, ?)",
            [productId, tagId]
          );
        })
      );
    }

    // Thêm ảnh
    if (Array.isArray(images) && images.length > 0) {
      await Promise.all(
        images.map(async (image, index) => {
          const isPrimary = index === 0 ? 1 : 0;
          await db.execute(
            "INSERT INTO productimages (ProductID, ImageURL, IsPrimary) VALUES (?, ?, ?)",
            [productId, image, isPrimary]
          );
        })
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error adding product:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}