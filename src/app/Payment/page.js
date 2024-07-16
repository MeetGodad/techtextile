import PaymentForm from "./stripePayment";
import Header from "../components/Navbar";
import Footer from "../components/Footer";



export default function Page() {
    return (
    <div>
        <Header />
        <PaymentForm />
        <Footer />
    </div>
    );
}