import { useEffect, useRef, useState } from "react";
/* ---------------- CONFIG ---------------- */
const MUSIC_PLAYLIST = [
  "/music/love1.mp3",
  "/music/love2.mp3",
  "/music/love3.mp3",
  "/music/love4.mp3",
  "/music/love5.mp3",
];

const BACKGROUNDS = [
  { type: "gradient", value: "linear-gradient(135deg, #2b0a12, #5c1a2d, #a23b55)" },
  { type: "gradient", value: "linear-gradient(135deg, #3a0f1c, #7a1e3a)" },
  { type: "image", value: "/bg-2.jpg" },
  { type: "image", value: "/bg-3.jpg" },
  { type: "image", value: "/bg-4.jpg" },
  { type: "image", value: "/bg-5.jpg" },
];

const NO_MESSAGES = [
  "No… 😳","Wait, what?","You clicked that already?","Really? Now?","I’m shocked 🥺",
  "My heart skipped a beat","Are you sure about this?","I feel confused…",
  "Okay now I’m sad","This hurts emotionally","My soul whispered yes",
  "I’m devastated 😭","You’re breaking me softly","This is emotional blackmail territory",
  "Even the stars are judging you","I’ll wait forever if I must","I dressed up emotionally for this",
  "My heart still says yes","Somewhere a teddy bear cried","My tears are playful but serious",
  "Please reconsider, my honey bear","I refuse to give up on us","This is the saddest rom-com scene",
  "You can’t escape destiny 😌","I’ll keep asking if I have to","Imagine how cute we’d be together",
  "My heart beats for you","You’re making me write poems for this","Okay… just kidding, I forgive you 😅",
  "💔 But I still love you obviously","Even the music feels sad now","This hurts romantically",
  "You’re too strong… but not stronger than us",
];

const LOVE_LETTER = ` My dearest meri jaan,
From the first moment, you’ve filled my life with warmth, laughter, and endless love.
Every “Yes” in my heart has been for you, and now this moment is ours forever.
I promise to keep cherishing you, hugging you, and making every day feel like Valentine’s Day.
Love always, your honey bear 💖`;

export default function Page() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [typedLetter, setTypedLetter] = useState("");
  const [bgIndex, setBgIndex] = useState(0);
  const [musicIndex, setMusicIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [crash, setCrash] = useState(false);

  const audioRef = useRef(null);

  /* ------------- MUSIC LOGIC ------------- */
useEffect(() => {
  if (!audioRef.current) {
    audioRef.current = new Audio(MUSIC_PLAYLIST[musicIndex]);
    audioRef.current.volume = 0.6;
    audioRef.current.loop = false;

    // iOS-safe: play muted first
    audioRef.current.muted = true;
    audioRef.current.play().catch(() => {});

    // Once user clicks anywhere, unmute
    const handleInteraction = () => {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("click", handleInteraction);
    };

    window.addEventListener("touchstart", handleInteraction);
    window.addEventListener("click", handleInteraction);

    audioRef.current.onended = () => {
      setMusicIndex((i) => (i + 1) % MUSIC_PLAYLIST.length);
    };
  }
}, []);


  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = MUSIC_PLAYLIST[musicIndex];
    audioRef.current.play().catch(() => {});
  }, [musicIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  const handleNextMusic = () => {
    setMusicIndex((i) => (i + 1) % MUSIC_PLAYLIST.length);
  };

  /* ------------- BACKGROUND CYCLE ------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((i) => (i + 1) % BACKGROUNDS.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  /* ------------- NO CLICK ------------- */
  const handleNoClick = () => {
    const nextCount = noCount + 1;

    if (nextCount === 25) {
      setCrash(true);
      setTimeout(() => setCrash(false), 2500);
    }

    setNoCount(nextCount);

    if (navigator.vibrate) navigator.vibrate(50);
  };

  const noText = NO_MESSAGES[noCount % NO_MESSAGES.length];

  const yesPaddingY = Math.min(16 + noCount * 3, 32);
  const yesPaddingX = Math.min(36 + noCount * 6, 64);
  const yesFontSize = Math.min(18 + noCount * 1.5, 36);

  /* ------------- TYPED LOVE LETTER ------------- */
  useEffect(() => {
    if (!yesPressed) return;
    let index = 0;
    const interval = setInterval(() => {
      setTypedLetter((t) => t + LOVE_LETTER[index]);
      index++;
      if (index >= LOVE_LETTER.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [yesPressed]);

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 z-0 transition-all duration-1000"
        style={{
          background:
            BACKGROUNDS[bgIndex].type === "image"
              ? `url(${BACKGROUNDS[bgIndex].value}) no-repeat center center / cover`
              : BACKGROUNDS[bgIndex].value,
        }}
      />

      {/* MUSIC CONTROL */}
      <div className="absolute top-4 right-4 flex gap-2 z-50">
        <button
          onClick={() => setMuted((m) => !m)}
          className="bg-black/40 text-white px-3 py-1 rounded-full backdrop-blur"
        >
          {muted ? "🔇" : "🎵"}
        </button>
        <button
          onClick={handleNextMusic}
          className="bg-black/40 text-white px-3 py-1 rounded-full backdrop-blur"
        >
          ⏭️
        </button>
      </div>

      {crash && (
        <div className="absolute inset-0 bg-black text-white flex items-center justify-center text-2xl font-bold animate-pulse z-50">
          💥 App crashed! 💥
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-md w-full text-center bg-white/15 backdrop-blur-xl rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-6">
        {yesPressed ? (
          <>
            <CanvasConfetti />
            <img
              src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif"
              className="mx-auto w-40 md:w-48"
            />
            <h1 className="text-4xl font-bold mt-6 text-white">
              Love unlocked 💖
            </h1>
            <p className="text-white/80 mt-2 whitespace-pre-wrap">{typedLetter}</p>
          </>
        ) : (
          <>
            <img src="https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif" className="w-30 mx-auto animate-pulse mb-2" />
            {/* <img src={lovesvg2} className="w-20 mx-auto animate-pulse mb-4" /> */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Will you be my Valentine?
            </h1>

            <div className="flex flex-col items-center gap-6 w-full">
              {/* YES */}
              <button
                onClick={() => setYesPressed(true)}
                style={{
                  padding: `${yesPaddingY}px ${yesPaddingX}px`,
                  fontSize: `${yesFontSize}px`,
                }}
                className="bg-green-500 text-white font-bold rounded-full shadow-lg transition-all duration-300 max-w-[90%]"
              >
                YES 💘
              </button>

              {/* NO */}
              <button
                onClick={handleNoClick}
                className="bg-rose-600 text-white font-semibold py-3 px-6 rounded-full max-w-[90%] text-center transition-all duration-300"
              >
                {noText}
              </button>

              {/* Emotional Counter */}
              {noCount > 0 && (
                <div className="text-sm text-white/80 animate-pulse">
                  Emotional damage caused: {noCount} 💔
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------- Canvas Confetti ------------- */
const CanvasConfetti = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h - h,
        r: Math.random() * 6 + 4,
        d: Math.random() * 1 + 1,
        color: `hsl(${Math.random() * 360},100%,50%)`,
      });
    }

    let animation;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.y += p.d + 2;
        if (p.y > h) p.y = -10;
      });
      animation = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animation);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-20" />;
};
