'use client';

import { useEffect, useState } from 'react';
import { Rating, Typography, Box, Divider } from '@mui/material';

export default function RatingDisplay({ productId }) {
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviews, setReviews] = useState([]);

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

  return (
    <Box sx={{ mt: 3 }}>
      {/* Tổng quan */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Rating name="read-only" value={averageRating} precision={0.5} readOnly />
        <Typography variant="body2">({reviewCount} reviews)</Typography>
      </Box>
      <hr className='bg-black '/>
      {/* Chi tiết từng đánh giá */}
      {reviews.map((review) => (
        <Box key={review.ReviewID} sx={{ mb: 2 }}>
          <Typography fontWeight="bold" fontSize={'1rem'}>{review.CustomerName || 'Ẩn danh'}</Typography>
          <Rating value={review.Rating} readOnly size="small" />
          <Typography variant="body2" sx={{ mt: 0.5, mb: 0.5 }}>
            {review.Comment || 'Không có nhận xét'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(review.ReviewDate).toLocaleDateString()}
          </Typography>
          <Divider sx={{ mt: 1, height: '1px', backgroundColor: 'gray' }} />
        </Box>
      ))}
    </Box>
  );
}
