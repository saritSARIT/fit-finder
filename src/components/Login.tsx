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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`${data.error}`);
      } else {
        localStorage.setItem("id", data.id);
        localStorage.setItem("email", data.email);
        localStorage.setItem("name", data.name);
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
