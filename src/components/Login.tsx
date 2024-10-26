import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { TextField, Button, Container, Typography } from '@mui/material';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

interface LoginForm {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { control, handleSubmit } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        try {
            dispatch(login(data) as any);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } }}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            label="Email"
                            fullWidth
                            margin="normal"
                            error={!!error}
                            helperText={error?.message}
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } }}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            type="password"
                            label="Password"
                            fullWidth
                            margin="normal"
                            error={!!error}
                            helperText={error?.message}
                        />
                    )}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Login
                </Button>
            </form>
        </Container>
    );
};

export default Login;