import React, { useState } from "react";
import { Settings, Camera, Mail, CreditCard } from "lucide-react";
import Logout from "./authentication/Logout";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = {
  name: string;
  email: string;
  image: string;
  accountTier: string;
};

type UserProfileProps = {
  user: User;
  onUpdate: (updatedUser: Partial<User>) => void;
};

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  const session = useSession();
  console.log(session);

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [newImage, setNewImage] = useState<File | null>(null);

  const handleNameChange = () => {
    if (newName.trim() && newName !== user.name) {
      onUpdate({ name: newName });
    }
    setEditingName(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setNewImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onUpdate({ image: reader.result.toString() });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />

          {/* Profile Section */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            <div className="relative -mt-16 flex flex-col sm:flex-row sm:items-end sm:space-x-5">
              <div className="relative group">
                <Avatar>
                  <AvatarImage src={session.data?.user?.image || "logo.png"} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>

              <div className="mt-6 sm:mt-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {editingName ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="border-2 border-gray-300 rounded-lg px-3 py-2 text-lg font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={handleNameChange}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingName(false)}
                          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <h1 className="text-2xl font-bold text-gray-900">
                          {session?.data?.user.name || session?.data?.user.email?.split("@")[0]}
                        </h1>

                        <button
                          onClick={() => setEditingName(true)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Settings className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center mt-2 text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <p>{session?.data?.user.email}</p>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {user.accountTier} Plan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details Section */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Account Overview
                </h2>
                <dl className="mt-4 space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Membership Status
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.accountTier} Member
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Account Email
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {session?.data?.user.email}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Account Actions
                </h2>
                <div className="mt-4">
                  <Logout />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
