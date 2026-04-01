export type PreviewItem = {
    url: string;
    file?: File;
    kind: 'image' | 'video';
};

export type InputImagesProps = {
    onFilesUpload: (files: File[], previews: string[]) => void;
    id?: string;
    error?: string | null;
    multiple?: boolean;
    accept?: string;
    label?: string;
    previewUrls?: string[];
    helperText?: string;
    disabled?: boolean;
    maxPreviewHeight?: string;
};