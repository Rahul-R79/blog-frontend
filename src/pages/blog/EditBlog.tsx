import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Category } from "../../types/Post";
import { postService } from "../../services/postService";

const CATEGORIES = [
    {
        value: Category.TECHNOLOGY,
        label: "Technology",
        color: "from-blue-400 to-blue-600",
    },
    {
        value: Category.DEVELOPMENT,
        label: "Development",
        color: "from-emerald-400 to-emerald-600",
    },
    {
        value: Category.DESIGN,
        label: "Design",
        color: "from-purple-400 to-purple-600",
    },
    {
        value: Category.LIFESTYLE,
        label: "Lifestyle",
        color: "from-orange-400 to-orange-600",
    },
    {
        value: Category.CAREER,
        label: "Career",
        color: "from-pink-400 to-pink-600",
    },
];

const EditBlog = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<Category | 0>(0);
    const [readTime, setReadTime] = useState(5);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string>("");

    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) {
                navigate("/my-blogs");
                return;
            }

            try {
                setIsLoading(true);
                const post = await postService.getPostById(id);
                
                setTitle(post.title);
                setContent(post.content);
                
                let categoryValue: number;
                
                if (typeof post.category === 'string') {
                    categoryValue = Category[post.category as keyof typeof Category] || 0;
                } else {
                    categoryValue = post.category;
                }
                
                setSelectedCategory(categoryValue as Category);
                
                setReadTime(post.readTime);
                
                if (post.image) {
                    setExistingImageUrl(post.image);
                    setImagePreview(post.image);
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [id, navigate]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            setFile(droppedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(droppedFile);
        }
    };

    const handleSubmit = async () => {
        if (!id) return;

        setIsSubmitting(true);
        setErrors({});
        
        try {
            let imageUrl = existingImageUrl;

            if (file) {
                const { uploadUrl, publicUrl } = await postService.getUploadUrl(
                    file.name,
                    file.type
                );

                await postService.uploadImageToS3(uploadUrl, file);
                imageUrl = publicUrl;
            }

            const updateData = {
                title,
                content,
                category: selectedCategory as Category,
                readTime,
                image: imageUrl,
            };

            await postService.updatePost(id, updateData);

            navigate("/my-blogs", {replace: true});
        } catch (error: any) {
            const data = error?.response?.data;

            if (data?.fields) {
                setErrors(data.fields);
            } else {
                alert("Failed to update post. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='min-h-screen bg-slate-900 text-white font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden'>
            {/* Ambient Background Effects */}
            <div className='fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0'>
                <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse' />
                <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000' />
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className='relative z-10 flex items-center justify-center min-h-screen'>
                    <div className='text-center'>
                        <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4'></div>
                        <p className='text-slate-400'>Loading post data...</p>
                    </div>
                </div>
            ) : (
                <div className='relative z-10 max-w-5xl mx-auto px-6 py-12'>
                    {/* Header */}
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 mb-8 md:mb-12'>
                        <div>
                            <h1 className='text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400'>
                                Edit Your Story
                            </h1>
                            <p className='text-slate-400 mt-2 text-sm md:text-base'>
                                Update and refine your post
                            </p>
                        </div>
                        <div className='flex gap-4 w-full md:w-auto'>
                            <button
                                onClick={() => navigate("/my-blogs")}
                                className='flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all duration-300 font-medium text-center cursor-pointer disabled:opacity-50'
                                disabled={isSubmitting}>
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className='flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-0.5 text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className='animate-spin h-5 w-5 text-white'
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'>
                                            <circle
                                                className='opacity-25'
                                                cx='12'
                                                cy='12'
                                                r='10'
                                                stroke='currentColor'
                                                strokeWidth='4'></circle>
                                            <path
                                                className='opacity-75'
                                                fill='currentColor'
                                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    "Update Post"
                                )}
                            </button>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                        {/* Main Content Form */}
                        <div className='lg:col-span-8 space-y-8'>
                            {/* Title Input */}
                            <div className='group space-y-2'>
                                <input
                                    type='text'
                                    placeholder='Enter your title here...'
                                    className={`w-full bg-transparent text-3xl md:text-5xl font-bold placeholder-slate-500 border-b-2 ${
                                        errors.title
                                            ? "border-red-500"
                                            : "border-slate-700 focus:border-purple-500"
                                    } focus:outline-none py-4 md:py-6 text-white transition-all`}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                {errors.title && (
                                    <p className='text-red-500 text-sm'>
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Image Upload Area */}
                            <div
                                className={`relative h-64 md:h-96 rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden group ${
                                    errors.image
                                        ? "border-red-500"
                                        : isDragging
                                        ? "border-purple-500 bg-purple-500/10"
                                        : "border-slate-700 hover:border-slate-500 bg-slate-800/30"
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}>
                                {imagePreview ? (
                                    <div className='absolute inset-0'>
                                        <img
                                            src={imagePreview}
                                            alt='Preview'
                                            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                                        />
                                        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3'>
                                            <button
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setFile(null);
                                                    setExistingImageUrl(""); // Clear existing image URL
                                                }}
                                                className='px-4 py-2 bg-red-500/80 backdrop-blur-md rounded-lg text-white font-medium hover:bg-red-600 transition-colors cursor-pointer'>
                                                Remove Image
                                            </button>
                                            <label className='px-4 py-2 bg-blue-500/80 backdrop-blur-md rounded-lg text-white font-medium hover:bg-blue-600 transition-colors cursor-pointer'>
                                                Change Image
                                                <input
                                                    type='file'
                                                    className='hidden'
                                                    accept='image/*'
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='absolute inset-0 flex flex-col items-center justify-center text-slate-400'>
                                        <div className='w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300'>
                                            <svg
                                                className='w-8 h-8 text-purple-400'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                stroke='currentColor'>
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                                                />
                                            </svg>
                                        </div>
                                        <p className='text-lg font-medium text-slate-300'>
                                            Drop your cover image here
                                        </p>
                                        <p className='text-sm text-slate-500 mt-2'>
                                            or click to browse
                                        </p>
                                        <input
                                            type='file'
                                            className='absolute inset-0 opacity-0 cursor-pointer'
                                            accept='image/*'
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                )}
                            </div>
                            {errors.image && (
                                <p className='text-red-500 text-sm'>
                                    {errors.image}
                                </p>
                            )}

                            {/* Content Editor */}
                            <div className='relative space-y-2'>
                                <textarea
                                    placeholder='Tell your story...'
                                    className={`w-full min-h-[400px] md:min-h-[500px] bg-slate-800/30 text-base md:text-lg text-slate-300 placeholder-slate-500 border ${
                                        errors.content
                                            ? "border-red-500"
                                            : "border-slate-700 focus:border-purple-500"
                                    } rounded-3xl focus:ring-2 focus:ring-purple-500/20 p-6 md:p-8 resize-none font-serif leading-relaxed transition-all`}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                {errors.content && (
                                    <p className='text-red-500 text-sm'>
                                        {errors.content}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className='lg:col-span-4 space-y-8'>
                            {/* Settings Card */}
                            <div className='bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sticky top-8'>
                                <h3 className='text-xl font-bold text-white mb-6'>
                                    Publishing Details
                                </h3>

                                {/* Category Selection */}
                                <div className='mb-8'>
                                    <label className='block text-sm font-medium text-slate-400 mb-4'>
                                        Category
                                    </label>
                                    <div className='flex flex-wrap gap-2'>
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.value}
                                                onClick={() =>
                                                    setSelectedCategory(cat.value)
                                                }
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border cursor-pointer ${
                                                    selectedCategory === cat.value
                                                        ? `bg-linear-to-r ${cat.color} text-white border-transparent shadow-lg`
                                                        : "bg-slate-900/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white"
                                                }`}>
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.category && (
                                        <p className='text-red-500 text-sm mt-2'>
                                            {errors.category}
                                        </p>
                                    )}
                                </div>

                                {/* Read Time */}
                                <div className='mb-8'>
                                    <div className='flex justify-between items-center mb-4'>
                                        <label className='text-sm font-medium text-slate-400'>
                                            Read Time
                                        </label>
                                        <span className='text-white font-mono bg-slate-900 px-3 py-1 rounded-lg text-sm'>
                                            {readTime} min
                                        </span>
                                    </div>
                                    <input
                                        type='range'
                                        min='1'
                                        max='60'
                                        value={readTime}
                                        onChange={(e) =>
                                            setReadTime(parseInt(e.target.value))
                                        }
                                        className='w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all'
                                    />
                                    <div className='flex justify-between text-xs text-slate-500 mt-2'>
                                        <span>Fast read</span>
                                        <span>In-depth</span>
                                    </div>
                                </div>

                                {/* Tips */}
                                <div className='bg-linear-to-br from-blue-900/20 to-cyan-900/20 rounded-2xl p-5 border border-blue-500/10'>
                                    <div className='flex items-start gap-3'>
                                        <div className='p-2 bg-blue-500/20 rounded-lg'>
                                            <svg
                                                className='w-5 h-5 text-blue-400'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                stroke='currentColor'>
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className='text-blue-200 font-medium text-sm mb-1'>
                                                Editing Tip
                                            </h4>
                                            <p className='text-slate-400 text-xs leading-relaxed'>
                                                Review your changes carefully before
                                                updating. Make sure your updates
                                                enhance the reader's experience.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    background: #a855f7;
                    cursor: pointer;
                    margin-top: -6px;
                    box-shadow: 0 0 10px rgba(168, 85, 247, 0.5); 
                }
            `}</style>
        </div>
    );
};

export default EditBlog;
