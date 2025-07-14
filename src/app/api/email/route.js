import db from '@/app/api/dbConect'
import nodemailer from 'nodemailer'

// Hàm render HTML sản phẩm
function renderProductHTML(products) {
  return `
    <div style="font-family: Inter, sans-serif; background-color: #f9fafb; padding: 32px 16px;">
      ${products.map(p => `
        <div style="
          max-width: 600px;
          margin: 0 auto 40px;
          background-color: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        ">
          <div style="text-align: center;">
            <img 
              src="${p.image}" 
              alt="${p.Name}" 
              style="width: 160px; height: 220px; object-fit: cover; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 16px;"
            />
            <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 12px;">${p.Name}</h2>
          </div>

          <div style="font-size: 15px; color: #374151; line-height: 1.6;">
            ${p.Author ? `<p style="margin: 4px 0;"><strong>Tác giả:</strong> ${p.Author}</p>` : ''}
            ${p.PublishYear ? `<p style="margin: 4px 0;"><strong>Năm XB:</strong> ${p.PublishYear}</p>` : ''}
            ${p.PenType ? `<p style="margin: 4px 0;"><strong>Loại bút:</strong> ${p.PenType}</p>` : ''}
            ${p.InkColor ? `<p style="margin: 4px 0;"><strong>Màu mực:</strong> ${p.InkColor}</p>` : ''}
            ${p.Stock !== undefined ? `<p style="margin: 4px 0;"><strong>Tồn kho:</strong> ${p.Stock}</p>` : ''}
            <p style="margin: 4px 0;"><strong>Giá:</strong> <span style="color: #dc2626; font-weight: 600;">${Number(p.Price).toLocaleString()}₫</span></p>
            <p style="margin: 4px 0;"><strong>Đánh giá:</strong> ${p.Rating || 0} ⭐ (${p.RatingCount || 0} đánh giá)</p>
            ${p.Description ? `<p style="margin-top: 16px;">${p.Description}</p>` : ''}
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a 
              href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pages/main/customer/product/${p.ProductID}" 
              style="
                display: inline-block;
                background-color: #2563eb;
                color: white;
                padding: 10px 24px;
                font-weight: 500;
                font-size: 14px;
                border-radius: 9999px;
                text-decoration: none;
              "
            >
              Xem sản phẩm
            </a>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}


export async function POST(req) {
  try {
    const { type, subject, content, recipients } = await req.json()

    if (!subject || !type) {
      return new Response(JSON.stringify({ error: 'Invalid Information' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 1. Lấy danh sách email khách hàng
    let recipientEmails = []
    if (recipients === 'all') {
      const [rows] = await db.execute(`SELECT Email FROM customers WHERE CustomerID = 1`)
      recipientEmails = rows.map((r) => r.Email)
    }

    if (!recipientEmails.length) {
      return new Response(JSON.stringify({ error: 'No customer email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 2. Lấy danh sách sản phẩm từ API nội bộ
    const origin = req.headers.get('origin') || 'http://localhost:3000'
    let productRes
    if (type === 'best-seller') {
      productRes = await fetch(`${origin}/api/BestSeller`)
    } else {
      productRes = await fetch(`${origin}/api/NewArrival`)
    }

    const { products } = await productRes.json()
    const productHTML = renderProductHTML(products)

    // 3. Gửi email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const emailHTML = `
      <div style="font-family: sans-serif;">
        <h2>${subject}</h2>
        <p>${content || ''}</p>
        ${productHTML}
      </div>
    `

    for (const email of recipientEmails) {
      await transporter.sendMail({
        from: `"RainBow Notification" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: emailHTML,
      })
    }

    return new Response(JSON.stringify({ message: 'Email send successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('Lỗi gửi email:', err)
    return new Response(JSON.stringify({ error: 'Lỗi server', detail: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
