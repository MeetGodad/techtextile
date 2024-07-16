


export default function Authentication() {
    const { user, signUp, signIn, signOut } = useUserAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
    
        try {
        await signIn(email, password);
        } catch (error) {
        setError(error.message);
        } finally {
        setIsLoading(false);
        }
    };
    
    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
    
        try {
        await signUp(email, password);
        } catch (error) {
        setError(error.message);
        } finally {
        setIsLoading(false);
        }
    };
    
    const handleSignOut = async () => {
        try {
        await signOut();
        } catch (error) {
        console.error('Error signing out:', error);
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-8">Welcome to our store</h1>
        {user ? (
            <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-semibold">Welcome, {user.email}</h2>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={handleSignOut}
            >
                Sign Out
            </button>
            </div>
        ) : (
            <form
            className="flex flex-col items-center gap-4"
            onSubmit={isSignUp ? handleSignUp : handleSignIn}
            >
            <input
                type="email"
                placeholder="Email"
                className="border border-gray-400 px-4 py-2 rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="border border-gray-400 px-4 py-2 rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
                {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <button
                type="button"
                className="text-blue-500"
                onClick={() => setIsSignUp((prev) => !prev)}
            >
                {isSignUp ? 'Already have an account? Sign In' : 'Don’t have an account? Sign Up'}
            </button>
            </form>
        )}
        </div>
    );
}
