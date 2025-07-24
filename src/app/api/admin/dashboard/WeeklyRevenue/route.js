import { NextResponse } from "next/server";
import db from "../../../dbConect";

export async function GET() {
    try {
        const [rows] = await db.execute(`
            SELECT 
                DATE_FORMAT(Sale_date, '%W') AS Day,
                COALESCE(SUM(Quantity * Cost), 0) AS Cost,
                COALESCE(SUM(Quantity * (Price - Cost)), 0) AS Outfit,
                MIN(Sale_date) AS SortDate
            FROM revenue
            WHERE Sale_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
            GROUP BY Day
            ORDER BY SortDate;
        `);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("❌ Lỗi lấy dữ liệu doanh thu tuần:", error);
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}
