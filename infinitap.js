window.onload = function () {
    let motivation = [
        "You're doing great",
        "Good Job",
        "Nice Work",
        "Unstoppable",
        "Epic",
        "Awesome",
        "Keep Going",
        "Keep Going",
        "Hurray!",
        "Unleash the beast",
        "Alright",
        "You rock!",
        "You killing it",
        "Don't get tired",
        "Forever",
        "Keep moving",
        "Just Do It",
        "Just a click away",
        "That was fun",
        "Never settle for less",
        "You're a winner",
        "You're not a quitter",
        "Quitters never win",
        "Winners never quit",
    ];
    let emoji = [
        "😀",
        "😃",
        "😄",
        "😁",
        "🤩",
        "😍",
        "🙃",
        "😉",
        "😜",
        "🤔",
        "😎",
        "🤯",
        "🥳",
        "😮",
        "👨‍💻",
        "💃",
        "🕺",
        "🤓",
        "🥂",
        "🔥",
        "✨",
    ];
    const quote = document.querySelector(".show-quote");
    const badge = document.getElementsByClassName("notification")[0];
    const gameButton = document.getElementsByClassName("game-btn")[0];
    // const navButtonHtml = `<span class="nav-btn"> &#8962;</span>`;
    const navButton = document.getElementsByClassName("nav-btn")[0];
    const homeButtons = document.getElementsByClassName("home-btn");
    const backButtonHtml = `<div class="back"><span class="back-btn"><i class="fas fa-long-arrow-alt-left"></i></span></div>`;
    const backButton = document.getElementsByClassName("back-btn");
    const homePage = document.getElementsByClassName("home-page")[0];
    const allPages = document.querySelectorAll(".page:not(.home-page)");
    const level = document.getElementsByClassName("level")[0];
    let randomQuote,
        randomEmoji,
        isScoreEmpty,
        continueEnabled = false,
        levelNum = 1,
        clickNum = 0;
    let getScore,
        scoreArr = [];

    const $ = (selector) => document.querySelectorAll(selector);
    const random = (item) => Math.floor(Math.random() * item);

    const hideAllPages = () =>
        allPages.forEach((page) => {
            page.classList.contains("show")
                ? page.classList.replace("show", "hide")
                : page.classList.add("hide");
        });

    function showPage(event) {
        hideAllPages();
        let targetPage = event.currentTarget.dataset.page;
        $(`.${targetPage}`)[0].classList.replace("hide", "show");
        homePage.classList.contains("show")
            ? homePage.classList.replace("show", "hide")
            : homePage.classList.add("hide");
    }

    function goHome(event) {
        hideAllPages();
        homePage.classList.contains("hide")
            ? homePage.classList.replace("hide", "show")
            : homePage.classList.add("show");
    }
    function setTheme(event) {
        let targetTheme = event.currentTarget.classList[1];
        document.body.dataset.theme = targetTheme.split("-")[0];
    }
    function validateInput(userInput) {
        let inputs = Array.from(userInput).map((elem) => elem.value);
        if (["", null, undefined].includes(...inputs)) return;
        return inputs;
    }
    function updateGameText(checkedInput) {
        motivation.push(checkedInput[0]);
        emoji.push(checkedInput[1]);
    }
    function resetInput(checkedInput) {
        checkedInput.forEach((input) => (input.value = ""));
    }
    function userInput(userInput) {
        let validInput = validateInput(userInput);
        updateGameText(validInput);
        resetInput(userInput);
        console.log("user edits successful");
    }
    $(".submit-btn")[0].onclick = () => userInput($(".user-input"));
    // $(".submit-btn")[0].addEventListener("click",()=> userInput($(".user-input")));

    function difficulty() {
        let difficulty,
            diffLevel = $("input[name='difficulty']:checked")[0].value;
        switch (diffLevel) {
            case "easy":
                difficulty = 10;
                break;
            case "medium":
                difficulty = 25;
                break;
            case "hard":
                difficulty = 40;
                break;
            default:
                difficulty = 10;
        }
        return difficulty;
    }

    function resetGame() {
        // scoreArray.push(getScore);
        ScoreBoard(getScore);
        quote.classList.remove("quote");
        quote.innerHTML = "";
        badge.classList.remove("badge");
        gameButton.classList.remove("notify");
        badge.innerHTML = "";
        clickNum = 0;
        levelNum = 1;
        level.innerHTML = "";
    }

    function ScoreBoard(scores) {
        // empty score check
        isScoreEmpty = [null, undefined, 0].includes(scores.Clicks);
        // duplicateCheck
        let jsonScore = JSON.stringify(scores);
        let jsonArr = scoreArr.map((scores) => JSON.stringify(scores));
        if (!isScoreEmpty && !jsonArr.includes(jsonScore)) {
            scoreArr.push(scores);
        }

        //getHighScore by sorting, limit the scores to be displayed to n where n= n>1 by setting the length
        function rankScores(scoreArr) {
            let highScore = scoreArr.sort((a, b) => b.Clicks - a.Clicks);
            highScore.length = 10;
            return highScore;
        }
        //print out the contents of highscore
        function displayScore(highscore) {
            $("ol")[0].innerHTML = "";
            let scorehtml;
            highscore.forEach((score) => {
                scorehtml = `<li>Clicks: ${score.Clicks}&nbsp;&nbsp; Level: ${score.Level} </li>`;
                $("ol")[0].innerHTML += scorehtml;
            });
        }
        displayScore(rankScores(scoreArr));
    }
    function game() {
        randomQuote = random(motivation.length);
        randomEmoji = random(emoji.length);
        quote.className = "quote";
        quote.innerHTML = `${motivation[randomQuote]} <hr/> ${emoji[randomEmoji]}`;
        badge.classList.add("badge");
        gameButton.classList.add("notify");
        badge.innerHTML = ++clickNum;
        //levelling up
        function levelUp() {
            if (clickNum % difficulty() == 0) {
                ++levelNum;
                useAudio();
            }
            level.innerHTML = `Level ${levelNum}`;
        }
        levelUp();
        getScore = { Clicks: clickNum, Level: levelNum };
    }

    function useAudio() {
        let audioEnabled = $(".enable-audio")[0].checked;
        let actx = new AudioContext();
        let osc;

        function makeAudio() {
            osc = actx.createOscillator();
            osc.connect(actx.destination);
            osc.type = "square";
            osc.frequency.setValueAtTime(261.6, actx.currentTime);
            osc.detune.setValueAtTime(700, actx.currentTime + 0.1);
            osc.start(actx.currentTime);
            osc.stop(actx.currentTime + 0.2);
        }

        if (audioEnabled) makeAudio();
    }

    // init
    hideAllPages();
    $(".info").forEach((elem) =>
        elem.insertAdjacentHTML("beforeend", backButtonHtml)
    );
    [...homeButtons].forEach((elem) =>
        elem.addEventListener("click", showPage)
    );
    [...backButton].forEach((elem) => elem.addEventListener("click", goHome));

    $(".theme").forEach((elem) => elem.addEventListener("click", setTheme));
    gameButton.addEventListener("click", game);

    //game quit prompt
    navButton.addEventListener("click", quitGameDialog);
    function quitGameDialog() {
        if (clickNum) {
            let choice = confirm("Game Paused\n\nAre You Sure To Quit?");
            if (choice) {
                goHome();
                resetGame();
                updateGameOption();
            }
        } else {
            goHome();
            resetGame();
        }
    }
    //logging date in status
    function moment() {
        let date = new Date();
        return date.toUTCString();
    }
    setInterval(() => ($("#date")[0].innerHTML = moment()), 1000);

    // continue game
    function updateGameOption() {
        let continueHtml = `<div class="home-opt">
    <button class="home-btn" data-page="game-page">Continue Game</button> 
    </div>`;
        if (!isScoreEmpty && !continueEnabled) {
            $("main")[0].insertAdjacentHTML("afterbegin", continueHtml);
            continueEnabled = true;
            $(".home-btn")[0].addEventListener("click", showPage); //continue button
        }
        $(".home-btn")[1].addEventListener("click", () => {
            $("ol")[0].innerHTML = "";
            scoreArr = [];
            getScore = {};
        }); // new game button
    }
};
