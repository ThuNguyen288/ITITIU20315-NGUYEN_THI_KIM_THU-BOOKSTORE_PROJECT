'use client';

import { useEffect, useState } from 'react';
import {
  Rating,
  Typography,
  Box,
  Divider,
  Button
} from '@mui/material';

export default function RatingDisplay({ productId }) {
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await fetch(`/api/reviews?ProductID=${productId}`);
        const data = await res.json();

        if (res.ok && data.reviews) {
          setReviews(data.reviews);
          setAverageRating(data.overallRating || 0);
          setReviewCount(data.RatingCount);
        } else {
          console.error("Invalid review data", data);
        }
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };

    fetchRatings();
  }, [productId]);

  const handleShowMore = () => setVisibleCount(prev => prev + 3);
  const handleShowLess = () => setVisibleCount(3);

  const visibleReviews = reviews.slice(0, visibleCount);

  return (
    <Box sx={{ mt: 4 }}>
      {/* Tổng quan */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Rating name="read-only" value={averageRating} precision={0.5} readOnly />
        <Typography variant="body2" color="text.secondary">
          ({reviewCount} reviews)
        </Typography>
      </Box>

      <Divider sx={{ mb: 2, borderColor: '#e0e0e0' }} />

      {/* Danh sách đánh giá */}
      {visibleReviews.map((review) => (
        <Box
          key={review.ReviewID}
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 3,
            backgroundColor: '#fdfdfd',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <Typography
            fontWeight="600"
            fontSize={{ xs: '0.95rem', sm: '1rem' }}
            color="text.primary"
          >
            {review.CustomerName || 'Ẩn danh'}
          </Typography>

          <Rating
            value={review.Rating}
            readOnly
            size="small"
            sx={{ mt: 0.5, mb: 0.5 }}
          />

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              lineHeight: 1.6,
            }}
          >
            {review.Comment || 'Không có nhận xét'}
          </Typography>

          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ display: 'block', mt: 1 }}
          >
            {new Date(review.ReviewDate).toLocaleDateString()}
          </Typography>
        </Box>
      ))}

      {/* Nút xem thêm / ẩn bớt */}
      {reviews.length > 3 && (
        <Box textAlign="center" mt={1}>
          {visibleCount < reviews.length ? (
            <Button
              onClick={handleShowMore}
              variant="outlined"
              color="primary"
              sx={{ borderRadius: '999px', textTransform: 'none' }}
            >
              Xem thêm đánh giá
            </Button>
          ) : (
            <Button
              onClick={handleShowLess}
              variant="outlined"
              color="secondary"
              sx={{ borderRadius: '999px', textTransform: 'none' }}
            >
              Ẩn bớt
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
