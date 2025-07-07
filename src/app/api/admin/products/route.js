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
      cost,
      price,
      stock,
      categoryId,
      penType,
      inkColor,
      author,
      publisher,
      publishYear,
      tags,  // Là mảng các TagID
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
      publisher,
      publishYear,
      tags,
      images,
    });

    if (!name || !description || !cost || !price || !stock || !categoryId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Chuyển mảng tags thành chuỗi, cách nhau bằng dấu ","
    const tagIds = Array.isArray(tags) ? tags.join(",") : "";

    // Thêm sản phẩm vào bảng `products`
    const [product] = await db.execute(
      "INSERT INTO products (Name, Description, Cost, OriginalPrice, Stock, CategoryID, Author, Publisher, PublishYear, PenType, InkColor, TagID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        description,
        cost,
        price,
        stock,
        categoryId,
        author || null,
        publisher || null,  // Publisher column (can be added if needed)
        publishYear || null,
        penType || null,
        inkColor || null,
        tagIds  // Lưu các TagID vào cột TagID dưới dạng chuỗi
      ]
    );

    const productId = product.insertId;

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
