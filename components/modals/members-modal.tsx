"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Check, Gavel, Loader, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { ServerWithMembersAndProfile } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import qs from "query-string";
import { useRouter } from "next/navigation";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className='h-4 w-4 text-indigo-500' />,
  ADMIN: <ShieldAlert className='h-4 w-4 text-rose-500' />,
};

export const MembersModal = () => {
  const [loadingId, setLoadingId] = useState("");
  const router = useRouter();

  const { isOpen, onClose, type, data, onOpen } = useModal((state) => state);

  const isModalOpen = isOpen && type === "members";

  const { server } = data as { server: ServerWithMembersAndProfile };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({ url: `/api/members/${memberId}`, query: { serverId: server.id } });
      const res = await axios.patch(url, { role });

      router.refresh();
      onOpen("members", { server: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const onKick = async (memberId: string) => {
    try {
      const url = qs.stringifyUrl({ url: `/api/members/${memberId}`, query: { serverId: server.id } });
      const res = await axios.delete(url);

      router.refresh();
      onOpen("members", { server: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Manage current members</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>{server?.members?.length} Members</DialogDescription>
        </DialogHeader>
        {/* <div className='p-6'>Hello Members</div> */}
        <ScrollArea className='mt-8 max-h-[420px] pr-6'>
          {server?.members?.map((member) => (
            <div key={member.id} className='flex items-center gap-x-2 mb-6'>
              <UserAvatar src={member.profile.imageUrl} />
              <div className='flex flex-col gap-y-1'>
                <div className='text-xs font-semibold flex items-center gap-x-1'>
                  {member.profile.name} {roleIconMap[member.role]}
                </div>
                <p className='text-xs text-zinc-500'>{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId && loadingId !== member.profileId && (
                <div className='ml-auto'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className='cursor-pointer'>
                      <MoreVertical className='h-4 w-4 text-zinc-500' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className='flex items-center'>
                          <ShieldQuestion className='h-4 w-4 mr-2' />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>
                              <Shield className='h-4 w-4 mr-2' />
                              GUEST
                              {member.role === "GUEST" && <Check className='h-4 w-4 ml-auto' />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onRoleChange(member.id, "MODERATOR")}>
                              <ShieldCheck className='h-4 w-4 mr-2' />
                              MODERATOR
                              {member.role === "MODERATOR" && <Check className='h-4 w-4 ml-auto' />}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onKick(member.id)}>
                        <Gavel className='h-4 w-4 mr-2' />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.id && <Loader className='animate-spin text-zinc-500 w-4 h-4 ml-auto' />}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
