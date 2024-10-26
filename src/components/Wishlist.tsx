import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { fetchWishlist, removeFromWishlist } from '../store/wishlistSlice';
import { addToCart } from '../store/cartSlice';
import { RootState } from '../store';

const Wishlist: React.FC = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state: RootState) => state.wishlist);

    useEffect(() => {
        dispatch(fetchWishlist() as any);
    }, [dispatch]);

    const handleRemoveFromWishlist = async (productId: string) => {
        try {
            dispatch(removeFromWishlist(productId) as any);
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        }
    };

    const handleAddToCart = async (product: any) => {
        try {
            dispatch(addToCart(product) as any);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Wishlist</Typography>
            {items.length === 0 ? (
                <Typography>Your wishlist is empty</Typography>
            ) : (
                <List>
                    {items.map((item) => (
                        <ListItem key={item._id}>
                            <ListItemText
                                primary={item.name}
                                secondary={`$${item?.price?.toFixed(2)}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="add to cart"
                                    onClick={() => handleAddToCart(item)}
                                    sx={{ mr: 1 }}
                                >
                                    <ShoppingCartIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleRemoveFromWishlist(item._id)}
                                >
                                    <DeleteIcon />

                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default Wishlist;
