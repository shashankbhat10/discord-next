"use client";

import { ServerWithMembersAndProfile } from "@/types";
import { MemberRole, Server } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
  role?: MemberRole;
  server: ServerWithMembersAndProfile;
}

export const ServerHeader = ({ role, server }: ServerHeaderProps) => {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none' asChild>
        <button
          className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 
        border-b-2 hover:bg-zinc-700/10 dark:bg-zinc-700/50 transition'>
          {server.name}
          <ChevronDown className='h-5 w-5 ml-auto' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'>
        {isModerator && (
          <DropdownMenuItem
            className='text-indigo-600 dark:text-indigo-400 px-3 py-2 text-xs cursor-pointer'
            onClick={() => onOpen("invite", { server })}>
            Invite People
            <UserPlus className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className=' px-3 py-2 text-xs cursor-pointer'
            onClick={() => onOpen("editServer", { server })}>
            Server Settings
            <Settings className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className=' px-3 py-2 text-xs cursor-pointer' onClick={() => onOpen("members", { server })}>
            Manage Members
            <Users className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className=' px-3 py-2 text-xs cursor-pointer' onClick={() => onOpen("createChannel")}>
            Create Channel
            <PlusCircle className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            className='px-3 py-2 text-sm cursor-pointer text-rose-500'
            onClick={() => onOpen("deleteServer", { server })}>
            Delete Server
            <Trash className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            className='px-3 py-2 text-sm cursor-pointer text-rose-500'
            onClick={() => onOpen("leaveServer", { server })}>
            Leave Server
            <LogOut className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
