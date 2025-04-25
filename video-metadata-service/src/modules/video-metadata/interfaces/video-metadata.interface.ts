interface Empty {}

interface VideoMetadata {
    id: string;
    title: string;
    desciption: string;
    filename: string;
    format_name: string;
    duration: number;
    size: number;
    artist: string;
}

interface AddVideoMetadataRequest {
    title: string;
    desciption: string;
    filename: string;
    format_name: string;
    duration: number;
    size: number;
    artist: string;
}

interface GetAllVideoMetadataResponse {
    videoMetadatas: VideoMetadata[];
}
