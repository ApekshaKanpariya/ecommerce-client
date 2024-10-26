import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, Badge, IconButton } from '@mui/material';
import { ShoppingCart, Favorite } from '@mui/icons-material';
import { logout } from '../store/authSlice';
import { RootState } from '../store';

const Header: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { items: cartItems } = useSelector((state: RootState) => state.cart);
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);

    const handleLogout = () => {
        dispatch(logout() as any);
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                    E-Commerce Store
                </Typography>
                <Button color="inherit" component={Link} to="/products">
                    Products
                </Button>
                {isAuthenticated && (
                    <>
                        <IconButton color="inherit" component={Link} to="/cart">
                            <Badge badgeContent={cartItems.length} color="secondary">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                        <IconButton color="inherit" component={Link} to="/wishlist">
                            <Badge badgeContent={wishlistItems.length} color="secondary">
                                <Favorite />
                            </Badge>
                        </IconButton>
                    </>
                )}
                {isAuthenticated ? (
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={Link} to="/register">
                            Register
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;