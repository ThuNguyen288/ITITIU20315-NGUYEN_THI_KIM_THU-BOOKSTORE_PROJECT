import { NextResponse } from "next/server";
import db from "../../../dbConect";

export async function GET() {
    try {
        // Lấy ngày đầu tuần (Thứ Hai của tuần hiện tại)
        const startOfWeek = `DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)`;

        // Truy vấn doanh thu trong tuần hiện tại
        const [rows] = await db.execute(`
            SELECT 
                DATE_FORMAT(Sale_date, '%W') AS Day,  -- Lấy tên ngày (Monday, Tuesday, ...)
                COALESCE(SUM(Quantity * Cost), 0) AS Cost,
                COALESCE(SUM(Total - Quantity * Cost), 0) AS Outfit,
                MIN(Sale_date) AS SortDate  -- Thêm ngày sớm nhất trong nhóm để sắp xếp
            FROM revenue
            WHERE Sale_date >= ${startOfWeek}
            GROUP BY Day
            ORDER BY SortDate;
        `);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("❌ Lỗi lấy dữ liệu doanh thu tuần:", error);
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}
