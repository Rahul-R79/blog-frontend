export const Category = {
    UNSPECIFIED: 0,
    TECHNOLOGY: 1,
    DEVELOPMENT: 2,
    DESIGN: 3,
    LIFESTYLE: 4,
    CAREER: 5,
} as const;

export type Category = typeof Category[keyof typeof Category];

export interface Post {
    id: string;
    authorId: string;
    title: string;
    content: string;
    image?: string;
    category: Category | string; // Accept both for gRPC compatibility
    readTime: number;
    createdAt: string; 
    updatedAt: string; 
}

export interface CreatePostData {
    title: string;
    content: string;
    image: string;
    category: Category;
    readTime: number;
}

export interface UpdatePostData {
    title?: string;
    content?: string;
    image?: string;
    category?: Category;
    readTime?: number;
}

export interface PostListResponse {
    posts: Post[];
    totalCount: number;
}

export interface UploadUrlResponse {
    uploadUrl: string;
    publicUrl: string;
}
