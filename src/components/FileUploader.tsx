"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { convertFileToUrl } from "../../lib/utils";
import Image from "next/image";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

const FileUploader: React.FC<FileUploaderProps> = ({ files, onChange }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles);
    },
    [onChange] // Ajout de la dépendance correcte
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="file-upload">
      <input {...getInputProps()} />
      {files && files.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt="image téléchargée"
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
          <Image src="/assets/icons/upload.svg" width={40} height={40} alt="télécharger" />
          <div className="file-upload_label">
            <p className="text-14-regular">
              <span className="text-green-500">Cliquez pour télécharger</span> ou glisser-déposer
            </p>
            <p>SVG, PNG, JPG ou GIF (max 800x400)</p>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploader;
