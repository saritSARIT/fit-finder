"use client";
import Image from "next/image";
import { useState } from "react";
import { header, Footer, Login, Signup } from "@/components/index";
import { reviews } from "@/lib/lang";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => { if (currentIndex < reviews.length - 3) { setCurrentIndex(currentIndex + 1) } };
  const handlePrev = () => { if (currentIndex > 0) { setCurrentIndex(currentIndex - 1) } };


  return (
    <div className="home-container">
      {/* --- HEADER --- */}
      <header className="header">


        <div className="logo-section">
          <Image src="/images/logo.png" alt="FitFinder Logo" width={100} height={100} />
        </div>

        <div className="buttons-section">
          <button className="btn-yellow" onClick={() => setShowSignUp(true)}>
            Sign Up
          </button>
          <button className="btn-yellow" onClick={() => setShowLogin(true)}>
            Log In
          </button>
        </div>

      </header>
      {/* --- IMAGE SLIDER (fade effect) --- */}
      <div className="image-slider">
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

      {/* --- MAIN CONTENT --- */}
      <main className="main-grid">

        {/* Move this object to lib */}
        {[
          { type: "image", src: "/images/gym8.png" },
          { type: "text", text: "הצלחה מתחילה בהחלטה." },
          { type: "image", src: "/images/gym2.png" },
          { type: "text", text: "אין קיצורי דרך — יש התמדה." },
          { type: "image", src: "/images/gym6.png" },
          { type: "text", text: "כל יום טוב יותר מאתמול." },
          { type: "image", src: "/images/gym2.png" },
          { type: "text", text: "הגוף שלך שומע כל מחשבה שלך." },
          { type: "image", src: "/images/gym7.png" },
        ].map((item, i) => (
          <div key={i} className={`grid-item ${item.type}`}>
            {item.type === "image" ? (
              <Image src={item.src || ""} alt={`gym ${i + 1}`} width={400} height={300} className="grid-image" unoptimized />
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
          <button className="arrow-btn left" onClick={handlePrev}>
            ❮
          </button>

          <div className="reviews-container">
            {reviews
              .slice(currentIndex, currentIndex + 3)
              .map((review, index) => (
                <div key={index} className="review-card">
                  <p className="review-text">"{review.text}"</p>
                  <p className="review-author">— {review.author}</p>
                </div>
              ))}
          </div>

          <button className="arrow-btn right" onClick={handleNext}>
            ❯
          </button>
        </div>
      </div>



      {/* --- MODALS (חלונות צד) --- */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showSignUp && <Signup onClose={() => setShowSignUp(false)} />}
    </div>
  );
}

