import { evaluateMetrics } from "../../../../script/evaluateRecommendation";

export async function GET() {
  try {
    const result = await evaluateMetrics(4);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API /api/evaluate failed:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", detail: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
