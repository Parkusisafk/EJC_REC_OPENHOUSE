

// display username in scoreboard
const usernameEl = document.getElementById("usernameDisplay");
if(usernameEl) usernameEl.textContent = username;

const WORDS = [
  "while","return","function","class","import","export",
  "if","else","for","const","let","true","false","switch",
  "case","break","continue","try","catch","async","await",
  "new","delete","typeof","this","object","array",
  "string","number","boolean","prototype","int","long",
  "database","main","python","java","javascript","compiler",
  "linux","commandline",
  "pointer","memory","character","null","void","NaN","undefined",
  "github","server","byte","bit","quadword","shell","exploit",
  "error","timeout","debugging","decompile",
  "compression","input","output","buffer","stackoverflow",
  "gitlab","gitpush","ipaddress","DNS","http","https",
  "port","request","response","header",
  "footer","hash","cryptography","packets","automation"
];

const MAX_BUBBLES = 5;
const BUBBLE_SIZE = 120; // px (matches CSS var)
let bubbles = [];        // active bubble DOM nodes
let focusedBubble = null; // stage 2 target
let candidateBuffer = ""; // stage 1 typed buffer
let score = 0;
let running = true;
let rafId = null;

let timeElapsed = 0; // seconds
const timeEl = document.createElement("div");
timeEl.className = "row time";
timeEl.innerHTML = `Time: <span id="timeElapsed">0.0s</span>`;
document.querySelector(".top-bar").appendChild(timeEl);

function updateBubbleFont(b) {
  const span = b.querySelector(".word");
  const maxWidth = BUBBLE_SIZE * 0.8; // leave padding
  span.style.fontSize = "20px";        // base font size

  // dynamically shrink if too wide
  while (span.offsetWidth > maxWidth - 20 && parseInt(span.style.fontSize) > 1) {
    span.style.fontSize = parseInt(span.style.fontSize) - 1 + "px";
  }
}
// find ground position: if you have a .ground element, use its top; else fall back to viewport
function getGroundY() {
  const g = document.querySelector(".ground");
  if (g) return g.getBoundingClientRect().top - 50; // top of the spikes image
  return window.innerHeight; // fallback
}


// ensure scoreboard exists (create if missing)


const scoreEl = document.getElementById("score");

// helper: spawn unique word (avoid duplicates on screen)
function pickUniqueWord() {
  const used = new Set(bubbles.map(b => b.word));
  const avail = WORDS.filter(w => !used.has(w));
  return avail.length ? avail[Math.floor(Math.random() * avail.length)]
                      : WORDS[Math.floor(Math.random() * WORDS.length)];
}

function getNonOverlappingX() {
  const minGap = 20; // horizontal spacing between bubbles (px)
  const maxAttempts = 50;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const x = Math.random() * (window.innerWidth - BUBBLE_SIZE);
    let ok = true;

    for (const other of bubbles) {
      const otherX = parseFloat(other.style.left || 0);

      // check horizontal distance
      if (Math.abs(x - otherX) < BUBBLE_SIZE + minGap) {
        ok = false;
        break;
      }
    }

    if (ok) return x;
  }

  // fallback: just random if can't find space
  return Math.random() * (window.innerWidth - BUBBLE_SIZE);
}

// create bubble DOM
function createBubble(word) {
  const b = document.createElement("div");
  b.className = "bubble";
  b.word = word;
  b.progress = 0;        // number of chars highlighted
  b.speed = 1 + Math.random() * 1.6; // px per frame-ish (we'll scale with a delta)
  b.style.left = getNonOverlappingX() + "px";
  b.style.top = -BUBBLE_SIZE + "px"; // start above screen slightly

  // fire ring overlay
  const ring = document.createElement("div");
  ring.className = "fire-ring";
  b.appendChild(ring);

  // word text
  const span = document.createElement("div");
  span.className = "word";
  span.textContent = word;
  b.appendChild(span);
  document.body.appendChild(b);
  bubbles.push(b);
  renderBubble(b);
    requestAnimationFrame(() => updateBubbleFont(b));

  return b;
}

// spawn until count reaches MAX_BUBBLES
function fillBubbles() {
  while (bubbles.length < MAX_BUBBLES) {
    spawnBubble();
  }
}


function spawnBubble() {
  const w = pickUniqueWord();
  createBubble(w);
}
function stimulateTyping() {
  // simulate empty candidateBuffer to trigger rendering
  candidateBuffer = "";
  const candidates = [];
  for (const b of bubbles) {
    // no buffer typed yet, so dehighlight everything
    b.progress = 0;
    renderBubble(b);
  }
}

// render highlight for a bubble (yellow bold for progress, rest white)
function renderBubble(b) {
  const span = b.querySelector(".word");
  const p = b.progress || 0;
  const w = b.word;

  if (p > 0) {
    const head = escapeHtml(w.slice(0, p));
    const tail = escapeHtml(w.slice(p));
    span.innerHTML = `<span style="color:red;font-weight:700">${head}</span><span style="color:black">${tail}</span>`;
  } else {
    span.textContent = w;
    span.style.color = "black";
  }

  // **always update font after DOM paint**
  requestAnimationFrame(() => updateBubbleFont(b));
}

// small escape to be safe (words are simple, but habit)
function escapeHtml(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
window.addEventListener('wheel', e => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });

window.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0')) {
    e.preventDefault();
  }
});

// main animation loop - moves bubbles down based on delta time so speed is consistent
let lastTime = performance.now();
function loop(now) {
  if (!running) return;

  const dt = (now - lastTime) / 16.6667; // scale by frame time
  const dtSeconds = dt * 16.6667 / 1000; // convert dt to seconds
    timeElapsed += dtSeconds;
    document.getElementById("timeElapsed").textContent = timeElapsed.toFixed(1) + "s";

  lastTime = now;


  const groundY = getGroundY(); // bottom of screen or ground element

  bubbles.forEach((b) => {
    // skip bubbles that are popping
    if (b.classList.contains("pop")) return;

    // move bubble down
    const top = parseFloat(b.style.top || 0);
    let scaledSpeed = b.speed * (Math.pow(Math.max(timeElapsed, 1) + 1, 0.15) - 0.6);
    if(timeElapsed > 30) scaledSpeed = Math.pow(scaledSpeed,Math.pow(Math.log10(timeElapsed),0.3))
    const dy = scaledSpeed * dt;
    const newTop = top + dy;
    b.style.top = newTop + "px";

    // check if bottom of bubble hits ground
    const bottom = newTop + BUBBLE_SIZE;
    if (bottom >= groundY) {
    // spawn explosion at bubble center
    const exp = document.createElement("img");
    exp.src = "explosion.png";
    exp.className = "explosion";
    // place at bubble center
    const left = parseFloat(b.style.left || 0) + BUBBLE_SIZE / 2;
    const top = parseFloat(b.style.top || 0) + BUBBLE_SIZE / 2;
    exp.style.left = left + "px";
    exp.style.top = top + "px";
    document.body.appendChild(exp);
    //exp.addEventListener("animationend", () => exp.remove(), { once: true });

    // then end game
    endGame();
    return;
}
  });

  // ensure we always have MAX_BUBBLES
  fillBubbles();

  // next frame
  rafId = requestAnimationFrame(loop);
}


// keyboard handling
document.addEventListener("keydown", (e) => {
  if (!running) return;

  const key = e.key;
  if (key.length !== 1) {
    // ignore meta keys, Enter, Tab, etc.
    if (key === "Backspace") e.preventDefault();
    return;
  }

  // prevent spaces (you didn't want them)
  if (key === " ") return;

  // STAGE 2: focused bubble exists
  if (focusedBubble) {
    const b = focusedBubble;

    // ignore if bubble got removed for any reason
    if (!document.body.contains(b)) {
      focusedBubble = null;
      candidateBuffer = "";
      return;
    }

    const expected = b.word[b.progress] || null;
    if (expected === key) {
      b.progress++;
      renderBubble(b);

      // leted
      if (b.progress >= b.word.length) {
        // increment score immediately
        score += 1;
        scoreEl.textContent = score;

        // remove 'active' class immediately so ring disappears for others
        b.classList.remove("active");

        // trigger pop animation for bubble (keeps position)
        b.classList.add("pop");

        // when animation ends remove element and cleanup
        b.addEventListener("animationend", function onPop() {
          b.removeEventListener("animationend", onPop);
          // remove from DOM & bubbles array
          if (b.parentElement) b.parentElement.removeChild(b);
          bubbles = bubbles.filter(x => x !== b);
          // spawn replacement
          spawnBubble();
        }, { once: true });

        // clear focus + buffer
        focusedBubble = null;
        candidateBuffer = "";
        // ensure other bubble progress is reset (they were candidates before)
        bubbles.forEach(bb => { if (bb !== b) { bb.progress = 0; renderBubble(bb); } });

        return
      }
      renderBubble(b);
    } else {
      // wrong key for focused bubble -> ignore (spec requirement)
      return;
    }
    return;
  }

  // STAGE 1: candidate elimination using candidateBuffer
  candidateBuffer += key;

  // find candidates that start with candidateBuffer
  const candidates = [];
  for (const b of bubbles) {
    if (b.word.startsWith(candidateBuffer)) {
      // set progress to buffer length
      b.progress = candidateBuffer.length;
      candidates.push(b);
    } else {
      // dehighlight if mismatch
      if (b.progress !== 0) {
        b.progress = 0;
      }
    }
    renderBubble(b);
  }

  if (candidates.length === 1) {
    // lock onto the single candidate
    focusedBubble = candidates[0];
    // mark active class only on focused
    bubbles.forEach(bb => bb.classList.remove("active"));
    focusedBubble.classList.add("active");
  } else if (candidates.length === 0) {
    // no match: reset buffer and progress
    candidateBuffer = "";
    bubbles.forEach(b => { b.progress = 0; renderBubble(b); });
  } else {
    // more than one candidate: don't set .active on any bubble
    bubbles.forEach(bb => bb.classList.remove("active"));
  }
});

// end game handler
function endGame() {
  if (!running) return;
  running = false;
  if (rafId) cancelAnimationFrame(rafId);

  const username = document.getElementById("playerName").textContent || "Player";

  // show panel
  let panel = document.getElementById("game-over");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "game-over";
    panel.innerHTML = `
      <h2>💥 Game Over</h2>
      <p>Player: <strong>${username}</strong></p>
      <p>Score: <span id="final-score">${score}</span></p>
      <div class="button-row">
        <a href="../../index.html" class="back-btn">← Back to Menu</a>
        <button id="restart-btn" class="restart-btn">Restart ↻</button>
      </div>
    `;
    document.body.appendChild(panel);
  } else {
    panel.querySelector("#final-score").textContent = score;
  }
  panel.style.display = "block";

    panel.style.display = "block";

  // restart button
  const btn = panel.querySelector("#restart-btn");
  btn.onclick = () => {
    // reload the page but retain username
    window.location.reload();
  };

  // send score to backend
  console.log('hi')
  fetch("/update-leaderboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      score: score,
      gameType: "typing" // adjust depending on game
    })
  }).then(res => res.json())
    .then(data => console.log("Leaderboard updated:", data))
    .catch(err => console.error("Failed to update leaderboard:", err));
}


// initial setup
function startGame() {
  // reset state
  bubbles = [];
  focusedBubble = null;
  candidateBuffer = "";
  score = 0;
  running = true;
  lastTime = performance.now();
  scoreEl.textContent = score;

  // remove any existing game-over panel
  const existingPanel = document.getElementById("game-over");
  if (existingPanel) existingPanel.remove();

  // spawn initial bubbles
  for (let i = 0; i < MAX_BUBBLES; i++) spawnBubble();
  requestAnimationFrame(() => stimulateTyping());
    //stimulateTyping();
  // start loop
  rafId = requestAnimationFrame(loop);
}

// helper: remove all bubbles (used if needed)
function clearBubbles() {
  for (const b of bubbles) {
    if (b.parentElement) b.parentElement.removeChild(b);
  }
  bubbles = [];
}

// Get username from query string
// Fill username from query string
function getUsername() {
  const params = new URLSearchParams(window.location.search);
  return params.get('username') || "Player";
}

window.addEventListener("load", () => {
  const name = getUsername();
  document.getElementById("playerName").textContent = name;

  startGame(); // start your bubble typing game
});
