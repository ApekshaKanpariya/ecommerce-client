import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {store} from './store';
import App from './App';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';


// Load your Stripe publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

ReactDOM.render(
    <React.StrictMode> <Provider store={store}>
        <Elements stripe={stripePromise}>
            <App/>
        </Elements>
    </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
