"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCcw, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

export const InviteModal = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onClose, type, data, onOpen } = useModal((state) => state);
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";

  const { server } = data;
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 1000);
  };

  const onNewCode = async () => {
    try {
      setIsLoading(true);

      const res = await axios.patch(`/api/servers/${server?.id}/invite-code`);

      onOpen("invite", { server: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Invite more people!</DialogTitle>
        </DialogHeader>
        <div className='p-6'>
          <Label className='text-xs uppercase font-bold text-zinc-500 dark:text-secondary/70'>Server Invite Link</Label>
          <div className='flex items-center mt-2 gap-x-2'>
            <Input
              disabled={isLoading}
              className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
              value={inviteUrl}
            />
            <Button size='icon' onClick={onCopy} disabled={isLoading}>
              {isCopied ? <Check className='w-4 h-4' /> : <Copy className='h-4 w-4' />}
            </Button>
          </div>
          <Button
            variant='link'
            size='sm'
            className='text-xs text-zinc-500 mt-4'
            disabled={isLoading}
            onClick={onNewCode}>
            Generate new link
            <RefreshCw className='h-4 w-4 ml-2' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
