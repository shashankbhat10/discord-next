"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onChange: ({ name, url }: { name?: string; url?: string }) => void;
  value: { name: string; url: string };
  //   endpoint: "messageFile";
}

export const MessageFileUpload = ({ onChange, value }: FileUploadProps) => {
  const fileType = value.name.split(".").pop();

  if (value && value.url.length !== 0 && fileType !== "pdf") {
    return (
      <div className='relative h-20 w-20'>
        <Image fill src={value.url} alt='Server Image Upload' className='rounded-full' />
        <button
          className='bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm'
          type='button'
          onClick={() => onChange({ name: "", url: "" })}>
          <X className='h-4 w-4' />
        </button>
      </div>
    );
  }

  if (value && value.url.length !== 0 && fileType === "pdf") {
    return (
      <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
        <FileIcon className='h-10 w019 fill-indigo-200 stroke-indigo-400' />
        <a
          href={value.url}
          target='_blank'
          rel='noopener noreferrer'
          className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 
        hover:underline'>
          {value.name}
        </a>
        <button
          className='bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm'
          type='button'
          onClick={() => onChange({ name: "", url: "" })}>
          <X className='h-4 w-4' />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint='messageFile'
      onClientUploadComplete={(res) => onChange({ url: res?.[0].url, name: res?.[0].name })}
    />
  );
};
