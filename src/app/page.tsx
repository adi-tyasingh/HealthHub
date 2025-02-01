import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import Fuse from "fuse.js";
import { shuffle } from "lodash";
import { SearchIcon, UserIcon, PlusIcon, ApertureIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/search-Bar";
import Footer from "@/components/footer";
// import Logout from "@/components/authentication/Logout";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import Logout from "@/components/authentication/Logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";





export default async function CharacterPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; tag?: string };
}) {
  const searchQuery = searchParams.search || "";
 

  return (
    <main className="flex flex-col items-center  bg-gradient-to-r from-black to-gray-800 min-h-screen">
      {/* Floating Search Bar */}
      <div className="sticky top-0 md:p-4 z-10  w-full backdrop-blur-md">
        
      <SearchBar searchQuery={searchQuery} />
      
      </div>

    </main>
  );
}
