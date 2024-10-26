import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Container } from '@mui/material';
import { fetchProducts } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import { addToWishlist } from '../store/wishlistSlice';
import { RootState } from '../store';
import ErrorMessage from './ErrorMessage';

const ProductList: React.FC = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state: RootState) => state.products);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchProducts() as any);
    }, [dispatch]);

    const handleAddToCart = async (product: any) => {
        try {
            dispatch(addToCart(product) as any);
        } catch (error) {
            setApiError('Failed to add item to cart. Please try again.');
        }
    };

    const handleAddToWishlist = async (product: any) => {
        try {
            dispatch(addToWishlist(product) as any);
        } catch (error) {
            setApiError('Failed to add item to wishlist. Please try again.');
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <ErrorMessage message={error}/>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Products</Typography>
            {apiError && <ErrorMessage message={apiError}/>}
            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={product.image}
                                alt={product.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ${product?.price?.toFixed(2) || ''}
                                </Typography>
                                <Button
                                    component={Link}
                                    to={`/products/${product._id}`}
                                    variant="outlined"
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    View Details
                                </Button>
                                <Button
                                    onClick={() => handleAddToCart(product)}
                                    variant="contained"
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Add to Cart
                                </Button>
                                <Button
                                    onClick={() => handleAddToWishlist(product)}
                                    variant="outlined"
                                    sx={{ mt: 1 }}
                                >
                                    Add to Wishlist
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ProductList;
