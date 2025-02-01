"use client";
import React, { FC, useState, useEffect } from "react";
import { SearchIcon, PlusCircle, UserCircle } from "lucide-react";
import Logout from "@/components/authentication/Logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSession } from "next-auth/react";

interface SearchBarProps {
  searchQuery: string;
}

const SearchBar: FC<SearchBarProps> = ({ searchQuery }) => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };

    fetchSession();
  }, []);

  return (
    <div className=" w-full max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-6 px-4 sm:px-0">
        
      <form className="max-w-lg mx-auto">
        <div className="flex">
          <label
            htmlFor="search-dropdown"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Your Email
          </label>
          <button
            id="dropdown-button"
            data-dropdown-toggle="dropdown"
            className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
            type="button"
          >
            All categories{" "}
            <svg
              className="w-2.5 h-2.5 ms-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          <div
            id="dropdown"
            className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdown-button"
            >
              <li>
                <button
                  type="button"
                  className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Mockups
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Templates
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Design
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Logos
                </button>
              </li>
            </ul>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search characters..."
              className="flex-grow w-full min-w-0 px-2 sm:px-4 py-1 sm:py-2 text-base sm:text-lg bg-transparent outline-none text-white dark:text-gray-200"
            />
            <button
              type="submit"
              className="text-gray-400 hover:text-blue-500 transition-colors duration-200 ml-2"
            >
              <SearchIcon size={20} />
            </button>
          </div>
        </div>
      </form>

      <form className="flex-1 sm:flex-initial w-full sm:w-auto">
        <div className="flex items-center border-2 bg-black dark:bg-gray-900 rounded-full shadow-xl  py-2 sm:px-6 sm:py-3">
          <input
            type="text"
            name="search"
            defaultValue={searchQuery}
            placeholder="Search characters..."
            className="flex-grow w-full min-w-0 px-2 sm:px-4 py-1 sm:py-2 text-base sm:text-lg bg-transparent outline-none text-white dark:text-gray-200"
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
  );
};

export default SearchBar;
