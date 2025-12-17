import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { postService } from "../../services/postService";
import type { Post } from "../../types/Post";

function MyBlog() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                setLoading(true);
                const response = await postService.getAllPosts(100, 0);

                const userPosts = response.posts.filter(
                    (post) => post.authorId === user?.id
                );

                setPosts(userPosts);
                setError(null);
            } catch (err) {
                setError("Failed to load your posts");
                console.error("Error fetching posts:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchUserPosts();
        }
    }, [user?.id]);

    // Pagination calculations
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const stats = [
        {
            label: "Total Posts",
            value: posts.length,
            icon: (
                <svg
                    className='w-6 h-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'>
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                </svg>
            ),
            gradient: "from-indigo-500 to-purple-500",
        },
        {
            label: "Avg. Read Time",
            value:
                posts.length > 0
                    ? Math.round(
                          posts.reduce((sum, post) => sum + post.readTime, 0) /
                              posts.length
                      )
                    : 0,
            icon: (
                <svg
                    className='w-6 h-6'
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
            ),
            gradient: "from-amber-500 to-orange-500",
        },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const deletePost = async (id: string) => {
        try {
            await postService.deletePost(id);
            setPosts(posts.filter(post => post.id !== id));
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || 'Failed to delete the post';
            setError(errorMessage);
        }
    };

    return (
        <div className='min-h-screen bg-slate-50 font-sans text-slate-900'>
            {/* Hero Section */}
            <section className='relative w-full h-[400px] md:h-[450px] flex items-center justify-center text-center px-4 overflow-hidden'>
                {/* Navbar */}
                <nav className='absolute top-0 w-full z-50 px-8 py-6 flex justify-between items-center'>
                    {/* Logo */}
                    <div className='text-white text-2xl font-extrabold tracking-tight'>
                        Dev<span className='text-indigo-400'>Blog</span>.
                    </div>

                    <button
                        onClick={() => navigate("/create/blog")}
                        className='relative px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-linear-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-lg border border-white/20 hover:from-indigo-500/40 hover:to-purple-500/40 hover:scale-105 transition-all duration-300 shadow-lg shadow-indigo-500/10'>
                        Create New
                    </button>
                </nav>

                {/* Background Overlay */}
                <div className='absolute inset-0 z-0'>
                    <div className='absolute inset-0 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500'></div>
                    <div className='absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80'></div>
                </div>

                {/* Content */}
                <div className='relative z-10 max-w-4xl mx-auto space-y-6'>
                    <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium'>
                        <span className='relative flex h-2 w-2'>
                            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                            <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
                        </span>
                        Your Blog Dashboard
                    </div>

                    <h1 className='text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight drop-shadow-lg'>
                        My{" "}
                        <span className='text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400'>
                            Blog Posts
                        </span>
                    </h1>

                    <p className='text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed'>
                        Manage and track your published articles, insights, and
                        stories.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20'>
                <div className='grid grid-cols-2 gap-4 md:gap-6'>
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className='bg-white rounded-xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                            <div
                                className={`inline-flex p-3 rounded-lg bg-linear-to-br ${stat.gradient} text-white mb-4`}>
                                {stat.icon}
                            </div>
                            <p className='text-2xl md:text-3xl font-bold text-slate-800'>
                                {stat.value}
                                {stat.label === "Avg. Read Time" && (
                                    <span className='text-sm font-normal ml-1'>
                                        min
                                    </span>
                                )}
                            </p>
                            <p className='text-sm text-slate-500 mt-1'>
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                {/* Section Header */}
                <div className='flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4'>
                    <div>
                        <h2 className='text-3xl font-bold text-slate-800'>
                            Your Published Articles
                        </h2>
                        <p className='text-slate-500 mt-2'>
                            {posts.length} posts published
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className='flex justify-center items-center h-64'>
                        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500'></div>
                    </div>
                ) : error ? (
                    /* Error State */
                    <div className='text-center text-red-500 py-10'>
                        {error}
                    </div>
                ) : posts.length === 0 ? (
                    /* Empty State */
                    <div className='mt-16 text-center'>
                        <div className='inline-flex p-6 rounded-full bg-slate-100 text-slate-400 mb-6'>
                            <svg
                                className='w-12 h-12'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                />
                            </svg>
                        </div>
                        <h3 className='text-2xl font-bold text-slate-800 mb-2'>
                            No posts yet
                        </h3>
                        <p className='text-slate-500 mb-8'>
                            Start creating amazing content for your audience
                        </p>
                        <button
                            onClick={() => navigate("/create/blog")}
                            className='px-8 py-3.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 cursor-pointer'>
                            Create Your First Post
                        </button>
                    </div>
                ) : (
                    /* Blog Posts Grid */
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8'>
                            {currentPosts.map((post) => (
                                <article onClick={()=> navigate(`/blogs/${post.id}`)}
                                    key={post.id}
                                    className='group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full cursor-pointer hover:-translate-y-1'>
                                    {/* Image Container */}
                                    <div className='relative h-56 overflow-hidden'>
                                        <img
                                            src={
                                                post.image || "/post-thumb.png"
                                            }
                                            alt={post.title}
                                            className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500'
                                            onError={(e) => {
                                                (
                                                    e.target as HTMLImageElement
                                                ).src = "/post-thumb.png";
                                            }}
                                        />
                                        <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm'>
                                            {post.category}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className='absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/edit/blog/${post.id}`);
                                                }}
                                                className='p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-blue-500 hover:text-white transition-all shadow-lg'>
                                                <svg
                                                    className='w-4 h-4'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    stroke='currentColor'>
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth={2}
                                                        d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                                                    />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deletePost(post.id);
                                                }}
                                                className='p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-red-500 hover:text-white transition-all shadow-lg'>
                                                <svg
                                                    className='w-4 h-4'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    stroke='currentColor'>
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth={2}
                                                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                                    />
                                                </svg>
                                            </button>
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
                                            {post.content.length > 120
                                                ? `${post.content.substring(
                                                      0,
                                                      120
                                                  )}...`
                                                : post.content}
                                        </p>

                                        {/* Action Footer */}
                                        <div className='flex items-center justify-end pt-4 border-t border-slate-100'>
                                            <div className='flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300'>
                                                View Post
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
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className='mt-12 flex justify-center items-center gap-2'>
                                {/* Previous Button */}
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className='px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer'>
                                    <svg
                                        className='w-5 h-5'
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

                                {/* Page Numbers */}
                                <div className='flex gap-2'>
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    ).map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            onClick={() =>
                                                handlePageChange(pageNum)
                                            }
                                            className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-all ${
                                                currentPage === pageNum
                                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                                                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                                            }`}>
                                            {pageNum}
                                        </button>
                                    ))}
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className='px-4 py-2 rounded-lg border cursor-pointer border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all'>
                                    <svg
                                        className='w-5 h-5'
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
}

export default MyBlog;
