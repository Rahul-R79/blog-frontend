import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import authservice from "../services/authService";
import { postService } from "../services/postService";
import type { Post } from "../types/Post";

const Home = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await postService.getAllPosts(6, 0);
                setPosts(response.posts);
            } catch (err) {
                setError("Failed to load posts");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleLogout = async () => {
        try {
            await authservice.logout();
        } catch (error) {
            alert("Logout failed");
        } finally {
            setUser(null);
            navigate("/signin");
        }
    };

    const categories = [
        "Technology",
        "Development",
        "Design",
        "Lifestyle",
        "Career",
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className='min-h-screen bg-slate-50 font-sans text-slate-900'>
            {/* Hero Section */}
            <section className='relative w-full h-[500px] md:h-[600px] flex items-center justify-center text-center px-4 overflow-hidden'>
                {/* Navbar */}
                <nav className='absolute top-0 w-full z-50 px-8 py-6 flex justify-between items-center'>
                    {/* Logo */}
                    <div className='text-white text-2xl font-extrabold tracking-tight'>
                        Dev<span className='text-indigo-400'>Blog</span>.
                    </div>

                    {/* Actions */}
                    <div className='flex items-center gap-4'>
                        {/* My Blogs */}
                        <button
                            onClick={() => navigate("/my-blogs")}
                            className='
        relative px-6 py-2.5 rounded-full
        text-sm font-semibold text-white
        bg-linear-to-r from-indigo-500/20 to-purple-500/20
        backdrop-blur-lg border border-white/20
        hover:from-indigo-500/40 hover:to-purple-500/40
        hover:scale-105
        transition-all duration-300
        shadow-lg shadow-indigo-500/10
        cursor-pointer
      '>
                            My Blogs
                        </button>

                        {/* Sign Out */}
                        <button
                            onClick={handleLogout}
                            className='
        relative px-6 py-2.5 rounded-full
        text-sm font-semibold text-white
        bg-white/10 backdrop-blur-lg
        border border-white/20
        hover:bg-red-500/20 hover:border-red-400/30
        hover:text-red-300
        hover:scale-105
        transition-all duration-300
        shadow-lg shadow-red-500/10
        cursor-pointer
      '>
                            Sign Out
                        </button>
                    </div>
                </nav>

                {/* Background Overlay */}
                <div className='absolute inset-0 z-0'>
                    <img
                        src='/hero-image.png'
                        alt='Hero Background'
                        className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90'></div>
                </div>

                {/* Content */}
                <div className='relative z-10 max-w-4xl mx-auto space-y-6 animate-fade-in-up'>
                    <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight drop-shadow-lg'>
                        Insights for the{" "}
                        <span className='text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400'>
                            Modern Developer
                        </span>
                    </h1>
                    <p className='text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed'>
                        Discover the latest trends, in-depth tutorials, and
                        thought-provoking articles on software engineering and
                        design.
                    </p>
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-4'>
                        <Link
                            className='px-8 py-3.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 w-full sm:w-auto cursor-pointer'
                            to='/view/blogs'>
                            Start Reading
                        </Link>
                        <Link
                            className='px-8 py-3.5 rounded-full bg-white/10 text-white font-semibold backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 w-full sm:w-auto cursor-pointer'
                            to='/create/blog'>
                            Create Blog
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories Bar */}
            <div className='bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm/50'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center space-x-1 py-4 overflow-x-auto no-scrollbar mask-gradient-right'>
                        <button className='px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium whitespace-nowrap shadow-md cursor-pointer'>
                            All Posts
                        </button>
                        {categories.map((cat, idx) => (
                            <button
                                key={idx}
                                className='px-4 py-2 rounded-full text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer'>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                {/* Section Header */}
                <div className='flex items-end justify-between mb-10'>
                    <div>
                        <h2 className='text-3xl font-bold text-slate-800'>
                            Recent Articles
                        </h2>
                        <p className='text-slate-500 mt-2'>
                            Explore our latest thinking on tech and design.
                        </p>
                    </div>
                    <Link
                        to='/view/blogs'
                        className='hidden sm:inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors'>
                        View All
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5 ml-1'
                            viewBox='0 0 20 20'
                            fill='currentColor'>
                            <path
                                fillRule='evenodd'
                                d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L15.586 11H3a1 1 0 110-2h12.586l-3.293-3.293a1 1 0 010-1.414z'
                                clipRule='evenodd'
                            />
                        </svg>
                    </Link>
                </div>

                {/* Blog Grid */}
                {loading ? (
                    <div className='flex justify-center items-center h-64'>
                        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500'></div>
                    </div>
                ) : error ? (
                    <div className='text-center text-red-500 py-10'>
                        {error}
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {posts.map((post) => (
                            <article onClick={()=> navigate(`/blogs/${post.id}`)}
                                key={post.id}
                                className='group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full cursor-pointer hover:-translate-y-1'>
                                {/* Image Container */}
                                <div className='relative h-56 overflow-hidden'>
                                    <img
                                        src={post.image || "/post-thumb.png"}
                                        alt={post.title}
                                        className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500'
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                "/post-thumb.png";
                                        }}
                                    />
                                    <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm'>
                                        {post.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className='p-6 flex-1 flex flex-col'>
                                    <div className='flex items-center text-slate-400 text-xs mb-3 space-x-2'>
                                        <span className='flex items-center'>
                                            <svg
                                                className='w-3.5 h-3.5 mr-1'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                stroke='currentColor'>
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                                                />
                                            </svg>
                                            {formatDate(post.createdAt)}
                                        </span>
                                        <span>•</span>
                                        <span className='flex items-center'>
                                            <svg
                                                className='w-3.5 h-3.5 mr-1'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                stroke='currentColor'>
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                                                />
                                            </svg>
                                            {post.readTime} min read
                                        </span>
                                    </div>

                                    <h3 className='text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-indigo-600 transition-colors'>
                                        {post.title}
                                    </h3>

                                    <p className='text-slate-600 text-sm leading-relaxed mb-4 flex-1'>
                                        {post.content.length > 100
                                            ? `${post.content.substring(
                                                  0,
                                                  100
                                              )}...`
                                            : post.content}
                                    </p>

                                    <div className='flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300'>
                                        Read Article
                                        <svg
                                            className='w-4 h-4 ml-1'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M17 8l4 4m0 0l-4 4m4-4H3'
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <div className='mt-12 text-center sm:hidden'>
                    <a
                        href='#'
                        className='inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors'>
                        View All Posts
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5 ml-1'
                            viewBox='0 0 20 20'
                            fill='currentColor'>
                            <path
                                fillRule='evenodd'
                                d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L15.586 11H3a1 1 0 110-2h12.586l-3.293-3.293a1 1 0 010-1.414z'
                                clipRule='evenodd'
                            />
                        </svg>
                    </a>
                </div>
            </main>

            {/* Newsletter Section */}
            <section className='bg-slate-900 py-20 px-4'>
                <div className='max-w-4xl mx-auto text-center space-y-8'>
                    <div className='space-y-4'>
                        <h2 className='text-3xl md:text-4xl font-bold text-white tracking-tight'>
                            Stay ahead of the curve
                        </h2>
                        <p className='text-slate-400 max-w-xl mx-auto'>
                            Join 10,000+ developers getting our weekly
                            newsletter. No spam, just high-quality tech content
                            delivered to your inbox.
                        </p>
                    </div>

                    <form
                        className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'
                        onSubmit={(e) => e.preventDefault()}>
                        <input
                            type='email'
                            placeholder='Enter your email address'
                            className='flex-1 px-5 py-3.5 rounded-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
                        />
                        <button className='px-8 py-3.5 rounded-full bg-indigo-500 text-white font-bold hover:bg-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-500/25 cursor-pointer'>
                            Subscribe
                        </button>
                    </form>

                    <p className='text-xs text-slate-500'>
                        By subscribing, you agree to our{" "}
                        <a
                            href='#'
                            className='text-slate-400 hover:text-white underline'>
                            Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a
                            href='#'
                            className='text-slate-400 hover:text-white underline'>
                            Terms of Service
                        </a>
                        .
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className='bg-white border-t border-slate-100 py-12 px-4'>
                <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6'>
                    <div className='text-slate-400 text-sm'>
                        © 2025 DevBlog. All rights reserved.
                    </div>
                    <div className='flex space-x-6'>
                        {["Twitter", "GitHub", "LinkedIn", "RSS"].map(
                            (item) => (
                                <a
                                    key={item}
                                    href='#'
                                    className='text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors'>
                                    {item}
                                </a>
                            )
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
