"use client";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { userStore } from "@/store/userStore";

export default function AuthListener() {
  const { data: session, status } = useSession();
  const setUser = userStore((state) => state.setUser);
  const logout = userStore((state) => state.logout);
  const lastEmailRef = useRef<string | null>(null);

  useEffect(() => {
    // אחרי רענון, אם יש session, נטען את המידע ל-store
    if (status === "authenticated" && session?.user?.email) {
      const sessionEmail = session.user.email;
      
      // נבדוק אם האימייל השתנה כדי למנוע עדכונים מיותרים
      if (lastEmailRef.current !== sessionEmail) {
        lastEmailRef.current = sessionEmail;
        
        // נבדוק את ה-store הנוכחי בלי להוסיף אותו ל-dependencies
        const currentUser = userStore.getState().user;
        
        // אם אין משתמש נוכחי או שהאימייל תואם, נעדכן
        if (!currentUser || currentUser.email === sessionEmail) {
          setUser({
            id: session.user.id || "",
            name: session.user.name || "",
            email: sessionEmail,
          });
        } else {
          // אם האימייל לא תואם, זה אומר שיש session של משתמש אחר - ננקה
          logout();
          setUser({
            id: session.user.id || "",
            name: session.user.name || "",
            email: sessionEmail,
          });
        }
      }
    } else if (status === "unauthenticated") {
      // אם אין session, ננקה את ה-store
      if (lastEmailRef.current !== null) {
        lastEmailRef.current = null;
        logout();
      }
    }
  }, [status, session, setUser, logout]);

  return null; // לא מציג כלום, רק מאזין
}

