import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postService } from "../../services/postService";
import type { Post } from "../../types/Post";

const SingleBlog = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) {
                setError("No post ID provided");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await postService.getPostById(id);
                setPost(response);
            } catch (err) {
                setError("Failed to load post");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const formatFullDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
                <div className='text-center space-y-4'>
                    <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto'></div>
                    <p className='text-slate-600 font-medium'>
                        Loading article...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4'>
                <div className='text-center space-y-6 max-w-md'>
                    <div className='inline-flex p-4 rounded-full bg-red-100 text-red-600'>
                        <svg
                            className='w-12 h-12'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                            />
                        </svg>
                    </div>
                    <h2 className='text-2xl font-bold text-slate-800'>
                        Post Not Found
                    </h2>
                    <p className='text-slate-600'>
                        {error ||
                            "This article doesn't exist or has been removed."}
                    </p>
                    <button
                        onClick={() => navigate("/view/blogs")}
                        className='px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25'>
                        Browse All Posts
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-slate-50 font-sans text-slate-900'>
            {/* Minimal Navbar */}
            <nav className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm'>
                <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
                    <button
                        onClick={() => navigate(-1)}
                        className='flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors group'>
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
                        <span className='font-medium'>Back</span>
                    </button>

                    <div
                        className='text-xl font-extrabold tracking-tight text-slate-900 cursor-pointer'
                        onClick={() => navigate("/")}>
                        Dev<span className='text-indigo-600'>Blog</span>.
                    </div>

                    <button
                        onClick={() => navigate("/view/blogs")}
                        className='px-4 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all'>
                        All Posts
                    </button>
                </div>
            </nav>

            {/* Hero Image Section */}
            <div className='relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden bg-slate-900'>
                <img
                    src={post.image || "/post-thumb.png"}
                    alt={post.title}
                    className='w-full h-full object-cover opacity-90'
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/post-thumb.png";
                    }}
                />
                <div className='absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent'></div>

                {/* Category Badge */}
                <div className='absolute top-8 left-1/2 -translate-x-1/2 max-w-5xl w-full px-4 sm:px-6 lg:px-8'>
                    <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/90 backdrop-blur-md border border-white/20 text-white text-sm font-bold shadow-lg'>
                        <span className='w-2 h-2 rounded-full bg-white animate-pulse'></span>
                        {post.category}
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <article className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-20'>
                {/* Article Card */}
                <div className='bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200 overflow-hidden'>
                    {/* Header */}
                    <div className='p-8 sm:p-12 border-b border-slate-100'>
                        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight'>
                            {post.title}
                        </h1>

                        {/* Meta Information */}
                        <div className='flex flex-wrap items-center gap-6 text-sm text-slate-500'>
                            <div className='flex items-center gap-2 text-slate-600'>
                                <svg
                                    className='w-5 h-5 text-indigo-500'
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
                                <span className='font-medium'>
                                    {post.readTime} min read
                                </span>
                            </div>

                            <div className='flex items-center gap-2 text-slate-600'>
                                <svg
                                    className='w-5 h-5 text-indigo-500'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'>
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                    />
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                    />
                                </svg>
                                <span className='font-medium'>256 views</span>
                            </div>
                        </div>
                    </div>

                    {/* Article Body */}
                    <div className='p-8 sm:p-12'>
                        <div className='prose prose-lg prose-slate max-w-none'>
                            <div className='text-slate-700 leading-relaxed whitespace-pre-wrap text-lg'>
                                {post.content}
                            </div>
                        </div>
                    </div>

                    {/* Footer Meta */}
                    <div className='p-8 sm:p-12 bg-slate-50 border-t border-slate-200'>
                        <div className='flex flex-wrap items-center justify-between gap-4'>
                            <div className='text-sm text-slate-500'>
                                <p>
                                    Published on{" "}
                                    <span className='font-semibold text-slate-700'>
                                        {formatFullDateTime(post.createdAt)}
                                    </span>
                                </p>
                                {post.updatedAt !== post.createdAt && (
                                    <p className='mt-1'>
                                        Last updated on{" "}
                                        <span className='font-semibold text-slate-700'>
                                            {formatFullDateTime(post.updatedAt)}
                                        </span>
                                    </p>
                                )}
                            </div>

                            {/* Share Buttons */}
                            <div className='flex items-center gap-3'>
                                <span className='text-sm font-semibold text-slate-700'>
                                    Share:
                                </span>
                                <button className='p-2.5 rounded-full bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm'>
                                    <svg
                                        className='w-4 h-4'
                                        fill='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
                                    </svg>
                                </button>
                                <button className='p-2.5 rounded-full bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm'>
                                    <svg
                                        className='w-4 h-4'
                                        fill='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                                    </svg>
                                </button>
                                <button className='p-2.5 rounded-full bg-white border border-slate-200 hover:bg-green-50 hover:border-green-300 hover:text-green-600 transition-all shadow-sm'>
                                    <svg
                                        className='w-4 h-4'
                                        fill='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Posts or CTA */}
                <div className='mt-16 text-center'>
                    <div className='inline-flex flex-col sm:flex-row items-center gap-4'>
                        <button
                            onClick={() => navigate("/view/blogs")}
                            className='px-8 py-3.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25'>
                            Read More Articles
                        </button>
                        <button
                            onClick={() => navigate("/create/blog")}
                            className='px-8 py-3.5 rounded-full bg-white text-slate-700 font-semibold border border-slate-300 hover:bg-slate-50 transition-all duration-300'>
                            Write Your Own
                        </button>
                    </div>
                </div>
            </article>

            {/* Footer */}
            <footer className='bg-white border-t border-slate-200 py-12 px-4 mt-20'>
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

export default SingleBlog;
