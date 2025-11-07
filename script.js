
function updateLeaderboards() {
  console.log('hi');
  document.querySelectorAll(".game-card").forEach(card => {
    const leaderboardUrl = card.dataset.leaderboard;
    console.log("Processing card:", card.querySelector("h4").textContent, leaderboardUrl);

    if (!leaderboardUrl) return;
    console.log('hi55');

    fetch(leaderboardUrl) // use the actual data-leaderboard path
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(text => {
        const lines = text.trim().split("\n").slice(0, 5);
        const ol = card.querySelector(".leaderboard-list");
        ol.innerHTML = "";
        lines.forEach(line => {
          let [name, points] = line.split(",");
          let li = document.createElement("li");
          if(name == undefined || points == undefined){
            name = "No one yet!";
            points = "None"
          }
          li.textContent = `${name} - ${points}`;
          ol.appendChild(li);
        });
      })
      .catch(err => {
        console.error("Failed to load leaderboard:", err);
      });
  });
}

// Simple fade-in animation for cards
document.addEventListener("DOMContentLoaded", () => {
  console.log('hi22')

  const cards = document.querySelectorAll(".game-card");
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }, i * 150);
  });
  updateLeaderboards();
  console.log('hi33')
  setInterval(updateLeaderboards, 5000);

});

// Enable all Play buttons
document.querySelectorAll(".play-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    const card = btn.closest(".game-card");
    const usernameInput = card.querySelector(".username");
    const username = usernameInput.value.trim();
    if (!username) {
      alert("Please enter a username!");
      return;
    }
    const link = btn.dataset.link;
    window.location.href = link + "?username=" + encodeURIComponent(username);
  });
});



