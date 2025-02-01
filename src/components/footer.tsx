import React from "react";
import { FaReddit, FaInstagram, FaDiscord } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-4 text-white py-4">
      <div className="container mx-auto flex flex-col items-center space-y-4">
        <h2 className="text-lg font-semibold">Connect with us</h2>
        <div className="flex space-x-6">
          {/* Reddit */}
          <a
            href="https://www.reddit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
          >
            <FaReddit size={24} />
          </a>
          {/* Instagram */}
          <a
            href="https://www.instagram.com/ent_ai_ce?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
          >
            <FaInstagram size={24} />
          </a>
          {/* Discord */}
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
          >
            <FaDiscord size={24} />
          </a>
        </div>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Your Brand. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
