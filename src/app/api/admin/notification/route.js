import db from "../../dbConect";

export async function GET(req) {
  try {
    // Fetch all notifications from the database
    const [notifications] = await db.execute('SELECT * FROM notifications ORDER BY CreatedAt DESC');

    // If no notifications are found
    if (notifications.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No notifications found' }),
        { status: 404 }
      );
    }

    // Return the notifications if found
    return new Response(
      JSON.stringify({ notifications }), 
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching notifications:', err);

    // Return an error response
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
export async function PUT(req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const notificationId = url.searchParams.get('notificationId'); // Get notificationId from query parameter
  
    if (!notificationId) {
      return new Response(JSON.stringify({ message: 'Notification ID is required' }), { status: 400 });
    }
  
    try {
      const [result] = await db.execute(
        'UPDATE notifications SET Status = "Read" WHERE NotificationID = ?',
        [notificationId]
      );
  
      if (result.affectedRows === 0) {
        return new Response(JSON.stringify({ message: 'Notification not found' }), { status: 404 });
      }
  
      return new Response(JSON.stringify({ message: 'Notification marked as read' }), { status: 200 });
    } catch (err) {
      console.error('Error updating notification:', err);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
  }