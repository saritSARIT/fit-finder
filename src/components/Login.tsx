"use client";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export default function Login({ onClose }: { onClose: () => void }) {
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
        <input type="email" placeholder="example@gmail.com" />

        <label>סיסמה</label>
        <input type="password" placeholder="••••••" />

        <button type="submit" className="btn-submit">התחבר</button>

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
