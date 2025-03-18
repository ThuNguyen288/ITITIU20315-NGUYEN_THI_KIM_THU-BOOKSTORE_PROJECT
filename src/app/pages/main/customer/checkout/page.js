'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, TextField, Select, MenuItem, Button, Grid, Paper } from "@mui/material";
import { brown, red } from '@mui/material/colors';

export default function Checkout() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(20000); // Mặc định phí ship
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Mặc định là Thanh toán khi nhận hàng (COD)
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CustomerID = typeof window !== 'undefined' ? localStorage.getItem('customerId') || '' : '';

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('selectedItems')) || [];
    setSelectedItems(items);
    if (items.length > 0) {
      const totalCost = items.reduce((sum, item) => sum + item.Price * item.Quantity, 0);
      setSubtotal(totalCost);
      setTotal(totalCost + shippingFee - discount);
    } else {
      setSubtotal(0);
      setTotal(shippingFee - discount);
    }
  }, [shippingFee, discount]);

  useEffect(() => {
    async function fetchData() {
      if (!CustomerID) {
        setError("Missing customer ID");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/customer/${CustomerID}`);
        if (!response.ok) throw new Error("Failed to fetch customer data");

        const data = await response.json();
        setAddress(data.Address || '');
        setPhone(data.PhoneNumber || '');
        setEmail(data.Email || '');
        setName(data.Name || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [CustomerID]);

  const validatePhoneNumber = (phone) => /^[0-9]{10,11}$/.test(phone);

  const handleApplyVoucher = async () => {
    try {
      const response = await fetch('/api/voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherCode }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Invalid voucher code');

      setDiscount(result.discountAmount || 0);
      alert('Voucher applied successfully!');
    } catch (err) {
      alert(err.message);
      setDiscount(0);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validatePhoneNumber(phone)) {
      alert('Invalid phone number! Please enter a valid one.');
      return;
    }

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          CustomerID,
          items: selectedItems,
          subtotal,
          shippingFee,
          discount,
          total,
          address,
          phone,
          name,
          email,
          paymentMethod,
          voucherCode,
        }),
      });

      if (!response.ok) throw new Error('Failed to place order');

      alert('Order placed successfully!');
      localStorage.removeItem('selectedItems');
      window.location.href = '/';
    } catch (err) {
      console.error(err.message);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <Box sx={{ width: "100%", mx: "auto", py: 3, px: 4, maxWidth: "1200px" }}>
      <Typography variant="h5" align="center" gutterBottom>CHECKOUT</Typography>
      {error && <Typography color="error" align="center">{error}</Typography>}

      {selectedItems.length === 0 ? (
        <Typography align="center" color="text.secondary">Your cart is empty.</Typography>
      ) : (
        <Grid container spacing={2}>
          {/* Left side: Product Review (2/3 of the page) */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Order Summary</Typography>
              {selectedItems.map((item) => (
                <Card key={item.ProductID} sx={{ display: "flex", my: 1, p: 1 }} variant="outlined">
                  <CardMedia component="img" image={item.Image || "https://via.placeholder.com/80"} alt={item.Name} sx={{ width: 60, borderRadius: 1 }} />
                  <CardContent sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2">{item.Name}</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 12 }}>{item.Price} VND</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 12 }}>Qty: {item.Quantity}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>

          {/* Right side: Shipping, Payment, Summary (1/3 of the page) */}
          <Grid item xs={12} md={4}>
            <Paper square={false} elevation={2} sx={{ p: 2, backgroundColor: red[50] }}>
              {/* Shipping Information */}
              <Typography variant="subtitle1">Shipping</Typography>
              <TextField label="Name" fullWidth size="small" value={name} onChange={(e) => setName(e.target.value)} sx={{ mt: 1 }} />
              <TextField label="Address" fullWidth size="small" value={address} onChange={(e) => setAddress(e.target.value)} sx={{ mt: 1 }} />
              <TextField label="Phone" fullWidth size="small" value={phone} onChange={(e) => setPhone(e.target.value)} sx={{ mt: 1 }} />

              {/* Payment Method */}
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Payment</Typography>
              <Select fullWidth size="small" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} sx={{ mt: 1 }}>
                <MenuItem value="cod">Cash on Delivery</MenuItem>
                <MenuItem value="credit_card">Credit Card</MenuItem>
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              </Select>

              {/* Apply Voucher */}
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Voucher</Typography>
              <Box display="flex" mt={1}>
                <TextField fullWidth size="small" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} placeholder="Enter code" />
                <Button variant="contained" color="primary" sx={{ ml: 1, minWidth: "80px" }} onClick={handleApplyVoucher}>Apply</Button>
              </Box>

              {/* Order Summary */}
              <Box mt={2} textAlign="right">
                <Typography variant="body2">Subtotal: {subtotal} VND</Typography>
                <Typography variant="body2">Shipping: {shippingFee} VND</Typography>
                <Typography variant="body2" color="error">Discount: -{discount} VND</Typography>
                <Typography variant="subtitle1" fontWeight="bold">Total: {total} VND</Typography>
                <Button variant="contained" color="success" fullWidth sx={{ mt: 2 }} onClick={handlePlaceOrder}>
                  Place Order
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};