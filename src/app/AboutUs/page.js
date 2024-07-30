import Header from '../components/Navbar';

export default function AboutUs() {
    return (
        <>
            <Header />
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
                
                <div className="mb-12 p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Welcome to TechTextile</h2>
                    <p className="text-lg text-gray-700 mb-4">At TechTextile, we are passionate about textiles and committed to connecting buyers and sellers in the yarn and fabric industry. Our platform is designed to provide a seamless and efficient marketplace for textile professionals and enthusiasts alike. Whether youre sourcing the finest yarns for your next project or looking to expand your business by reaching new customers, TechTextile is here to support you every step of the way.</p>
                
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                    <p className="text-lg text-gray-700 mb-4">Our mission is to empower the textile community by providing a robust platform that facilitates trade, fosters innovation, and promotes sustainable practices. We strive to bring transparency, convenience, and trust to the yarn and fabric industry, ensuring that both buyers and sellers have a positive and rewarding experience.</p>
               
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Why Choose TechTextile?</h2>
                    <ul className="list-disc list-inside text-lg text-gray-700 mb-4">
                        <li className="mb-2"><span className="font-bold">Wide Selection:</span> Access a diverse range of yarn and fabric products from verified sellers worldwide.</li>
                        <li className="mb-2"><span className="font-bold">User-Friendly Interface:</span> Our platform is designed with ease of use in mind, ensuring a smooth browsing and purchasing experience.</li>
                        <li className="mb-2"><span className="font-bold">Secure Transactions:</span> We prioritize the security of your transactions with advanced encryption and secure payment gateways.</li>
                        <li className="mb-2"><span className="font-bold">Trusted Community:</span> Join a community of trusted buyers and sellers, with reviews and ratings to help you make informed decisions.</li>
                    </ul>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Use</h1>
                
                <div className="mb-12 p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Introduction</h2>
                    <p className="text-lg text-gray-700 mb-4">Welcome to TechTextile. By accessing our platform, you agree to comply with our terms of use. These terms outline the rules and regulations for the use of TechTextile website.</p>
             
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">User Accounts</h2>
                    <p className="text-lg text-gray-700 mb-4">When you create an account on TechTextile, you are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password.</p>
                
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Content</h2>
                    <p className="text-lg text-gray-700 mb-4">By posting content on TechTextile, you grant us the right to display and distribute your content on our platform. You are responsible for the accuracy and legality of the content you post.</p>
                
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Prohibited Activities</h2>
                    <p className="text-lg text-gray-700 mb-4">When using TechTextile, you agree not to engage in any of the following activities:</p>
                    <ul className="list-disc list-inside text-lg text-gray-700 mb-4">
                        <li className="mb-2">Violating any laws or regulations</li>
                        <li className="mb-2">Posting false, misleading, or defamatory content</li>
                        <li className="mb-2">Impersonating another person or entity</li>
                        <li className="mb-2">Engaging in spamming or other malicious activities</li>
                    </ul>
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Termination</h2>
                    <p className="text-lg text-gray-700 mb-4">We reserve the right to terminate or suspend your account at any time for violating our terms of use. We may also remove any content that violates our policies.</p>
                </div>
                
                <div className="mb-12 p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Changes to Terms</h2>
                    <p className="text-lg text-gray-700 mb-4">We reserve the right to modify or replace these terms of use at any time. Your continued use of TechTextile after any changes indicates your acceptance of the modified terms.</p>
                </div>
                
                <div className="mb-12 p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Contact Us</h2>
                    <p className="text-lg text-gray-700 mb-4">If you have any questions or concerns about our About Us page, security policy, or terms of use, please feel free to contact us at <a href="mailto:techtextile@gmail.com" className="text-blue-600 hover:underline">techtextile@gmail.com</a>. We are here to help and ensure that your experience with TechTextile is a positive one.</p>
                </div>
            </div>
        </>
    )
}
