interface Empty {}

interface VideoMetadata {
    id: string;
    title: string;
    desciption: string;
    filename: string;
    formatname: string;
    duration: number;
    size: number;
    artist: string;
    status: string;
    thumbnailUrl: string;
    isPublic: boolean;
}

interface AddVideoMetadataRequest {
    title: string;
    desciption: string;
    filename: string;
    formatname: string;
    duration: number;
    size: number;
    artist: string;
}

interface GetAllVideoMetadataResponse {
    videoMetadatas: VideoMetadata[];
}

interface UpdateVideoMetadataRequest {
    id: string;
    status: string;
    thumbnailUrl: string;
}
