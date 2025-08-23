/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";
import { UserData } from "@/types/types";
import axios from "@/lib/axios";

interface UseProfileUpdateProps {
  setUserProfile: (profile: UserData) => void;
}

export function useProfileUpdate({ setUserProfile }: UseProfileUpdateProps) {
  const [isUpdatingUserProfile, setIsUpdatingUserProfile] = useState(false);

  const handleUpdateUserProfile = async (
    newProfile: UserData
  ): Promise<boolean> => {
    try {
      setIsUpdatingUserProfile(true);

      const response = await axios.post("/api/update-user-profile", newProfile);

      if (response.status === 200) {
        const { profile: updatedProfile } = response.data;

        setUserProfile({
          id: updatedProfile.id,
          email: updatedProfile.email,
          name: updatedProfile.username,
          avatarUrl: updatedProfile.avatarUrl,
          isEmailVerified: updatedProfile.isEmailVerified,
          createdAt: updatedProfile.createdAt,
        });

        toast.success("Profile updated successfully");

        return true;
      } else {
        throw new Error(response.data.error || "Failed to update profile");
      }
    } catch (error: any) {
      // Catch axios error
      console.error(
        "Error updating profile:",
        error.response?.data?.error || error.message
      );
      toast.error("Failed to update profile");

      return false;
    } finally {
      setIsUpdatingUserProfile(false);
    }
  };

  return {
    handleUpdateUserProfile,
    isUpdatingUserProfile,
  };
}
