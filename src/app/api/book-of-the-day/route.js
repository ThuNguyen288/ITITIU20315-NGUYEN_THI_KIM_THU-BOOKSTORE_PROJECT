import { NextResponse } from 'next/server'
import db from '../dbConect'

export async function GET() {
  try {
    const [rows] = await db.execute(`
      SELECT 
        p.ProductID,
        p.Name,
        p.Description,
        p.Rating,
        p.Sold,
        p.Clicked,
        p.Price,
        p.Author,
        p.Publisher,
        p.PublishYear,
        pi.ImageURL
      FROM products p
      LEFT JOIN productimages pi 
        ON p.ProductID = pi.ProductID AND pi.IsPrimary = 1
      WHERE p.CategoryID = 1
      ORDER BY 
        p.Rating DESC,
        p.Sold DESC,
        p.Clicked DESC
      LIMIT 8
    `)


    return NextResponse.json(rows)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
