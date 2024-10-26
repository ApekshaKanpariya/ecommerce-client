import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { clearCart } from '../store/cartSlice';
import { RootState } from '../store';
import apiClient from "../axios";

const Checkout: React.FC = () => {
    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();
    const { items, total } = useSelector((state: RootState) => state.cart);
    console.log("=>(Checkout.tsx:14) total", total);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        const fetchPaymentIntent = async () => {
            try {
                const response = await apiClient.post(`/payment/create-payment-intent`, { amount: total });
                setClientSecret(response.data.clientSecret);
            } catch (error) {
                console.error('Error fetching payment intent:', error);
                setError('Failed to initialize payment. Please try again.');
            }
        };

        if (total > 0) {
            fetchPaymentIntent();
        }
    }, [total]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)!,
            }
        });

        if (result.error) {
            setError(result.error.message || 'An error occurred');
            setProcessing(false);
        } else {
            // Payment successful
            try {
                dispatch(clearCart() as any);
                setProcessing(false);
                // Redirect to a success page or show a success message
            } catch (error) {
                console.error('Error creating order:', error);
                setError('Payment successful, but failed to create order. Please contact support.');
                setProcessing(false);
            }
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Checkout</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Name" required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Email" type="email" required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Address" required />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>Payment Details</Typography>
                        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
                    </Grid>
                </Grid>
                {error && <Typography color="error">{error}</Typography>}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!stripe || processing}
                    sx={{ mt: 3 }}
                >
                    Pay ${total.toFixed(2)}
                </Button>
            </form>
        </Container>
    );
};

export default Checkout;