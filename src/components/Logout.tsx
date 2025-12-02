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
        <button onClick={() => handleLogout()}>התנתק</button>
    );
}
