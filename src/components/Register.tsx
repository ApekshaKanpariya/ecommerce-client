import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { TextField, Button, Container, Typography } from '@mui/material';
import { register as registerUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { control, handleSubmit, watch } = useForm<RegisterForm>();
    const password = watch('password');

    const onSubmit = async (data: RegisterForm) => {
        try {
            dispatch(registerUser(data) as any);
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                Register
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Name is required' }}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            label="Name"
                            fullWidth
                            margin="normal"
                            error={!!error}
                            helperText={error?.message}
                        />
                    )}
                />
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
                <Controller
                    name="confirmPassword"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: 'Confirm Password is required',
                        validate: (value) => value === password || 'The passwords do not match'
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            type="password"
                            label="Confirm Password"
                            fullWidth
                            margin="normal"
                            error={!!error}
                            helperText={error?.message}
                        />
                    )}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Register
                </Button>
            </form>
        </Container>
    );
};

export default Register;