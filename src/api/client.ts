// ============================================
// API CLIENT - Base fetch wrapper
// ============================================

const API_BASE = '/api';

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

/**
 * Base API client with error handling
 */
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const url = `${API_BASE}${endpoint}`;

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.error || 'Request failed' };
        }

        return { data };
    } catch (error) {
        console.error('API Error:', error);
        return { error: error instanceof Error ? error.message : 'Network error' };
    }
}

// GET request
export async function get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { method: 'GET' });
}

// POST request
export async function post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

// PUT request
export async function put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
}

// DELETE request
export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { method: 'DELETE' });
}

// Upload file
export async function uploadFile(
    file: File,
    type: 'food' | 'recipe' = 'food'
): Promise<ApiResponse<{ url: string; public_id?: string }>> {
    try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', type);

        const response = await fetch(`${API_BASE}/upload/image`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.error || 'Upload failed' };
        }

        return { data };
    } catch (error) {
        console.error('Upload Error:', error);
        return { error: error instanceof Error ? error.message : 'Upload failed' };
    }
}
