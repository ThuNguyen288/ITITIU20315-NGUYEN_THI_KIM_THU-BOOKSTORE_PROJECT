'use client';

import React, { useState, useEffect } from 'react';
import { Rating, TextField, Button, Box, Typography, Alert, Grid, Card, CardContent, CardActions } from '@mui/material';

export default function SubmitReviewForm({ ProductID, CustomerID, OrderID }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    // Kiểm tra xem đã đánh giá chưa
    const fetchReview = async () => {
      try {
        const res = await fetch(`/api/reviews/check?ProductID=${ProductID}&CustomerID=${CustomerID}&OrderID=${OrderID}`);
        const data = await res.json();
        if (res.ok && data.review) {
          setExistingReview(data.review);
          setSubmitted(true);
        }
      } catch (err) {
        console.error('Error checking review:', err);
      }
    };
    fetchReview();
  }, [ProductID, CustomerID, OrderID]);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please give a rating');
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ProductID,
          CustomerID,
          Rating: rating,
          Comment: comment,
          OrderID
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit review');
      }

      setSubmitted(true);
      setExistingReview({ Rating: rating, Comment: comment }); // Lưu lại đánh giá đã gửi
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (submitted || existingReview) {
    return (
      <Box sx={{ mt: 3, mb: 4 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" color="primary">Thank you for your review!</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              You have already rated this product.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Rating value={existingReview ? existingReview.Rating : 0} readOnly />
              <Typography variant="body1" sx={{ mt: 1 }}>{existingReview ? existingReview.Comment : ''}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3, mb: 4 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>Rate and Review This Product</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Rating
                name="user-rating"
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                sx={{ fontSize: 30 }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Leave a comment"
                variant="outlined"
                margin="normal"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Grid>
          </Grid>
          {error && <Alert severity="error">{error}</Alert>}
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Review
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
