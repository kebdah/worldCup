const token = "86cf26733e9f47de9cb5350f452ef7d7";
const todayDate = new Date();
const dashedDate =
  todayDate.getFullYear() +
  "-" +
  (todayDate.getMonth() + 1) +
  "-" +
  todayDate.getDate();
let baseUrl = "https://proxy.cors.sh/https://api.football-data.org/v4";

let sections = document.querySelectorAll("section");
let menu = document.querySelectorAll(".header ul li");

let menulist = Array.from(menu);

menu.forEach((e) => {
  e.addEventListener("click", (e) => {
    let clicked = e.target;

    menu.forEach((ele) => {
      ele.classList.remove("active");
    });
    clicked.classList.add("active");

    sections.forEach((sec) => {
      // console.log(clicked.dataset.label ,sec.classList[0])
      if (clicked.dataset.label === sec.classList[0]) {
        sec.classList.add("show");
      } else {
        sec.classList.remove("show");
      }
    });
  });
});

function getgroups() {
  const url = `${baseUrl}/competitions/2000/standings`;
  axios
    .get(url, {
      headers: { "X-Auth-Token": `${token}` },
    })
    .then((response) => {
      const standings = response.data.standings;
      for (let i = 0; i <= 7; i++) {
        // console.log(standings[`${i}`].table)
        let theGroup = document.querySelectorAll(".singleGroup")[i];
        let teamsH = theGroup.querySelectorAll(".teams ul");
        for (let j = 0; j < 4; j++) {
          let nums = standings[`${i}`].table[`${j}`];
          // console.log(nums)
          let statsH = teamsH[j].children;
          statsH[0].firstChild.setAttribute("src", nums.team.crest);
          statsH[1].innerHTML = nums.team.name;
          statsH[2].innerHTML = nums.won;
          statsH[3].innerHTML = nums.lost;
          statsH[4].innerHTML = nums.goalDifference;
          statsH[5].innerHTML = nums.points;
        }
      }
    });
}

function getmatches() {
  const url = `${baseUrl}/competitions/2000/matches`;
  axios
    .get(url, {
      headers: { "X-Auth-Token": `${token}` },
    })
    .then((response) => {
      const matches = response.data.matches;
      const todayMatches = document.querySelector(".today-matches .container");
      let match;
      for (match of matches) {
        let date = new Date(match.utcDate);
        let md = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`;
        function formatAMPM(date) {
          var hours = date.getHours();
          var minutes = date.getMinutes();
          var ampm = hours >= 12 ? "pm" : "am";
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          minutes = minutes < 10 ? "0" + minutes : minutes;
          var strTime = hours + ":" + minutes + " " + ampm;
          return strTime;
        }
        let mt = formatAMPM(date);

        if (dashedDate == md) {
          // console.log(date)
          // let meccaTime = date.toLocaleString("UTC", {
          //   // hour12: false,
          //   year: "numeric",
          //   month: "2-digit",
          //   day: "2-digit",
          //   hour: "2-digit",
          //   minute: "2-digit",
          // });
          // let htmlDate = `${meccaTime.getFullYear()}`;
          // console.log(htmlDate)
          let content = `
          <div class="row">
            <div class="bar my-3">
              <div class="col-3">
                <div class="home">
                    <img src=${match.homeTeam.crest} alt="" />
                    <p>${match.homeTeam.name}</p> 
                </div>
              </div>
              <div class="col-6">
                <div class="info">
                    <div class="ws">${match.score.fullTime.away ?? "-"}</div>
                    <div class="hs">${match.score.fullTime.home ?? "-"}</div>

                    <div class="${
                      match.status === "IN_PLAY" ? "live" : "LIVE"
                    }">${
            match.status === "FINISHED"
              ? "FINISHED"
              : match.status === "TIMED"
              ? "TIMED"
              : "LIVE"
          }</div>
                    <div class="x">x</div>
                    <div class="date">${md}</div>
                    <div class="time">${mt}</div>
                </div>
              </div>
              <div class="col-3">
                <div class="away">
                    <img src=${match.awayTeam.crest} alt="" />
                    <p>${match.awayTeam.name}</p>
                </div>
              </div>
            </div>
          </div>`;
          // console.log(match)
          todayMatches.innerHTML += content;
        }
      }
    });
}

function getscorers() {
  const url = `${baseUrl}/competitions/2000/scorers`;
  axios
    .get(url, {
      headers: { "X-Auth-Token": `${token}` },
    })
    .then((response) => {
      // console.log(response.data)
      const scorers = response.data.scorers;
      const topScorers = document.querySelector(".top-scorers .container .row");
      let scorer;
      for (scorer of scorers) {
        // console.log(scorer)
        let content = `
          <div class="col-12 d-flex justify-content-around my-2 rounded">
          <img src="${scorer.team.crest}" alt=""><span>${scorer.player.name}</span> <span>goals: ${scorer.goals}</span>
          </div>
          `;
        topScorers.innerHTML += content;
      }
    });
}
function getknockout() {
  const url = `${baseUrl}/competitions/2000/matches`;
  axios
    .get(url, {
      headers: { "X-Auth-Token": `${token}` },
    })
    .then((response) => {
      const matches = response.data.matches;

      for (let i = 48; i < 64; i++) {
        let num =
          matches[`${i}`].stage === "LAST_16"
            ? 16
            : matches[`${i}`].stage === "QUARTER_FINALS"
            ? 8
            : matches[`${i}`].stage === "SEMI_FINALS"
            ? 4
            : matches[`${i}`].stage === "FINAL"
            ? 2
            : "";
        if (num === "") {
          continue;
        }

        const knimgcont = document.querySelector(
          `.knockout .container .c${num}`
        );
        // console.log(knimgcont)

        let mtDate = matches[`${i}`].utcDate;
        let sss = mtDate.toString();
        let MD = sss.slice(0, 10);
        let date = new Date(matches[`${i}`].utcDate);
        let meccaTime = date.toLocaleString("UTC", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        let htmlDate = `${meccaTime}`;
        let team = `
            <div class="knmt my-3 part-${32 / +num} bar row">
              <div class="col-6">
                <div class="home me-3">
                    <img src=${matches[`${i}`].homeTeam.crest} alt="" />
                    <p>${matches[`${i}`].homeTeam.tla}</p> 
                </div>
              </div>

              
              
              <div class="col-6">
                <div class="away ms-3">
                    <img src=${matches[`${i}`].awayTeam.crest} alt="" />
                    <p>${matches[`${i}`].awayTeam.tla}</p>
                </div>
              </div>
              <div class="col-12">
                <div class="info">
                <div class="score" style="display: flex; padding: 2px; justify-content: space-around;"   >
                <div class="ws">${
                  matches[`${i}`].score.fullTime.home ?? "-"
                }</div>

                <div class="hs">${
                  matches[`${i}`].score.fullTime.away ?? "-"
                }</div>
              </div>
                    

                    <div class="${
                      matches[`${i}`].status === "IN_PLAY" ? "live" : "LIVE"
                    } mt-1">${
          matches[`${i}`].status === "FINISHED"
            ? "FINISHED"
            : matches[`${i}`].status === "TIMED"
            ? "TIMED"
            : "LIVE"
        }</div>
                    <div class="x">x</div>
                    <div class="date">${htmlDate.slice(0, 10)}</div>
                    <div class="time">${htmlDate.slice(12)}</div>
                </div>
              </div>
              
            </div>
          `;
        knimgcont.innerHTML += team;
        if (num === 2) {
          let winner = document.querySelector(".winner");
          winner.innerHTML = matches[`${i}`].score.winner || "champion";
        }
      }
    });
}

function minigames() {
  let list = document.querySelectorAll(".mini-games ul li");
  let games = document.querySelectorAll(".mini-games .staduim >div");
  let wherediv = document.querySelector(".where")

  
  // functions games
  function where() {
    let messi = document.querySelector(".where .messi img");
    messi.classList.remove("dead")
    // let ml = 0
    // const mt = 100
    let hor = 10
    let vir = 10
    function formatAsPercent(num) {
      return new Intl.NumberFormat('default', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num / 100);
    }

    let move = setInterval(() => {
      let lr = Math.floor(Math.random()* 2)
      let tb = Math.floor(Math.random()* 2)
      
      console.log(lr, hor)
      if (lr && hor !== 90) {
        hor += 10
        messi.style.left = formatAsPercent(hor)
        console.log(messi.style.left , formatAsPercent(hor))

      }

      else if (!lr && hor !==0) {
        hor -= 10
        messi.style.left = formatAsPercent(hor)

      }


      if (tb && vir !== 90) {
        vir += 10
        messi.style.top = formatAsPercent(vir)

      }

      else if (!tb && vir !==0) {
        vir -= 10
        messi.style.top = formatAsPercent(vir)

      }


    }, 300);

    messi.onclick = () =>{

      clearInterval(move)
      messi.classList.add("dead")

    }

    
  }

  function head () {

    let hair = document.querySelectorAll(".head img")
    let len = 100
    let tp = 41
    console.log(hair[1])
    hair[1].onclick = () => {
      len += 30
      tp += 1
      hair[1].style.cssText = `transform: scaleY(${len}%);`


    }

  }
  // end functions games
  list.forEach((e) => {
    e.addEventListener("click", (e) => {
      let clicked = e.target;
      games.forEach((e) => {
        if (clicked.dataset.game === e.classList[0]) {
          e.classList.add("show");
          let fun = `${clicked.dataset.game}`
          if (fun === "where"){
            where()
          }
          else if (fun === "head") {
            head()
          }
        } else {
          e.classList.remove("show");
        }
      });
    });
  });
}

getgroups();
getmatches();
getscorers();
getknockout();
minigames();
