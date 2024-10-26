import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from "../axios";

interface WishlistItem {
    _id: string;
    name: string;
    price: number;
}

interface WishlistState {
    items: WishlistItem[];
    loading: boolean;
    error: string | null;
}

const initialState: WishlistState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async () => {
    const response = await apiClient.get(`/wishlist`);
    return response.data;
});

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (product: WishlistItem) => {
    const response = await apiClient.post(`/wishlist/add/${product._id}`);
    return response.data;
});

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (productId: string) => {
    await apiClient.delete(`/wishlist/remove/${productId}`);
    return productId;
});

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch wishlist';
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
            });
    },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;