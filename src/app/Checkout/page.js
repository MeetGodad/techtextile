import Checkout from "./checkoutProcess";
import Header from "../components/Navbar";
import Footer from "../components/Footer";



export default function Page() {
    return (
    <div>
        <Header />
        <Checkout />
        <Footer />
    </div>
    );
}