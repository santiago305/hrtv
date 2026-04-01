export interface filesUploaderProps {
  onFilesUpload: (files: File[],previews: string[]) => void
    id?: string;
    value?: string;
    autoComplete?: string;
    error?: string | null;
    multiple?: boolean;
    accept?: string; 
    label?: string;
    previewUrls?: string[];

  }
