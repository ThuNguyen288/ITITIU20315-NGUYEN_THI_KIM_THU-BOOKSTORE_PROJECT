import { NextResponse } from 'next/server';
import db from '@/app/api/dbConect';

const tagSynonyms = {
  "Adventure": ["adventure", "journey", "quest", "expedition", "exploration"],
  "Romance": ["romance", "love", "relationship", "affection"],
  "Novel": ["novel", "literature", "story", "narrative", "fiction book"],
  "Magic": ["magic", "wizard", "witch", "spell", "sorcery", "fantasy"],
  "Detective": ["detective", "mystery", "crime", "investigation", "case", "sherlock"],
  "Fiction": ["fiction", "imaginative", "non-real", "literary", "storytelling"],
  "Biology": ["biology", "cell", "organism", "genetics", "anatomy", "microbiology"],
  "History": ["history", "historical", "past events", "war", "ancient", "medieval"],
  "Science": ["science", "experiment", "physics", "chemistry", "scientific", "theory"],
  "Philosophy": ["philosophy", "thinking", "existence", "ethics", "logic", "metaphysics"],
  "Psychology": ["psychology", "mind", "behavior", "mental", "cognitive", "emotions"],
  "Children": ["children", "kids", "storybook", "picture book", "young reader", "fairy tale"],
  "Self-help": ["self-help", "motivation", "productivity", "life skills", "success", "personal growth"],
  "Business": ["business", "entrepreneurship", "startup", "strategy", "marketing", "finance"],
  "Education": ["education", "learning", "teaching", "study", "classroom", "academic"],
  "Technology": ["technology", "computer", "software", "AI", "coding", "internet"],
  "Thriller": ["thriller", "suspense", "tense", "chase", "danger", "killer"],
  "Horror": ["horror", "scary", "ghost", "monster", "fear", "nightmare"],
  "Comedy": ["comedy", "humor", "funny", "laugh", "joke", "satire"],
  "Cooking": ["cooking", "recipe", "food", "kitchen", "chef", "culinary"],
  "Health": ["health", "wellness", "nutrition", "exercise", "fitness", "medical"],
  "Art": ["art", "drawing", "painting", "design", "creative", "visual"],
  "Religion": ["religion", "spiritual", "faith", "belief", "bible", "god"]
};

export async function GET() {
  try {
    const [products] = await db.execute('SELECT * FROM products');

    for (const product of products) {
      let matchedTags = [];

      // Tìm các tag phù hợp trong name hoặc description
      for (const [tagName, synonyms] of Object.entries(tagSynonyms)) {
        const regex = new RegExp(`\\b(${synonyms.join('|')})\\b`, 'i');
        if (regex.test(product.Name || '') || regex.test(product.Description || '')) {
          matchedTags.push(tagName);
        }
      }

      if (matchedTags.length > 0) {
        // Lấy TagIDs chính xác
        const placeholders = matchedTags.map(() => '?').join(',');
        const [tagRows] = await db.execute(
          `SELECT TagID FROM tags WHERE Name IN (${placeholders})`,
          matchedTags
        );

        const tagIDs = tagRows.map(row => row.TagID);

        if (tagIDs.length > 0) {
          // Gộp nhiều TagIDs thành chuỗi cách dấu phẩy
          const tagIDString = tagIDs.join(',');

          await db.execute(
            'UPDATE products SET TagID = ? WHERE ProductID = ?',
            [tagIDString, product.ProductID]
          );
        }
      }
    }

    return NextResponse.json({ message: 'Đã gán tag thành công!' }, { status: 200 });
  } catch (err) {
    console.error('Lỗi auto-tag:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
