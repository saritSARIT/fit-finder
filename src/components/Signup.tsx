"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function SignUp({ onClose }: { onClose: () => void }) {

  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/trainee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error");
      } else {
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
        <label>שם מלא</label>
        <input
          type="text"
          name="name"
          placeholder="הקלד/י שם מלא"
          value={form.name}
          onChange={handleChange}
        />

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

        <label>טלפון</label>
        <input
          type="tel"
          name="phone"
          placeholder="050-1234567"
          value={form.phone}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="btn-submit"
          onClick={handleSubmit}
        >
          הירשם
        </button>

        <hr />

        <button
          type="button"
          className="btn-google"
          onClick={() => signIn("google")}
        >
          <FcGoogle className="text-xl" />
          sign up with Google
        </button>
      </form>
    </motion.div>
  );
}
