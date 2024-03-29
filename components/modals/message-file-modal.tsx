"use client";

import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Button } from "../ui/button";
import { FileUpload } from "../file-upload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import qs from "query-string";
import { MessageFileUpload } from "../message-file-upload";

const formSchema = z.object({
  file: z.object({
    name: z.string().min(1),
    url: z.string().min(1),
  }),
  // file: {
  //   fileUrl: z.string().min(1, { message: "Attachment is required" }),
  //   fileName: z.string().min(1, { message: "Attachment is required" }),
  // },
});

export const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { apiUrl, query } = data;
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: { name: "", url: "" },
    },
  });

  const isLoading = form.formState.isSubmitting;
  const isModalOpen = isOpen && type === "messageFile";

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({ url: apiUrl || "", query: query });
      await axios.post(url, { ...values, content: values.file.name });

      form.reset();

      router.refresh();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Add an Attachment</DialogTitle>
          <DialogDescription className='text-center'>Send a pdf file or an image</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={form.control}
                  name='file'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {/* <FileUpload endpoint='messageFile' value={field.value} onChange={field.onChange} /> */}
                        <MessageFileUpload value={field.value} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button disabled={isLoading} variant='primary'>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
