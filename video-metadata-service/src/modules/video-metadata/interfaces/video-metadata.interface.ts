interface Empty {}

interface VideoMetadata {
    id: string;
    title: string;
    description: string;
    formatName: string;
    duration: number;
    size: number;
    status: string;
    thumbnailUrl: string;
    isPublic: boolean;
    userId: string;
}

interface AddVideoMetadataRequest {
    title: string;
    description: string;
    formatName: string;
    duration: number;
    size: number;
    userId: string;
}

interface GetAllVideoMetadataResponse {
    videoMetadatas: VideoMetadata[];
}

interface UpdateVideoMetadataRequest {
    id: string;
    status: string;
    thumbnailUrl: string;
}
