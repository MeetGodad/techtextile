"use client";

import Checkout from "./checkoutProcess";
import Header from "../components/Navbar";
import Footer from "../components/Footer";
import { Elements  } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Page() {
    return (
    <div>
        <Elements  stripe={stripePromise} >
        <Header />
        <Checkout />
        <Footer />
        </Elements>
    </div>
    );
}