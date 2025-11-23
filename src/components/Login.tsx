"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { userStore } from "@/store/userStore";

export default function Login({ onClose }: { onClose: () => void }) {

  const setUser = userStore((state) => state.setUser);

  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // שימוש ב-NextAuth במקום API route נפרד
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        alert("אימייל או סיסמה שגויים");
        return;
      }

      // אחרי signIn מוצלח, נטען את ה-session המעודכן
      if (result?.ok) {
        const updatedSession = await getSession();
        if (updatedSession?.user) {
          setUser({ 
            id: updatedSession.user.id || "", 
            name: updatedSession.user.name || "", 
            email: updatedSession.user.email || "" 
          });
        }
        router.push("/dashboard/trainee/searchTraining");
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };


  return (
    <motion.div
      className="side-modal"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.6 }}
    >
      <div className="modal-header">
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
        <label>אימייל</label>
        <input
          type="email"
          name="email"
          placeholder="example@gmail.com"
          value={form.email}
          onChange={handleChange}
        />

        <label>סיסמה</label>
        <input
          type="password"
          name="password"
          placeholder="••••••"
          value={form.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="btn-submit"
          onClick={handleSubmit}
        >
          התחבר
        </button>

        <hr />

        <button
          type="button"
          className="btn-google"
          onClick={() => signIn("google")}
        >
          <FcGoogle className="text-xl" />
          logIn with Google
        </button>
      </form>
    </motion.div>
  );
}
