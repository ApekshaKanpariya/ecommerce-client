import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import apiClient from "../axios";

interface CartItem {
    _id: string;
    name: string;
    product: {
        _id: string;
        name: string;
        price: number;
        image: string
    }
    quantity: number;
}

interface CartState {
    items: CartItem[];
    total: number;
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    items: [],
    total: 0,
    loading: false,
    error: null,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
    const response = await apiClient.get(`/cart`);
    return response.data;
});

export const addToCart = createAsyncThunk('cart/addToCart', async (product: any) => {
    const response = await apiClient.post(`/cart/add`, {
        productId: product._id,
        quantity: 1
    });
    return response.data;
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId: string) => {
    await apiClient.delete(`/cart/remove/${productId}`);
    return productId;
});

export const updateQuantity = createAsyncThunk(
    'cart/updateQuantity',
    async ({id, quantity}: { id: string; quantity: number }) => {
        const response = await apiClient.put(`/cart/update/${id}`, {quantity});
        return response.data;
    }
);

export const clearCart = createAsyncThunk('cart/clearCart', async () => {
    await apiClient.delete(`/cart/clear`);
    return;
});

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.total = state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch cart';
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload;
                state.total = state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
                state.total = state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
            })
            .addCase(updateQuantity.fulfilled, (state, action) => {
                state.items = action.payload;
                state.total = state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
            }).addCase(clearCart.fulfilled, (state) => {
            state.items = [];
            state.total = 0;
        }).addCase(clearCart.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to clear cart';
        });
    }
});

export default cartSlice.reducer;