'use client';
import React, { FC, useState, useEffect, useRef } from "react";
import { SearchIcon, PlusCircle, UserCircle, LogInIcon, History } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSession } from "next-auth/react";

interface SearchBarProps {
  searchQuery: string;
}

const SearchBar: FC<SearchBarProps> = ({ searchQuery }) => {
  const [session, setSession] = useState<any>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className=" w-full justify-between  px-4 sm:px-8 ">
      {/* Search Bar Overlay (Mobile View) */}
      {isSearchVisible && (
        <div className="mt-4 absolute inset-0 z-20 bg-black dark:bg-gray-900 flex items-center px-4 sm:hidden">
          <form className="w-full">
            <div className="mt-8 flex items-center border-2 bg-black dark:bg-gray-900 rounded-full shadow-xl py-2 px-4">
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search characters..."
                className="flex-grow w-full px-2 py-1 text-base bg-transparent outline-none text-white dark:text-gray-200"
              />
              <button
                type="submit"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-200 ml-2"
              >
                <SearchIcon size={20} />
              </button>
              <button
                type="button"
                className="text-gray-400 hover:text-red-500 transition-colors duration-200 ml-2"
                aria-label="Close Search"
                onClick={() => setIsSearchVisible(false)}
              >
                ✖
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Top Bar */}
      <div className={`flex items-center justify-between ${isSearchVisible ? "hidden sm:flex" : "flex"}`}>
        {/* Left: Avatar */}
        <div className="flex-shrink-0">
          <Avatar className="h-16 w-16">
            <AvatarImage src="logo.png" alt="Logo" className="h-16 w-16" />
            <AvatarFallback className="text-2xl">CN</AvatarFallback>
          </Avatar>
        </div>

        {/* Center: Search Bar (PC View) */}
        <div className="flex w-90vw ">

        <div className="hidden sm:block flex-1 mx-4 ">
          <form>
            <div className="flex items-center border-2 w-full bg-black dark:bg-gray-900 rounded-full shadow-xl py-2 sm:px-6 sm:py-3">
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search characters..."
                className="flex-grow w-full  min-w-0 px-2 sm:px-4 py-1 sm:py-2 text-base sm:text-lg bg-transparent outline-none text-white dark:text-gray-200"
                />
              <button
                type="submit"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-200 ml-2"
                >
                <SearchIcon size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-4">
          {/* Search Icon (Mobile) */}
          <button
            className={`sm:hidden p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200 ${
              isSearchVisible ? "hidden" : "block"
            }`}
            aria-label="Search"
            onClick={() => setIsSearchVisible(true)}
            >
            <SearchIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Create Button */}
          {session?.user && (
            <button
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
            aria-label="Create"
            >
              <PlusCircle className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
            </button>
          )}
          {session?.user && (
            <a href="/history">
              <button
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                aria-label="History"
              >
                <History className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
              </button>
            </a>
          )}

          {/* Profile Icon */}
          {session?.user ? (
            <a href="/profile">
              <button
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                aria-label="Profile"
                >
                <UserCircle className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
              </button>
            </a>
          ) : (
            <a href="/sign-in">
              <button
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                aria-label="Sign In"
                >
                <LogInIcon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
              </button>
            </a>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default SearchBar;
