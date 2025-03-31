import { NextResponse } from "next/server";
import db from "../../dbConect";

export async function GET() {
    try {
        const [rows] = await db.execute(`
            SELECT 
                DATE_FORMAT(OrderDate, '%Y-%m') AS Month,
                COUNT(OrderID) AS TotalOrders
            FROM orders
            WHERE OrderDate >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY Month
            ORDER BY Month;
        `);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching order data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
