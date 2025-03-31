import { NextResponse } from "next/server";
import db from "../../dbConect";

export async function GET() {
    try {
        const [rows] = await db.execute(`
             SELECT 
                CASE 
                    WHEN p.CategoryID = 1 THEN 'Sách' 
                    WHEN p.CategoryID = 2 THEN 'Bút' 
                    ELSE 'Khác' 
                END AS Category,
                COALESCE(SUM(r.Quantity), 0) AS TotalSold
            FROM revenue r
            JOIN products p ON r.ProductID = p.ProductID
            WHERE r.Sale_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
            GROUP BY p.CategoryID;
        `);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("❌ Lỗi lấy dữ liệu sản phẩm bán ra:", error);
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}
