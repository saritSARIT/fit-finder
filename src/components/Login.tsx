"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export default function Login({ onClose }: { onClose: () => void }) {

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
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
        callbackUrl: "/dashboard/trainee/searchTraining",
      });

      if (result?.error) {
        alert(result.error);
        return;
      }

      onClose();
      router.push(result?.url || "/dashboard/trainee/searchTraining");
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
      transition={{ duration: 0.2 }}
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
          onClick={() => signIn("google", {
            callbackUrl: "/dashboard/trainee/searchTraining",
            redirect: true
          })}
        >
          <FcGoogle className="text-xl" />
          log in with Google
        </button>
      </form>
    </motion.div>
  );
}
