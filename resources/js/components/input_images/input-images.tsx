import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { filesUploaderProps } from "./InputImagesTyles";
import { Label } from "../ui/label";
import InputError from "../input-error";


const ImageUploader:React.FC<filesUploaderProps> = (
  { onFilesUpload,
    id,
    value , 
    autoComplete,
    error,
    multiple = false, 
    accept="image/webp" ,
    label = "Subir archivo",
    previewUrls: externalPreviewUrls = []  // <-- NUEVO
  }) => {
  const [files, setFiles] = useState<File[]>([]); 
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    let files = Array.from(event.target.files);

    const allowedTypes = accept.split(",").map((type) => type.trim());
    files = files.filter((file) =>
      allowedTypes.some((type) => file.type === type)
    );

    if (files.length === 0) return;
    

    setFiles(files);

    // Crear URLs temporales para la vista previa
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Aquí deberíamos enviar las URLs al componente padre para almacenarlas
    onFilesUpload(files, urls);
  };

  const urlsToShow = externalPreviewUrls.length > 0 ? externalPreviewUrls : previewUrls;
  return (
    <div className="w-full max-w-md m-0">
      {/* Input de archivos */}
      <Label>
        {label}
      </Label>
      <Input
        id={id}
        type="file"
        className="mt-1 block w-full"
        value={value}
        onChange={handleFileChange}
        autoComplete={autoComplete}
        multiple={multiple}
        accept={accept}
      />
      {error && <InputError message={error} className="mt-2 text-red-500" />}

      <div className="mt-4 grid grid-cols-3 gap-2">
        {urlsToShow.map((url, index) => (
          <div key={index} className="relative">
            {files[index].type.startsWith("image/") ? (
              <img
                src={url}
                alt={`preview-${index}`}
                className="w-full h-20 object-cover rounded-lg shadow-md"
              />
            ) : (
              <video
                src={url}
                className="w-full h-20 object-cover rounded-lg shadow-md"
                controls
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
