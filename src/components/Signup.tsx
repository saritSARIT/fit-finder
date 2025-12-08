"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { traineeStore } from "@/store/traineeStore";
import { showToast } from "./toast/Toast";

export default function SignUp({ onClose }: { onClose: () => void }) {

  const setTrainee = traineeStore((state) => state.setTrainee);

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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        const errors = Array.isArray(data.errors) ? data.errors.join("\n") : "";
        showToast(`${data.message}${errors ? ":\n" + errors : ""}`);
        return;
      }

      setTrainee({
        id: data.user.id.insertedId,
        name: data.user.name,
        email: data.user.email,
      })
      router.push("/dashboard/trainee/searchTraining");

      onClose();

    } catch (err) {
      console.error(err);
      showToast("Server error");
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
          onClick={() => signIn("google", {
            callbackUrl: "/dashboard/trainee/searchTraining",
            redirect: true
          })}
        >
          <FcGoogle className="text-xl" />
          sign up with Google
        </button>

      </form>
    </motion.div>
  );
}
