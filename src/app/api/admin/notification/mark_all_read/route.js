import db from "@/app/api/dbConect";

export async function POST() {
  try {
    const [result] = await db.execute(
      'UPDATE notifications SET Status = "Read" WHERE Status = "Unread"'
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: `${result.affectedRows} notifications marked as read.`
      }), 
      { status: 200 }
    );
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
}
