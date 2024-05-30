
import Home from "./Home";
import Header from "../components/Navbar";
import Footer from "../components/Footer";


export default function Page() {
    return (
    <div>
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow">
                <Home />
            </div>
            <Footer />
        </div>
    </div>
    );
    }