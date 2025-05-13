export async function fetchFromGoogleBooks(attributes) {
  try {
    const query = attributes.join(' ');
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.items) return [];

    // Format lại kết quả
    const books = data.items.map((item, index) => {
      const volume = item.volumeInfo;
      return {
        source: "google",
        ProductID: 90000 + index,
        Name: volume.title || "No Title",
        Description: volume.description || "",
        Author: (volume.authors || []).join(", "),
        PublishYear: volume.publishedDate?.substring(0, 4) || "",
        image: volume.imageLinks?.thumbnail || "https://via.placeholder.com/150",
        // Dùng item thay vì product
        PreviewLink: volume.previewLink || item.accessInfo?.webReaderLink || "#"
      };
    });

    return books;

  } catch (err) {
    console.error("Error calling Google Books API:", err);
    return [];
  }
}
