"use client";

import Header from "../components/Navbar";
import Footer from "../components/Footer";
import ProductDetail from "./ProductDeatils";

export default function Page({searchParams}) {
    let productId = searchParams.productId
    console.log(productId)
    

    return (
        <div>
            <Header />
            {productId && <ProductDetail productId={productId} />}
            <Footer />
        </div>
    );
}
