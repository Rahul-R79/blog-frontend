import axios from "axios";
import api from "../config/api";
import type {
    Post,
    CreatePostData,
    UpdatePostData,
    PostListResponse,
    UploadUrlResponse,
} from "../types/Post";

export const postService = {
    createPost: async (data: CreatePostData): Promise<Post> => {
        const response = await api.post<Post>("/posts/create/blog", data);
        return response.data;
    },

    getAllPosts: async (
        limit: number = 10,
        offset: number = 0
    ): Promise<PostListResponse> => {
        const response = await api.get<PostListResponse>("/posts/blog/all", {
            params: { limit, offset },
        });
        return response.data;
    },

    getPostById: async (id: string): Promise<Post> => {
        const response = await api.get<Post>(`/posts/blog/${id}`);
        return response.data;
    },

    updatePost: async (id: string, data: UpdatePostData): Promise<Post> => {
        const response = await api.put<Post>(`/posts/blog/edit/${id}`, data);
        return response.data;
    },

    deletePost: async (id: string): Promise<void> => {
        await api.delete(`/posts/blog/delete/${id}`);
    },

    getUploadUrl: async (
        filename: string,
        contentType: string
    ): Promise<UploadUrlResponse> => {
        const response = await api.post<UploadUrlResponse>(
            "/posts/blog/upload-url",
            {
                filename,
                contentType,
            }
        );
        return response.data;
    },

    uploadImageToS3: async (uploadUrl: string, file: File): Promise<void> => {
        await axios.put(uploadUrl, file, {
            headers: {
                "Content-Type": file.type,
            },
        });
    },
};
