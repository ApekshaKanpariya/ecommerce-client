import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { fetchCart, removeFromCart, updateQuantity } from '../store/cartSlice';
import { RootState } from '../store';

const Cart: React.FC = () => {
    const dispatch = useDispatch();
    const { items, total, loading, error } = useSelector((state: RootState) => state.cart);

    useEffect(() => {
        dispatch(fetchCart() as any);
    }, [dispatch]);

    const handleRemoveFromCart = async (productId: string) => {
        try {
            dispatch(removeFromCart(productId) as any);
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        }
    };

    const handleUpdateQuantity = async (productId: string, quantity: number) => {
        try {
            dispatch(updateQuantity({ id: productId, quantity }) as any);
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
            {items.length === 0 ? (
                <Typography>Your cart is empty</Typography>
            ) : (
                <>
                    <List>
                        {items.map((item) => (
                            <ListItem key={item._id}>
                                <ListItemText
                                    primary={item.name}
                                    secondary={`Quantity: ${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleRemoveFromCart(item._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                    <Typography variant="h6" align="right">Total: ${total.toFixed(2)}</Typography>
                    <Button
                        component={Link}
                        to="/checkout"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Proceed to Checkout
                    </Button>
                </>
            )}
        </Container>
    );
};

export default Cart;