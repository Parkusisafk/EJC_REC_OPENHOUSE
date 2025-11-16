// Timer I guess..
let start= new Date()
// text="🪓crazy? I was crazy once. Stuck in a white room. A rubber room. There were mice everywhere. They are driving me crazy. Crazy? ..."
text=`👾⛓👎👎😶😠❌👾🪓 <###>.
💔🤬☠👎 🩼🚫🤫 👎☠👎⛓ 🔥👎🗯😶 ... 💥⛓🤬🪦🩼? 😠 💀🤬🪓 💥⛓🤬🪦🩼 🚫❌💥👎. 🪓😶🤫💥😵 😠❌ 🤬 ⛓🚫🚫🎭, 🎭🚫☠😠❌👾 🎭🩼 🎭🚫🤫🪓👎, 🔥😠❌🧨😠❌👾 😶💔👎 🪤⛓🚫💣🗯👎🎭. 😠😶 💀🤬🪓 🧨⛓😠☠😠❌👾 🎭👎 💥⛓🤬🪦🩼... 💣🤫😶 😠😶 🔥👎🗯😶 🔥🤫🔥😠🗯🗯😠❌👾 🤬🪓 🤬 ⛓🤫🪓💔 🚫🔥 👎❌🧨🚫⛓🪤💔😠❌🪓 🔥🗯🚫🚫🧨👎🧨 🎭🩼 🎭😠❌🧨 🤫🪤🚫❌ 🔥😠❌🧨😠❌👾 🤬❌🧨 🪓🚫🗯☠😠❌👾 😶💔👎 💣🤫👾. 

🩼🚫🤫 😶🚫🚫 💥🤬❌ 👎🔫🪤👎⛓😠👎❌💥👎 😶💔🤬😶 💣🩼 😡🚫😠❌😠❌👾 😶💔👎 ⛓👎💥 - ⛓🚫💣🚫😶😠💥🪓 👎❌👾😠❌👎👎⛓😠❌👾 🤬❌🧨 💥🚫🎭🪤🤫😶😠❌👾 💥🗯🤫💣.

👎🔫🪤👎⛓😠👎❌💥👎 😶💔👎 😶💔⛓😠🗯🗯 🚫🔥 💥🤬🪤😶🤫⛓👎 😶💔👎 🔥🗯🤬👾 (💥😶🔥), ⛓😠👾🚫🤫⛓ 🚫🔥 💥🚫🎭🪤👎😶😠😶😠☠👎 🪤⛓🚫👾⛓🤬🎭🎭😠❌👾 🤬❌🧨 ⛓🚫💣🚫😶😠💥🪓 💣🩼 💥💔🚫🚫🪓😠❌👾 😶💔😠🪓 💥💥🤬.

😠❌😶👎⛓☠😠👎💀🪓 🤬❌🧨 💥🚫❌🧨😠😶😠🚫❌🪓 🤬🪤🪤🗯🩼.

🚫💔 🩼👎🤬💔, 😶💔👎 🔥🗯🤬👾. 💔👎⛓👎 😠😶 😠🪓 👎😡💥⛓👎💥{😠😶💀🤬🪓❌🚫😶🪓🚫💔🤬⛓🧨💀🤬🪦🪦😠😶#💥⛓🩼🪤😶🚫}`
letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
let i=0;
let currchar=0
let active=NaN
// Displays all the text
for (let c of text){
    let textbox=document.getElementById("textbox")
    let char=document.createElement("div")
    char.className=`char ${c}`
    char.id=i
    char.textContent=c
    char.addEventListener('click', function(e) {
        let follower = document.getElementById('decryptor');
        follower.style.left=char.getBoundingClientRect().x+30+300<window.innerWidth ? char.getBoundingClientRect().x+30+'px': char.getBoundingClientRect().x-30-300+'px'
        follower.style.top=char.getBoundingClientRect().y+300<window.innerHeight ? char.getBoundingClientRect().y+'px': char.getBoundingClientRect().y-300+'px'
        follower.style.display= follower.style.display=='none' || currchar != char.id ? 'grid' : 'none'
        document.getElementById(currchar).style.backgroundColor="black"
        char.style.backgroundColor=currchar==char.id?"black":"white"
        currchar=char.id
    });
    textbox.appendChild(char)
    i++
}
// Deals with decryption
for(let l of letters){
    let decryptor= document.getElementById('decryptor');
    let transtable=document.createElement("div")
    transtable.textContent=`${l} => ?`
    transtable.addEventListener('click',()=>{
        ctc=document.getElementById(currchar).classList[1];
        if (!['.',',','<','>','?','(',')','{','}','#','-'].includes(ctc)){
        charlist=document.getElementsByClassName(ctc)
        for (let c of charlist){
            c.textContent=transtable.textContent[0]
            c.classList.toggle("hover")
            setTimeout(() => {
                c.classList.toggle("hover")
            }, 100);
        }
        for(let t of document.getElementById('decryptor').getElementsByTagName('div')){
            if(t.textContent.includes(ctc)){
                t.textContent=t.textContent[0] +' => ?'
                t.classList.toggle("disabled")
            }
        }
        transtable.textContent=`${l} => ${ctc}`
        transtable.classList.toggle("disabled")
    }
    })
    decryptor.appendChild(transtable)
}
// The decryptor is off if click is out of bounds
document.body.addEventListener('click',(e)=>{
    let boundcheck=document.getElementById("textbox")
    if (!boundcheck.contains(e.target)){
        document.getElementById('decryptor').style.display="none"
        document.getElementById(currchar).style.backgroundColor="black"
    }  
})

document.getElementById("answer").addEventListener("keydown", (e)=>{
    if (e.key=="Enter"){
    if(document.getElementById("answer").value.toUpperCase()!="EJCREC{ITWASNOTSOHARDWAZZIT#CRYPTO}"){
        document.getElementById("answer").classList.toggle("wrongshake")
        setTimeout(() => {
                document.getElementById("answer").classList.toggle("wrongshake")
            }, 1000);
    }
    else{
        let end= new Date()
        let dt=end-start
        console.log(dt)
        document.getElementById("answer").classList.toggle("rightshake")
        setTimeout(() => {
                document.getElementById("answer").classList.toggle("rightshake")
                document.getElementById("completion").style.opacity=1
                document.getElementById("completion").style.pointerEvents="all"
                document.getElementById("completion").style.top="10%"
                document.getElementById("time").textContent=`${(dt-dt%60000)/60000}min ${(dt%60000-dt%1000)/1000}sec ${dt%1000}ms`
            }, 1000);
    let name = new URLSearchParams(window.location.search)
    fetch("/update-leaderboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: name.get("username"),
      score: `${(dt-dt%60000)/60000}min ${(dt%60000-dt%1000)/1000}sec ${dt%1000}ms`,
      gameType: "crypto" // adjust depending on game
    })
  }).then(res => res.json())
    .then(data => console.log("Leaderboard updated:", data))
    .catch(err => console.error("Failed to update leaderboard:", err));
    }
}
})