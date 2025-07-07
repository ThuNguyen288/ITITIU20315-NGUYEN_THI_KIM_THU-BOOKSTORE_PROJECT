import { NextResponse } from "next/server";
import db from "../../../dbConect";

export async function GET() {
    try {
        const [rows] = await db.execute(`
            WITH DateSeries AS (
                SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%Y-%m') AS Month
                FROM (
                    SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
                    UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
                    UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11
                ) AS Numbers
            )
            SELECT 
                d.Month,
                COALESCE(SUM(r.Cost), 0) AS Cost,
                COALESCE(SUM(r.Total - r.Cost), 0) AS Outfit,
                COALESCE(SUM(r.Total), 0) AS Revenue
            FROM DateSeries d
            LEFT JOIN revenue r ON DATE_FORMAT(r.Sale_date, '%Y-%m') = d.Month
            GROUP BY d.Month
            ORDER BY d.Month;
        `);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching revenue data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
