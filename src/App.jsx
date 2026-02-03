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

const LOVE_LETTER = `
My dearest meri jaan,

From the moment you entered my life, everything softened.
Every laugh, every quiet second, every heartbeat feels better because it’s you.

This little app, these silly buttons, the dramatic begging—
it’s all just me saying I love you in every language I know.

Today, tomorrow, and every Valentine after this…
it’s you. Always you.

Forever yours,
your honey bear 💖
`;

const NO_MESSAGES = [
  "No… 😳",
  "Wait—what?",
  "That was unexpected",
  "I wasn’t ready for that",
  "You clicked it again?",
  "Bold choice 😅",
  "My heart blinked",
  "Okay that startled me",
  "Are we playing games now?",
  "I’m confused but curious",

  "Was that an accident?",
  "Let’s rewind a bit",
  "I thought we were vibing",
  "My brain says huh",
  "My heart says wait",
  "This feels suspicious",
  "Are you sure though?",
  "I’m processing this",
  "That landed softly… but still",
  "Hmm… interesting decision",

  "Okay that stung a little",
  "My smile just faded",
  "I suddenly miss you",
  "I dressed my emotions for this",
  "My teddy bear looks worried",
  "I was hopeful you know",
  "That one hurt gently",
  "My heart went quiet",
  "I really believed",
  "This feels like a sad scene",

  "Okay now it hurts",
  "My heart made a noise",
  "This feels personal now",
  "The music got sad",
  "I need a dramatic pause",
  "This is becoming a rom-com",
  "I might cry (playfully)",
  "Why are you so strong",
  "This wasn’t in my plan",
  "I prepared for yes",

  "This is emotional blackmail territory",
  "I’ll wait if I have to",
  "You know I don’t give up",
  "Persistence is my love language",
  "I hope you like effort",
  "I’ll keep asking softly",
  "My heart refuses alternatives",
  "Even the stars disagree",
  "Destiny is judging you",
  "This is canon",

  "You can’t escape this forever",
  "All timelines end with yes",
  "Fate already clicked yes",
  "The universe is patient",
  "Love has plot armor",
  "This was inevitable",
  "Time is on my side",
  "Every version of me asks",
  "I choose you again",
  "Still hoping",

  "I just really want this to be you",
  "I don’t ask lightly",
  "This matters more than I show",
  "It’s always been you",
  "I’m still here",
  "I’ll wait quietly now",
  "Take your time, my love",
  "Whenever you’re ready",
  "My answer never changed",
  "Still yes 💗",
];


/* ---------------- PAGE ---------------- */

export default function Page() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [typedLetter, setTypedLetter] = useState("");
  const [bgIndex, setBgIndex] = useState(0);
  const [musicIndex, setMusicIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [crash, setCrash] = useState(false);

  const audioRef = useRef(null);

  /* -------- MUSIC (iOS SAFE) -------- */

  useEffect(() => {
    audioRef.current = new Audio(MUSIC_PLAYLIST[0]);
    audioRef.current.volume = 0.6;
    audioRef.current.muted = true;
    audioRef.current.play().catch(() => {});

    const unlock = () => {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("touchstart", unlock);
    window.addEventListener("click", unlock);

    audioRef.current.onended = () => {
      setMusicIndex((i) => (i + 1) % MUSIC_PLAYLIST.length);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = MUSIC_PLAYLIST[musicIndex];
    audioRef.current.play().catch(() => {});
  }, [musicIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  /* -------- BACKGROUND CYCLE -------- */

  useEffect(() => {
    const t = setInterval(
      () => setBgIndex((i) => (i + 1) % BACKGROUNDS.length),
      10000
    );
    return () => clearInterval(t);
  }, []);

  /* -------- NO CLICK -------- */

  const handleNoClick = () => {
    const next = noCount + 1;
    setNoCount(next);

    if (next === 25) {
      setCrash(true);
      setTimeout(() => setCrash(false), 2200);
    }

    navigator.vibrate?.(40);
  };

  const noText = NO_MESSAGES[noCount % NO_MESSAGES.length];

  /* -------- YES SIZE (CAPPED) -------- */

  const yesFont = Math.min(20 + noCount * 1.2, 34);
  const yesPadY = Math.min(16 + noCount * 2, 28);
  const yesPadX = Math.min(40 + noCount * 4, 72);

  /* -------- TYPE LETTER -------- */

  useEffect(() => {
    if (!yesPressed) return;
    let i = 0;
    const t = setInterval(() => {
      setTypedLetter((p) => p + LOVE_LETTER[i]);
      i++;
      if (i >= LOVE_LETTER.length) clearInterval(t);
    }, 28);
    return () => clearInterval(t);
  }, [yesPressed]);

  return (
    <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background:
            BACKGROUNDS[bgIndex].type === "image"
              ? `url(${BACKGROUNDS[bgIndex].value}) center / cover no-repeat`
              : BACKGROUNDS[bgIndex].value,
        }}
      />

      {/* CONTROLS */}
      <div className="absolute top-4 right-4 flex gap-2 z-50">
        <button onClick={() => setMuted((m) => !m)} className="px-3 py-1 bg-black/40 rounded-full text-white">
          {muted ? "🔇" : "🎵"}
        </button>
        <button onClick={() => setMusicIndex((i) => (i + 1) % MUSIC_PLAYLIST.length)} className="px-3 py-1 bg-black/40 rounded-full text-white">
          ⏭️
        </button>
      </div>

      {crash && (
        <div className="absolute inset-0 bg-black flex items-center justify-center text-white text-2xl z-50">
          💥 App crashed… Just kidding 😌
        </div>
      )}

      {/* CARD */}
      <div className="relative z-10 bg-white/15 backdrop-blur-xl rounded-3xl p-6 w-[92%] max-w-md text-center shadow-2xl">
        {yesPressed ? (
          <>
            <Confetti />
            <img
              src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif"
              className="mx-auto w-40 md:w-48"
            />
            <h1 className="text-4xl font-bold text-white mb-4">Love unlocked 💖</h1>
            <p className="text-white/90 whitespace-pre-wrap">{typedLetter}</p>
            <p className="mt-4 text-white/70 italic">Memory saved forever 💾</p>
          </>
        ) : (
          <>
           <img src="https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif" className="w-30 mx-auto animate-pulse mb-2" />
            <h1 className="text-3xl font-bold text-white mb-6">
              Will you be my Valentine, meri Curvy Queen?
            </h1>

            <div className="flex flex-col items-center gap-6">
              <button
                onClick={() => setYesPressed(true)}
                style={{
                  fontSize: yesFont,
                  padding: `${yesPadY}px ${yesPadX}px`,
                }}
                className="bg-green-500 rounded-full font-bold text-white transition-all shadow-lg"
              >
                YES 💘
              </button>

              <button
                onClick={handleNoClick}
                className="bg-rose-600 px-6 py-3 rounded-full text-white max-w-[90%]"
              >
                {noText}
              </button>

              {noCount > 0 && (
                <div className="text-white/80 text-sm">
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

/* -------- CONFETTI (CALM) -------- */

function Confetti() {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const parts = Array.from({ length: 60 }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height - c.height,
      r: Math.random() * 5 + 3,
      d: Math.random() * 0.6 + 0.4,
      col: `hsl(${Math.random() * 360},100%,60%)`,
    }));

    let a;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      parts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col;
        ctx.fill();
        p.y += p.d;
        if (p.y > c.height) p.y = -10;
      });
      a = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(a);
  }, []);

  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" />;
}
