"use client";

import { useRouter } from "next/navigation";
import { traineeStore } from "@/store/traineeStore";
import { trainerStore } from "@/store/trainerStore";

export default function Logout() {
    const router = useRouter();
    const { logout: logoutTrainee } = traineeStore();
    const { logout: logoutTrainer } = trainerStore();

    const handleLogout = () => {
        logoutTrainee();
        logoutTrainer();
        localStorage.removeItem("trainee-storage");
        localStorage.removeItem("trainer-storage");
        localStorage.removeItem("selectedTrainer");
        localStorage.removeItem("selectedTraining");
        router.push("/");
    };

    return (
        <button
            onClick={handleLogout}
            style={{
                backgroundColor: "#f5c000", // רקע צהוב
                border: "2px solid #0046a5", // מסגרת כחולה, אפשר להוריד אם לא רוצים מסגרת
                borderRadius: "50%", // מעגלי למראה טוב
                padding: "5px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0046a5" // צבע קו כחול
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
        </button>
    );
}
