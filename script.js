const SUPABASE_URL = "https://uvkercnxdwhuqqvywgom.supabase.co";
const SUPABASE_KEY = "sb_publishable_mRS4_JbcszbPr7bYCnWn6g_fONgjJ53";
const timer = document.getElementById("timer");
const timerHint = document.getElementById("timerHint");

const gameButton = document.getElementById("gameButton");

const result = document.getElementById("result");

const shareButton = document.getElementById("shareButton");

const statusText = document.querySelector(".status");
const stopEffect = document.getElementById("stopEffect");

const effectLabel = document.getElementById("effectLabel");

const effectTime = document.getElementById("effectTime");

const effectSub = document.getElementById("effectSub");

const TARGET = 7.77;

let startTime = 0;

let animationId = null;

let playing = false;

let lastTime = 0;
let lastDifference = 0;
let lastRank = "";
let perfectStreak = Number(localStorage.getItem("perfectStreak")) || 0;
let bestDifference = localStorage.getItem("bestDifference");

if (bestDifference !== null) {
  bestDifference = Number(bestDifference);
}

/* =========================
   GAME BUTTON
========================= */

gameButton.addEventListener("click", () => {
  if (!playing) {
    startGame();
  } else {
    stopGame();
  }
});

/* =========================
   START
========================= */

function startGame() {
  playing = true;

  document.body.classList.remove("perfect");

  result.classList.remove("show");
  shareButton.classList.remove("show");

  result.innerHTML = "";

  timer.textContent = "0.00";

  timerHint.textContent = "WATCH THE CLOCK";

  statusText.textContent = "● RUNNING";

  gameButton.textContent = "STOP";

  startTime = performance.now();

  updateTimer();
}

/* =========================
   TIMER
========================= */

function updateTimer() {
  if (!playing) return;

  const elapsed = (performance.now() - startTime) / 1000;

  if (elapsed < 3) {
    timer.textContent = elapsed.toFixed(2);

    timerHint.textContent = "WATCH THE CLOCK";
  } else {
    timer.textContent = "HIDDEN";

    timerHint.textContent = "TRUST YOUR INSTINCT";
  }

  animationId = requestAnimationFrame(updateTimer);
}

/* =========================
   STOP
========================= */

function stopGame() {
  playing = false;

  cancelAnimationFrame(animationId);

  const elapsed = (performance.now() - startTime) / 1000;

  const stoppedTime = Math.round(elapsed * 100) / 100;

  const difference = Math.abs(stoppedTime - TARGET);

  timer.textContent = stoppedTime.toFixed(2);

  timerHint.textContent = "FINAL TIME";

  statusText.textContent = "● FINISHED";

  gameButton.textContent = "TRY AGAIN";

  playStopEffect(stoppedTime, difference);
}

/* =========================
   RESULT
========================= */

function showResult(time, difference) {
  let rank;
  let message;
  let isPerfect = false;

  if (difference < 0.005) {
    rank = "GOD";

    message = "PERFECT 7.77 — UNBELIEVABLE.";

    isPerfect = true;

    perfectStreak++;

    localStorage.setItem("perfectStreak", perfectStreak);

    document.body.classList.add("perfect");
  } else if (difference <= 0.02) {
    rank = "S RANK";

    message = "Almost perfect. Can anyone beat this?";
  } else if (difference <= 0.05) {
    rank = "A RANK";

    message = "Insanely close.";
  } else if (difference <= 0.1) {
    rank = "B RANK";

    message = "Your time sense is sharp.";
  } else if (difference <= 0.3) {
    rank = "C RANK";

    message = "Close. One more try.";
  } else {
    rank = "D RANK";

    message = "7.77 is harder than it looks.";
  }
  if (!isPerfect) {
    perfectStreak = 0;

    localStorage.setItem("perfectStreak", perfectStreak);
  }

  lastTime = time;

  lastDifference = difference;

  lastRank = rank;
  savePlayData(time, difference, rank);
  let isNewBest = false;

  if (bestDifference === null || difference < bestDifference) {
    bestDifference = difference;

    localStorage.setItem("bestDifference", bestDifference);

    isNewBest = true;
  }

  const signedError = time - TARGET;

  const errorText =
    signedError >= 0 ? `+${signedError.toFixed(2)}` : signedError.toFixed(2);
  const bestText = bestDifference.toFixed(2);
  result.innerHTML = `

        <div class="result-title">
            YOUR RESULT
        </div>


        <div class="result-time">
            ${time.toFixed(2)}
        </div>


        <div class="seconds">
            SECONDS
        </div>


        <div class="error">
            ERROR ${errorText}s
        </div>
        <div class="best">
    BEST ERROR ${bestText}s
</div>

${isNewBest ? `<div class="new-best">NEW BEST!</div>` : ""}


        <div class="rank">
            ${rank}
        </div>


        <div class="message">
            ${message}
        </div>

        ${
          isPerfect
            ? `

    <div class="streak">

        <div class="streak-label">
            PERFECT STREAK
        </div>

        <div class="streak-number">
            ×${perfectStreak}
        </div>

    </div>

`
            : ""
        }

    `;

  result.classList.add("show");

  shareButton.classList.add("show");
}

/* =========================
   X SHARE
========================= */

shareButton.addEventListener("click", () => {
  const signedError = lastTime - TARGET;

  const errorText =
    signedError >= 0 ? `+${signedError.toFixed(2)}` : signedError.toFixed(2);

  const text = `⏱ STOP 7.77

I stopped at ${lastTime.toFixed(2)}s

ERROR ${errorText}s
🏆 ${lastRank}

Can you stop exactly at 7.77?

#STOP777 #777Challenge`;

  const shareUrl =
    "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);

  window.open(shareUrl, "_blank");
});
function playStopEffect(time, difference) {
  const isPerfect = difference < 0.005;

  effectTime.textContent = time.toFixed(2);

  if (isPerfect) {
    effectLabel.textContent = "PERFECT";

    effectSub.textContent = "EXACTLY 7.77";

    stopEffect.classList.add("perfect-effect");
  } else {
    effectLabel.textContent = "STOPPED";

    effectSub.textContent = "SECONDS";

    stopEffect.classList.remove("perfect-effect");
  }

  stopEffect.classList.add("show");

  setTimeout(
    () => {
      stopEffect.classList.remove("show");

      setTimeout(() => {
        showResult(time, difference);
      }, 180);
    },
    isPerfect ? 1100 : 750,
  );
}
async function savePlayData(time, difference, rank) {
  try {
    let playerId = localStorage.getItem("playerId");

    if (!playerId) {
      playerId = crypto.randomUUID();
      localStorage.setItem("playerId", playerId);
    }

    const device = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
      ? "mobile"
      : "desktop";

    const response = await fetch(`${SUPABASE_URL}/rest/v1/plays`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=minimal",
      },

      body: JSON.stringify({
        player_id: playerId,
        score: time,
        error: difference,
        rank: rank,
        device: device,
      }),
    });

    if (!response.ok) {
      console.error("Supabase error:", await response.text());
      return;
    }

    console.log("Play data saved!");
  } catch (error) {
    console.error("Save error:", error);
  }
}
