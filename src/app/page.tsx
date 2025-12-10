"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { UniversalHeader, Footer, Login, Signup } from "@/components/index";
import { reviews, blocks } from "@/lib/lang";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // NEW: slider fade + motivation appear
const sliderRef = useRef<HTMLDivElement>(null);
const [showMotivation, setShowMotivation] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    const revealPoint = 200; // כמה צריך לגלול עד שהטקסט יופיע
    const scrollY = window.scrollY;

    if (scrollY > revealPoint) {
      setShowMotivation(true);
    } else {
      setShowMotivation(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  const handleNext = () => {
    if (currentIndex < reviews.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="home-container">

      {/* --- HEADER --- */}
      <UniversalHeader
        role="guest"
        onLogin={() => setShowLogin(true)}
        onSignUp={() => setShowSignUp(true)}
      />

      {/* --- IMAGE SLIDER (fade on scroll) --- */}
      <div className="image-slider" ref={sliderRef}>
        {[
          "/images/gym2.png",
          "/images/gym8.png",
          "/images/gym4.png",
          "/images/gym7.png",
        ].map((src, i) => (
          <div key={i} className="slider-image">
            <Image src={src} alt={`slide ${i + 1}`} fill className="fade-image" />
          </div>
        ))}
      </div>

      {/* --- MOTIVATION SECTION --- */}
      <div className={`motivation-section ${showMotivation ? "show" : ""}`}>
        <h1 className="motivation-title">לחיות בריא מתחיל בצעד אחד!</h1>
        <h3 className="motivation-subtitle">
          מצאו אימונים קרובים אליכם והתחילו לזוז כבר היום!
        </h3>
        <p className="motivation-coach">
          מאמנים? הצטרפו לפלטפורמה והגיעו למתאמנים שמחפשים בדיוק אתכם!
        </p>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="main-grid">
        {blocks.map((item, i) => (
          <div key={i} className={`grid-item ${item.type}`}>
            {item.type === "image" ? (
              <Image
                src={item.src || ""}
                alt={`gym ${i + 1}`}
                width={400}
                height={300}
                className="grid-image"
                unoptimized
              />
            ) : (
              <p className="grid-text">{item.text}</p>
            )}
          </div>
        ))}
      </main>

      {/* --- REVIEWS SECTION --- */}
      <div className="reviews-section">
        <h2 className="reviews-title">מה אנשים אומרים עלינו</h2>

        <div className="reviews-wrapper">
          <button className="arrow-btn left" onClick={handlePrev}>❯</button>

          <div className="reviews-container">
            {reviews.slice(currentIndex, currentIndex + 3).map((review, i) => (
              <div className="review-card" key={i}>
                <p className="review-author">{review.author}</p>
                <p className="review-text">{review.text}</p>
              </div>
            ))}
          </div>

          <button className="arrow-btn right" onClick={handleNext}>❮</button>
        </div>
      </div>

      {/* --- MODALS --- */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showSignUp && <Signup onClose={() => setShowSignUp(false)} />}
    </div>
  );
}
