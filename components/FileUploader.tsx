"use client";

import useUpload, { StatusText } from "@/hooks/useUpload";
import byteSize from "byte-size";
import {
  CheckCircleIcon,
  CircleArrowDown,
  HammerIcon,
  RocketIcon,
  SaveIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

const MAXIMUM_FILE_SIZE = 5000000;

const statusIcons: {
  [key in StatusText]: JSX.Element;
} = {
  [StatusText.UPLOADING]: <RocketIcon className="h-20 w-20 text-indigo-600" />,
  [StatusText.UPLOADED]: (
    <CheckCircleIcon className="h-20 w-20 text-indigo-600" />
  ),
  [StatusText.SAVING]: <SaveIcon className="h-20 w-20 text-indigo-600" />,
  [StatusText.GENERATING]: (
    <HammerIcon className="h-20 w-20 text-indigo-600 animate-bounce" />
  ),
};

function FileUploader() {
  const { progress, status, fileId, handleUpload } = useUpload();
  const [errors, setErrors] = useState<string | null>();

  const router = useRouter();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setErrors(null);
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === "file-too-large") {
          setErrors(
            `Error: File is larger than ${byteSize(MAXIMUM_FILE_SIZE).value} MB`
          );
          return;
        }
        setErrors(error.message);
        return;
      }
      const file = acceptedFiles[0];
      if (file) {
        await handleUpload(file);
      } else {
        console.log("No file");
      }
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: MAXIMUM_FILE_SIZE,
      accept: {
        "application/pdf": [".pdf"],
      },
    });

  const uploadInProgress =
    progress !== null && progress > +0 && progress <= 100;

  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      {uploadInProgress && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <progress
            className={`radial-progress bg-indigo-300 text-white border-indigo-600 border-4 ${
              progress === 100 && "hidden"
            }`}
            style={{
              // @ts-ignore
              "--value": progress,
              "--size": "12rem",
              "--thickness": "1.3rem",
            }}
          >
            {progress} %
          </progress>

          {/* Render Status Icon */}
          {
            // @ts-ignore
            statusIcons[status]
          }

          <p className="text-indigo-600 animate-pulse">{String(status)}</p>
        </div>
      )}

      {!uploadInProgress && (
        <div
          {...getRootProps()}
          className={`p-10 border-2 border-dashed mt-10 w-[90%] border-indigo-600 text-indigo-600 rounded-lg h-96 flex items-center justify-center ${
            isFocused || isDragAccept ? "bg-indigo-300" : "bg-indigo-100"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col justify-center items-center">
            {isDragActive ? (
              <>
                <RocketIcon className="h-20 w-20 animate-ping" />
                <p>Drop the file here ...</p>
              </>
            ) : (
              <>
                <CircleArrowDown className="h-20 w-20 animate-bounce" />
                <p>
                  Drag &apos;n&apos; drop a PDF file here, or click to select
                  file (maximum size: {byteSize(MAXIMUM_FILE_SIZE).value} MB)
                </p>
              </>
            )}
            {errors && <p className="text-red-600">{errors}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
