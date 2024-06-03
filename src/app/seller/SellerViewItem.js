"use client";
import { useEffect, useState } from 'react';
import { useUserAuth } from "../auth/auth-context";  // Make sure the path is correct

export default function SellerViewItem() {
    const { user } = useUserAuth();
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setMessage('Please log in first!');
                return;
            }
            try {
                const response = await fetch(`/api/products/${user.uid}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }
                const data = await response.json();
                if (data.message === "No items listed") {
                    setMessage('No items listed');
                } else {
                    setProducts(data);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setMessage(error.message);
            }
        };

        fetchData();
    }, [user]);

    if (message) {
        return <div style={{ color: 'red' }}>{message}</div>;
    }

    return (
        <div>
            <h2>Listed Items</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.product_id}>
                            <td>{product.product_name}</td>
                            <td>{product.product_description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
