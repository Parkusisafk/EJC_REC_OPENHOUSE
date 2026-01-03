// To prevent intro animation error?
if(window.location.href.includes("#")){
    window.location.href='./logo.html'
    // let hashed=window.location.hash
    // history.replaceState(null, "", window.location.pathname + window.location.search);
    // setTimeout(()=>{window.location.hash=hashed;console.log("hi")},5000)
}
setTimeout(function () {window.scrollTo(0, 0);},2);
let descriptions={
'a':"Hi I'm Astin \(°v°)/",
'c':`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Ng Shu Yang</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&display=swap');

* {
margin: 0;
padding: 0;
box-sizing: border-box;
}

body {
font-family: 'Space Grotesk', sans-serif;
min-height: 100vh;
background: radial-gradient(circle at top, #111 0%, #050505 60%);
display: flex;
align-items: center;
justify-content: center;
color: #eaeaea;
letter-spacing: 0.3px;
}

.card {
background: rgba(15, 15, 15, 0.85);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 24px;
padding: 48px 52px;
max-width: 440px;
text-align: center;
box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
animation: fadeUp 1.2s ease forwards;
}

h1 {
font-size: 2.4rem;
font-weight: 700;
margin-bottom: 10px;
background: linear-gradient(90deg, #ffffff, #9ca3af);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
}

.subtitle {
font-size: 0.85rem;
text-transform: uppercase;
letter-spacing: 2px;
color: #9ca3af;
margin-bottom: 26px;
}

.interests {
font-size: 0.95rem;
line-height: 1.7;
color: #d1d5db;
margin-bottom: 30px;
}

.motto {
font-style: italic;
font-size: 0.9rem;
color: #b5b5b5;
margin-bottom: 34px;
}

a {
display: inline-block;
text-decoration: none;
color: #ffffff;
border: 1px solid rgba(255, 255, 255, 0.25);
padding: 12px 26px;
border-radius: 999px;
font-size: 0.8rem;
letter-spacing: 1px;
text-transform: uppercase;
transition: all 0.3s ease;
}

a:hover {
background: #ffffff;
color: #000000;
transform: translateY(-3px);
}

@keyframes fadeUp {
from {
opacity: 0;
transform: translateY(24px);
}
to {
opacity: 1;
transform: translateY(0);
}
}
</style>
</head>
<body>
<div class="card">
<h1 id="name"></h1>
<div class="subtitle">Robotics President</div>

<div class="interests">
I enjoy <strong>fashion</strong>, <strong>frisbee</strong>, and <strong>programming</strong> —
where creativity meets motion and logic.
</div>

<div class="motto">“To not let death find me dead.”</div>

<a href="https://www.instagram.com/the_delusionaldwonie?igsh=MWdvM2E1bm9ybnlwbw%3D%3D&utm_source=qr" target="_blank">
Instagram
</a>
</div>

<script>
const nameText = "Ng Shu Yang";
const nameEl = document.getElementById("name");
let index = 0;

function typeName() {
if (index < nameText.length) {
nameEl.textContent += nameText[index];
index++;
setTimeout(typeName, 70);
}
}

typeName();
</script>
</body>
</html>">`,
'd':`Caleb Kow<br>
i love ctfs and ctfs love me`,
'e':`xing rui
<br>- fav colour is dark blue! 💙
<br>- i love building car/f1/motorcycle lego 🏎️
<br>- used to code discord bots using custom programming languages 🥳
<br>- learnt c++, html, python and more before but forgot mostly...🤣
<br>- plays valorant with friends for fun only (non competitively) 😝`,
'f':`Lie Huan Teng
<br>
Rookie in any form of code (here for the vibes)`,
'g':`Zhang Di is a random guy in REC`,
'h':`I'm Zanden, a training IC! Some of my hobbies include birding and rhythm gaming :) i love ducks`,
'i':`<h1>Hong Xi</h1>
<ul>
    <li>Programmes in Python, BASH, C++ and HTML CSS Javascript (I made this page!)</li>
    <li>Plays piano 🎹 (Grade 7)</li>
    <li>Likes platformer games like Dadish, Level Devil, Small Square Big Tower</li>
    <li>Plays Minecraft ⛏</li>
    <a href="https://github.com/THXatGIT"> My GitHub :D</a>
    <br>
    <a href="https://scratch.mit.edu/users/THXScratch/"> My Scratch account :D</a>
</ul>`,
'j':`Anything can la<br>
Michael S`,
'k': "Keryn",
'l':`Yuhao Chang <br>i do ctfs. i love cryptography. can also do a bit of pwn :))`,
'm':`Just the short description below :)
<br>
***
<br>
Hi, my name is Michael. Nice to meet you!`,
'n':`hello i'm Yu Chen and i have a bit of Python and HTML/CSS knowledge, and some robotics background`,
'o':`Wei En`,
'p':`Shu En
<br>- Into legos and robotics 🤖
<br>- Likes crocheting 🧶
<br>- Enjoys playing the piano 🎹`,
'q':`<b>Quan Zhou</b>  
<small>I like meeting new people</small>`,
'r':`Bingguo
<br>
Description: can’t code but he likes Lego and robotics and planes too, I love what REC has to offer!`,
's':`Zhouyi
<br>Likes my coffee black☕️
<br>Collects daiso $2 legos
<br>Likes playing with EV3
<br>A HELMer`,
't':`<!DOCTYPE html>
<head>
<link rel="stylesheet" href="style.css">
</head>
<body>
<h1>Giselle</h1>

<ul>
<li>Likes drawing fanart (digital art main!!!)</li>
<li>Obsessed with Deltarune and Undertale</li>
<li>Also in other fandoms like Touhou Project, Animation VS, Shovel Knight, Rayman and Vocaloid</li>
<li>Tried out animating on flipaclip but failed miserably :"D</li>
</ul>

<img src="https://tinyurl.com/45js4zh4" alt="yippee" width="500">

</body>
</html>
<style>
@font-face {
font-family: "8BitOperator";
src: src: url('https://static.wfonts.com/data/2015/12/15/8bitoperator/8bitoperator.ttf') format('ttf'),
url("https://static.wfonts.com/data/2015/12/15/8bitoperator/8bitoperator.woff") format("woff");
font-weight: normal;
font-style: normal;
}

body {
background-color: #0a0a0a;
color: #8cdebe;
font-family: "8BitOperator", monospace;
padding: 24px;
}

h1 {
font-family: "8BitOperator", sans-serif;
font-size: 36px;
}

li {
font-family: "8bitOperator", sans-serif;
font-size: 18px;
margin-bottom: 6px;
}
</style>`,
'u':`Cheng Min`,
'w':`Hi I'm Wilson, just a chill guy`,
'x':"Jimmy",
'y':"yuhe",
'z':`i dont know how to put my name in so just help me, im leyang btw
<ul>
<li>Doesn't really know programming but knows basic python (and likes programming)</li>
<li>Loves playing PC games but has only really played free games</li>
<li>Likes watching esports</li>
</ul>`
}
let description=document.getElementById("description")
for (let i of document.getElementsByClassName("container")[0].children){
    i.classList.add("glow")
    // set to target div inside child
    let c= document.createElement('div')
    c.addEventListener('click',()=>{
        i.scrollIntoView();
        window.location.hash=`#${i.id}`; 
        i.classList.toggle(`${i.id}`);
        document.body.classList.toggle('scrolldisable')
        // Describes person
        sandbox=document.getElementById("descsandbox")
        sandbox.srcdoc=descriptions[`${i.id}`]+`<style> body{color:white;}</style>`
        description.classList.toggle('show')
    }
)
i.appendChild(c)
}
document.getElementById("reclogo").addEventListener('click',()=>{
    document.body.classList.toggle('redirect')
    setTimeout(()=>{window.location.href='https://sites.google.com/ejc.edu.sg/ejc-rec/'},3500)
    
})
document.getElementById("aboutus").addEventListener('click',()=>{
    document.body.classList.toggle('redirect')
    setTimeout(()=>{window.location.href='./index.html'},3500)
    
})
document.getElementById("CP").addEventListener('click',()=>{
    document.body.classList.toggle('redirect')
    setTimeout(()=>{window.location.href='https://sites.google.com/ejc.edu.sg/ejc-rec/curriculum'},3500)
    
})
document.getElementById("CTF").addEventListener('click',()=>{
    document.body.classList.toggle('redirect')
    setTimeout(()=>{window.location.href='https://sites.google.com/ejc.edu.sg/ejc-rec/eventscomps'},3500)
    
})
document.getElementById("robotics").addEventListener('click',()=>{
    document.body.classList.toggle('redirect')
    setTimeout(()=>{window.location.href='https://sites.google.com/ejc.edu.sg/ejc-rec/via'},3500)
    
})