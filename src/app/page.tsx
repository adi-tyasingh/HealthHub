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

// Define the shape of a character object
interface CharacterData {
  id: string;
  data: {
    avatar: string;
    description: string;
    name: string;
    tags: string[];
    extensions: {
      chub: {
        full_path: string;
      };
    };
  };
  introText: string;
}

async function getTags() {
  const filePath = path.join(process.cwd(), "public/searchTags.json");
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

async function getCharecters(
  searchQuery: string,
  page: number,
  selectedTags: string[]
): Promise<{ charecters: CharacterData[]; totalPages: number }> {
  const directory = path.join(process.cwd(), "src/chubJSONs");
  const files = fs.readdirSync(directory);

  const allCharacters = files.map((file) => {
    const filePath = path.join(directory, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const characterData = JSON.parse(fileContent) as CharacterData;
    characterData.id =
      characterData.data.extensions.chub.full_path.split("/")[1];
    return characterData;
  });

  // Filtering characters based on search query and tags
  let filteredCharacters = allCharacters;

  if (searchQuery) {
    const fuse = new Fuse(allCharacters, {
      keys: ["data.name", "introText", "data.tags"],
      includeScore: true,
      threshold: 0.6,
    });
    const searchResults = fuse.search(searchQuery);
    filteredCharacters = searchResults.map((result) => result.item);
  } else {
    filteredCharacters = shuffle(allCharacters);
  }

  if (selectedTags.length > 0) {
    filteredCharacters = filteredCharacters.filter((character) =>
      selectedTags.every((tag) => character.data.tags.includes(tag))
    );
  }

  // Implementing pagination
  const pageSize = 20;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedCharacters = filteredCharacters.slice(start, end);
  const totalPages = Math.ceil(filteredCharacters.length / pageSize);

  return { charecters: paginatedCharacters, totalPages: totalPages };
}

export default async function CharacterPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; tag?: string };
}) {
  const searchQuery = searchParams.search || "";
  const selectedTag = searchParams.tag || "";
  const page = parseInt(searchParams.page || "1", 10);

  // Parse tags from the query string
  const existingTags = searchParams.tag
    ? decodeURIComponent(searchParams.tag).split(",")
    : [];

  const { charecters, totalPages } = await getCharecters(
    searchQuery,
    page,
    existingTags
  );

  const allTags = await getTags();

  const toggleTag = (tag: string) => {
    const updatedTags = existingTags.includes(tag)
      ? existingTags.filter((t) => t !== tag) // Remove tag if already selected
      : [...existingTags, tag]; // Add tag if not selected

    return encodeURIComponent(updatedTags.join(","));
  };

  return (
    <main className="flex flex-col items-center  bg-gradient-to-r from-black to-gray-800 min-h-screen">
      {/* Floating Search Bar */}
      <div className="sticky top-0 md:p-4 z-10  w-full backdrop-blur-md">
        
      <SearchBar searchQuery={searchQuery} />
      </div>

      {/* Tag Filter */}

      <DropdownMenu >
        <DropdownMenuTrigger className="pt-4">
          <p>Filter By Tags</p>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <div className="flex justify-between">
              {"Click to select "}
              {existingTags.length > 0 && (
                <Link
                  href={`/?search=${searchQuery}`}
                  className="px-3 py-1 rounded-full text-sm bg-red-500 text-white"
                >
                  Clear Tag Filter
                </Link>
              )}
            </div>
          </DropdownMenuLabel>
          
            <div className="flex flex-wrap gap-2 p-2 overflow-scroll w-screen md:w-[800px] h-[400px] justify-center">
              {allTags
                .map((tag: string) => (
                  <DropdownMenuItem key={tag} className="flex">
                    <Link
                      href={`/?search=${searchQuery}&tag=${toggleTag(tag)}`}
                      className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                        existingTags.includes(tag)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-blue-600"
                      }`}
                    >
                      {tag}
                    </Link>
                  </DropdownMenuItem>
                ))}
            </div>
    
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Characters Grid */}
      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
        {charecters.length > 0 ? (
          charecters.map((character) => {
            const characterID = character.id;
            return (
              <Link href={`/chat/${characterID}`} key={characterID}>
                <div className="bg-darkGray rounded-xl shadow-lg p-4 max-w-xs mx-auto h-full relative hover:bg-gray-800 transition-colors duration-300">
                  {/* Image Section */}
                  <img
                    src={character.data.avatar}
                    alt={character.data.name}
                    className="rounded-t-xl w-full h-66 object-cover"
                  />
                  {/* Likes Section */}

                  {/* Content Section */}
                  <div className="mt-4 text-white">
                    <h3 className="text-xl font-bold">{character.data.name}</h3>
                    <p className="mt-2 text-sm text-gray-300">
                      {character?.introText?.length > 80
                        ? character.introText.slice(0, 80) + "..."
                        : character?.introText || "No description available"}
                    </p>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {character.data.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-700 text-gray-100 px-2 py-1 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p>No characters found for the selected filters.</p>
        )}
      </div>

      {/* Pagination */}
      <Pagination className="flex justify-center items-center space-x-2 mt-4">
        <PaginationContent className="flex flex-wrap justify-center items-center gap-2">
          {/* Previous Page */}
          <PaginationItem>
            {page > 1 ? (
              <PaginationPrevious
                href={`/?page=${
                  page - 1
                }&search=${searchQuery}&tag=${existingTags.join(",")}`}
              />
            ) : (
              <PaginationPrevious
                href="#"
                className="cursor-not-allowed opacity-50"
              />
            )}
          </PaginationItem>

          {/* For Small Screens: Only Show Current Page */}
          <div className="flex lg:hidden">
            {page > 3 && (
              <PaginationItem>
                <PaginationLink
                  href={`/?page=1&search=${searchQuery}&tag=${existingTags.join(
                    ","
                  )}`}
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            {/* Ellipsis Before Current Page */}
            {page > 4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {/* Page Numbers Around Current Page */}
            {Array.from({ length: 3 }, (_, index) => {
              const currentPage = page - 2 + index;
              if (currentPage > 0 && currentPage <= totalPages) {
                return (
                  <PaginationItem key={currentPage}>
                    <PaginationLink
                      href={`/?page=${currentPage}&search=${searchQuery}&tag=${existingTags.join(
                        ","
                      )}`}
                      isActive={currentPage === page}
                    >
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}
            {/* Ellipsis After Current Page */}
            {page + 2 < totalPages && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {/* Last Page */}
            {page + 2 < totalPages && (
              <PaginationItem>
                <PaginationLink
                  href={`/?page=${totalPages}&search=${searchQuery}&tag=${existingTags.join(
                    ","
                  )}`}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
          </div>

          {/* For Larger Screens: Full Pagination */}
          <div className="hidden lg:flex gap-2">
            {/* First Page */}
            {page > 3 && (
              <PaginationItem>
                <PaginationLink
                  href={`/?page=1&search=${searchQuery}&tag=${existingTags.join(
                    ","
                  )}`}
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            {/* Ellipsis Before Current Page */}
            {page > 4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {/* Page Numbers Around Current Page */}
            {Array.from({ length: 5 }, (_, index) => {
              const currentPage = page - 2 + index;
              if (currentPage > 0 && currentPage <= totalPages) {
                return (
                  <PaginationItem key={currentPage}>
                    <PaginationLink
                      href={`/?page=${currentPage}&search=${searchQuery}&tag=${existingTags.join(
                        ","
                      )}`}
                      isActive={currentPage === page}
                    >
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}
            {/* Ellipsis After Current Page */}
            {page + 2 < totalPages && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {/* Last Page */}
            {page + 2 < totalPages && (
              <PaginationItem>
                <PaginationLink
                  href={`/?page=${totalPages}&search=${searchQuery}&tag=${existingTags.join(
                    ","
                  )}`}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
          </div>

          {/* Next Page */}
          <PaginationItem>
            {page < totalPages ? (
              <PaginationNext
                href={`/?page=${
                  page + 1
                }&search=${searchQuery}&tag=${existingTags.join(",")}`}
              />
            ) : (
              <PaginationNext
                href="#"
                className="cursor-not-allowed opacity-50"
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Footer />
    </main>
  );
}
