"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { traineeStore } from "@/store/traineeStore";

export default function AuthListener() {
  const { data: session, status } = useSession();
  const setTrainee = traineeStore((state) => state.setTrainee);

  useEffect(() => {
    // אחרי רענון, אם יש session, נטען את המידע ל-store
    if (status === "authenticated" && session?.user?.email) {
      setTrainee({
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email,
        image: session.user.image || "/images/UserProfile.png",
      });
    }
  }, [status, session, setTrainee]);

  return null; 
}

