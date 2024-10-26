import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Typography, Button, Grid, Paper} from '@mui/material';
import {fetchProductById} from '../store/productSlice';
import {addToCart} from '../store/cartSlice';
import {addToWishlist} from '../store/wishlistSlice';
import {RootState} from '../store';

const ProductDetails: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const dispatch = useDispatch();
    // @ts-ignore
    const {currentProduct, loading, error} = useSelector((state: RootState) => state.products);

    useEffect(() => {
        if (id) {
            // @ts-ignore
            dispatch(fetchProductById(id));
        }
    }, [dispatch, id]);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!currentProduct) return <Typography>Product not found</Typography>;

    return (
        <Container>
            <Paper elevation={3} sx={{p: 3, mt: 3}}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <img src={currentProduct.image} alt={currentProduct.name}
                             style={{width: '100%', height: 'auto'}}/>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" gutterBottom>{currentProduct.name}</Typography>
                        <Typography variant="h6" color="primary"
                                    gutterBottom>${currentProduct.price.toFixed(2)}</Typography>
                        <Typography variant="body1" paragraph>{currentProduct.description}</Typography>
                        <Button
                            onClick={() => dispatch(addToCart(currentProduct) as any)}
                            variant="contained"
                            sx={{mr: 2}}
                        >
                            Add to Cart
                        </Button>
                        <Button
                            onClick={() => dispatch(addToWishlist(currentProduct) as any)}
                            variant="outlined"
                        >
                            Add to Wishlist
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default ProductDetails;