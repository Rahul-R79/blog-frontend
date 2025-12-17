import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../../services/postService";
import type { Post } from "../../types/Post";

const ViewAllBlogs = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 9;

    const categories = [
        "All Posts",
        "Technology",
        "Development",
        "Design",
        "Lifestyle",
        "Career",
    ];

    const [activeCategory, setActiveCategory] = useState("All Posts");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const offset = (currentPage - 1) * PAGE_SIZE;
                const response = await postService.getAllPosts(
                    PAGE_SIZE,
                    offset
                );
                setPosts(response.posts);
                setTotalCount(response.totalCount);
            } catch (err) {
                setError("Failed to load posts");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='min-h-screen bg-slate-50 font-sans text-slate-900'>
            {/* Hero Section */}
            <section className='relative w-full h-[400px] flex items-center justify-center text-center px-4 overflow-hidden'>
                {/* Navbar */}
                <nav className='absolute top-0 w-full z-50 px-8 py-6 flex justify-between items-center'>
                    {/* Logo */}
                    <div
                        className='text-white text-2xl font-extrabold tracking-tight cursor-pointer'
                        onClick={() => navigate("/")}>
                        Dev<span className='text-indigo-400'>Blog</span>.
                    </div>

                    {/* Actions */}
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={() => navigate("/my-blogs")}
                            className='hidden sm:block cursor-pointer px-5 py-2 rounded-full text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-all'>
                            My Blogs
                        </button>
                        <button
                            onClick={() => navigate("/create/blog")}
                            className='
                                relative px-6 py-2.5 rounded-full
                                text-sm font-semibold text-white
                                bg-indigo-600 hover:bg-indigo-500
                                shadow-lg shadow-indigo-500/30
                                hover:scale-105 transition-all duration-300 cursor-pointer
                            '>
                            Create Post
                        </button>
                    </div>
                </nav>

                {/* Background Overlay */}
                <div className='absolute inset-0 z-0'>
                    <div className='absolute inset-0 bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900'></div>
                    <div className='absolute inset-0 bg-linear-to-t from-slate-50 via-transparent to-transparent'></div>
                </div>

                {/* Content */}
                <div className='relative z-10 max-w-4xl mx-auto space-y-6 animate-fade-in-up pt-12'>
                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider'>
                        Blog Archive
                    </div>
                    <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight'>
                        Explore All{" "}
                        <span className='text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400'>
                            Articles
                        </span>
                    </h1>
                    <p className='text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed'>
                        Dive into a vast collection of stories, tutorials, and
                        insights from our community of developers and designers.
                    </p>
                </div>
            </section>

            {/* Categories Bar */}
            <div className='sticky top-0 z-40 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 shadow-sm'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center space-x-2 py-4 overflow-x-auto no-scrollbar mask-gradient-right'>
                        {categories.map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveCategory(cat)}
                                className={`
                                    px-4 py-2 m-1 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                                    ${
                                        activeCategory === cat
                                            ? "bg-slate-900 text-white shadow-md transform scale-105"
                                            : "bg-white text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200"
                                    }
                                `}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                {/* Header info */}
                <div className='flex items-end justify-between mb-8'>
                    <div>
                        <h2 className='text-2xl font-bold text-slate-800'>
                            Latest Publications
                        </h2>
                        <p className='text-slate-500 text-sm mt-1'>
                            Showing {posts.length} articles
                        </p>
                    </div>
                </div>

                {/* Blog Grid */}
                {loading ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div
                                key={n}
                                className='bg-white rounded-2xl h-[400px] animate-pulse border border-slate-100'>
                                <div className='h-48 bg-slate-200 w-full rounded-t-2xl'></div>
                                <div className='p-6 space-y-4'>
                                    <div className='h-4 bg-slate-200 rounded w-3/4'></div>
                                    <div className='h-4 bg-slate-200 rounded w-1/2'></div>
                                    <div className='h-20 bg-slate-200 rounded w-full'></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className='text-center py-20 bg-white rounded-3xl border border-red-100 shadow-sm'>
                        <div className='text-red-500 text-lg font-semibold mb-2'>
                            Oops! Something went wrong
                        </div>
                        <p className='text-slate-500 mb-6'>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className='px-6 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition'>
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {posts.map((post) => (
                                <article onClick={()=> navigate(`/blogs/${post.id}`)}
                                    key={post.id}
                                    className='group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 border border-slate-100 flex flex-col h-full cursor-pointer hover:-translate-y-1'>
                                    {/* Image Container */}
                                    <div className='relative h-52 overflow-hidden'>
                                        <img
                                            src={
                                                post.image || "/post-thumb.png"
                                            }
                                            alt={post.title}
                                            className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700'
                                            onError={(e) => {
                                                (
                                                    e.target as HTMLImageElement
                                                ).src = "/post-thumb.png";
                                            }}
                                        />
                                        <div className='absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                        <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-lg shadow-black/5 border border-white/50'>
                                            {post.category}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className='p-6 flex-1 flex flex-col'>
                                        <div className='flex items-center text-slate-400 text-xs mb-4 space-x-3 font-medium uppercase tracking-wide'>
                                            <span className='flex items-center'>
                                                <svg
                                                    className='w-4 h-4 mr-1.5 text-indigo-400'
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
                                            <span className='text-slate-300'>
                                                |
                                            </span>
                                            <span className='flex items-center'>
                                                <svg
                                                    className='w-4 h-4 mr-1.5 text-indigo-400'
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

                                        <h3 className='text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2'>
                                            {post.title}
                                        </h3>

                                        <p className='text-slate-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3'>
                                            {post.content}
                                        </p>

                                        <div className='flex items-center text-indigo-600 font-bold text-sm group-hover:translate-x-1 transition-transform duration-300'>
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className='mt-16 flex justify-center items-center gap-2'>
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className='group px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white shadow-sm'>
                                    <svg
                                        className='w-5 h-5 group-hover:-translate-x-1 transition-transform'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'>
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M15 19l-7-7 7-7'
                                        />
                                    </svg>
                                </button>

                                <div className='gap-2 mx-2 hidden sm:flex'>
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    ).map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            onClick={() =>
                                                handlePageChange(pageNum)
                                            }
                                            className={`
                                                w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all duration-200
                                                ${
                                                    currentPage === pageNum
                                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
                                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                                                }
                                            `}>
                                            {pageNum}
                                        </button>
                                    ))}
                                </div>
                                <div className='sm:hidden font-semibold text-slate-600 px-2'>
                                    Page {currentPage} of {totalPages}
                                </div>

                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className='group px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white shadow-sm'>
                                    <svg
                                        className='w-5 h-5 group-hover:translate-x-1 transition-transform'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'>
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M9 5l7 7-7 7'
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className='bg-white border-t border-slate-200 py-16 px-4'>
                <div className='max-w-7xl mx-auto'>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-12 mb-12'>
                        <div className='md:col-span-2'>
                            <div className='text-3xl font-extrabold tracking-tight text-slate-900 mb-6'>
                                Dev<span className='text-indigo-600'>Blog</span>
                                .
                            </div>
                            <p className='text-slate-500 max-w-sm leading-relaxed'>
                                A place where developers share their knowledge,
                                insights, and personal experiences in the world
                                of software engineering.
                            </p>
                        </div>
                        <div>
                            <h4 className='font-bold text-slate-900 mb-4'>
                                Quick Links
                            </h4>
                            <ul className='space-y-3 text-sm text-slate-500'>
                                <li>
                                    <a
                                        href='/'
                                        className='hover:text-indigo-600 transition-colors'>
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href='/my-blogs'
                                        className='hover:text-indigo-600 transition-colors'>
                                        My Blogs
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href='/create/blog'
                                        className='hover:text-indigo-600 transition-colors'>
                                        Write a Post
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className='font-bold text-slate-900 mb-4'>
                                Connect
                            </h4>
                            <ul className='space-y-3 text-sm text-slate-500'>
                                <li>
                                    <a
                                        href='#'
                                        className='hover:text-indigo-600 transition-colors'>
                                        Twitter / X
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href='#'
                                        className='hover:text-indigo-600 transition-colors'>
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href='#'
                                        className='hover:text-indigo-600 transition-colors'>
                                        LinkedIn
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className='pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4'>
                        <div className='text-slate-400 text-sm'>
                            © 2025 DevBlog. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ViewAllBlogs;
