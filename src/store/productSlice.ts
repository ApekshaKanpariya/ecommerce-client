import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from "../axios";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
}

interface ProductState {
    products: Product[];
    currentProduct: Product | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const response = await apiClient.get('/products');
    return response.data;
});

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id: string) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
});

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch products';
            })
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch product';
            });
    },
});

export default productSlice.reducer;