onload = init;

const _ = (className) => document.getElementsByClassName(className);
const $ = (selector) => document.querySelectorAll(selector);
const random = (item) => Math.floor(Math.random() * item);

function init() {
    let isContinueEnabled = false;
    //page vars
    const homePage = _("home-page")[0];
    const homePageButtons = _("home-page__btn");
    const allPages = $(".page:not(.home-page)");
    const page = $(".page");
    const backButtonHtml = `<div class="back"><span class="back-btn"><i class="fas fa-long-arrow-alt-left"></i></span></div>`;
    const backButtons = _("back-btn");
    // settings var
    let IsStoredContinueEnabled;
    const bgTheme = _("bg-theme-ico")[0];
    const loadData = $(".load-btn")[0];
    const saveData = $(".save-btn")[0];
    //game vars
    const scoreList = _("score-list")[0];
    const gameQuote = _("game-page__show-quote")[0];
    const gameBadge = _("game-page__notification")[0];
    const gameButton = _("game-btn")[0];
    const gameLevel = _("game-page__level")[0];
    const quitGameButton = _("quit-btn")[0];
    let randomQuote,
        randomEmoji,
        isScoreEmpty,
        getScore,
        levelNum = 1,
        clickNum = 0,
        scoreArr = [],
        obstacleIntervalID,
        obstacleElem;

    /******************************** pages ********************************/
    const randomTheme = () =>
        (document.body.dataset.theme = themeArr[random(themeArr.length - 1)]); //minus minimal theme
    const randomAnimBg = () => {
        let gif = gifArr[random(gifArr.length)];
        page.forEach((view) => {
            view.style.background = ` url(img/${gif}) rgba(0,0,0,0.8) center no-repeat`;
            view.style.backgroundSize = "cover";
            // page.style.backgroundBlendMode = 'overlay'; can add if i want to
        });
    };
    const moment = () => {
        let date = new Date();
        return date.toUTCString();
    };
    const statusLog = () => ($("#status__date")[0].innerHTML = moment());
    const scorePagePlaceholder = () => {
        if (scoreList.innerHTML == "") {
            scoreList.innerHTML = `<li class="score-placeholder"> Keep playing, <br> Your scores will show up here!</li>`;
        }
    };
    const hideAllPages = () =>
        allPages.forEach((page) => {
            page.classList.contains("show")
                ? page.classList.replace("show", "hide")
                : page.classList.add("hide");
        }); // hide all pages/views aside the homepage
    const showPage = (event) => {
        hideAllPages();
        let targetPage = event.currentTarget.dataset.page;
        $(`.${targetPage}`)[0].classList.replace("hide", "show");
        homePage.classList.contains("show")
            ? homePage.classList.replace("show", "hide")
            : homePage.classList.add("hide");
    }; // show a menu page
    const showHomePage = (event) => {
        hideAllPages();
        homePage.classList.contains("hide")
            ? homePage.classList.replace("hide", "show")
            : homePage.classList.add("show");
    };
    const updatePageOption = () => {
        let continueHtml = `<div class="home-page__opt menu-continue">
        <button class="btn home-page__btn" data-page="game-page"><i class="fas fa-pause fa-lg"></i> &nbsp;&nbsp; Continue Game</button></div>`;
        $(".menu-new > button")[0].addEventListener("click", refreshGame); // new game button
        if (
            (!isScoreEmpty && !isContinueEnabled) ||
            (IsStoredContinueEnabled && !isContinueEnabled)
        ) {
            homePage.insertAdjacentHTML("afterbegin", continueHtml);
            isContinueEnabled = true;
            IsStoredContinueEnabled = false;
            $(".menu-continue > button")[0].addEventListener("click", showPage); //continue button
        }
    };
    const refreshGame =() => {
        scoreArr = [];
        getScore = {};
        $(".menu-continue")[0].remove();
        isContinueEnabled = false;
    }

    /******************************** settings ********************************/
    const genAudio = () => {
        let actx = new AudioContext();
        let osc = actx.createOscillator();
        osc.connect(actx.destination);
        osc.type = "square";
        osc.frequency.setValueAtTime(261.6, actx.currentTime);
        osc.detune.setValueAtTime(700, actx.currentTime + 0.1);
        osc.start(actx.currentTime);
        osc.stop(actx.currentTime + 0.2);
    };
    const playback = () => {
        let isAudioEnabled = $(".enable-audio")[0].checked;
        if (isAudioEnabled) genAudio();
    };
    const setTheme = (event) => {
        let targetTheme = event.currentTarget.classList[1];
        document.body.dataset.theme = targetTheme.split("-")[0];
    };
    const setAnimatedBg = (event) => {
        let targetBgSrc = event.currentTarget.src;
        page.forEach((view) => {
            view.style.background = ` url(${targetBgSrc}) rgba(0,0,0,0.8) center no-repeat`;
            view.style.backgroundSize = "cover";
            // page.style.backgroundBlendMode = 'overlay'; can add if i want to
        });
    };
    const setBgVisibility = () => {
        if ($(".bg-theme__enable")[0].checked) {
            bgTheme.style.visibility = "visible";
        } else {
            bgTheme.style.visibility = "hidden";
            page.forEach((view) => {
                view.style.background = `var(--bg-color)`;
            });
        }
    };
    const validateInputs = (userInputArr) => {
        let inputs = Array.from(userInputArr).map((elem) => elem.value);
        if (["", null, undefined].includes(...inputs)) {
            console.log("invalid/empty input");
            return;
        }
        return inputs;
    };
    const updateGameArr = (verifiedInput) => {
        motivation.push(verifiedInput[0]);
        emoji.push(verifiedInput[1]);
    };
    const resetInputForm = (inputBoxes) =>
        inputBoxes.forEach((input) => (input.value = ""));
    const customUserInput = (userInputArr) => {
        let validInput = validateInputs(userInputArr);
        resetInputForm(userInputArr);
        updateGameArr(validInput);
        console.log("user edits successful");
    };
    const difficulty = () => {
        let difficulty,
            obstacleRate,
            obstacleTimeout,
            diffLevel = $("input[name='difficulty']:checked")[0].value;
        switch (diffLevel) {
            case "easy":
                difficulty = 10,
                obstacleRate = 7000,
                obstacleTimeout = 2000;
                break;
            case "medium":
                difficulty = 25,
                obstacleRate = 5000,
                obstacleTimeout = 1500;
                break;
            case "hard":
                difficulty = 40,
                obstacleRate = 3000,
                obstacleTimeout = 1000;
                break;
            default:
                difficulty = 10,
                obstacleRate = 7000,
                obstacleTimeout = 2000;
        }
        return { difficulty, obstacleRate, obstacleTimeout };
    };
    const saveStore = () => {
        let userData = {
            game: { scoreArr, emoji, motivation },
            settings: {
                diffLevel: [...$("[name=difficulty]")].find((e) => e.checked)
                    .value,
                music: $("[name=enable-audio]")[0].checked,
                theme: document.body.dataset.theme,
                animBgEnabled: $(".bg-theme__enable")[0].checked,
                get animBgGif() {
                    return this.animBgEnabled
                        ? homePage.style.backgroundImage
                        : "";
                },
            },
            page: { isContinueEnabled },
        };
        localStorage.setItem("gameSettings", `${JSON.stringify(userData)}`);
        alert("data is saved!");
    };
    const loadStore = () => {
        let stored = localStorage.getItem("gameSettings");
        if (stored) {
            let userData = JSON.parse(stored);
            // settings
            [...$("[name=difficulty]")].find(
                (e) => e.value == userData.settings.diffLevel
            ).checked = true;
            $("[name=enable-audio]")[0].checked = userData.settings.music;
            document.body.dataset.theme = userData.settings.theme;
            $(".bg-theme__enable")[0].checked = userData.settings.animBgEnabled;
            // page
            page.forEach((view) => {
                view.style.background = ` ${userData.settings.animBgGif} rgba(0,0,0,0.8) center no-repeat`;
                view.style.backgroundSize = "cover";
                // page.style.backgroundBlendMode = 'overlay'; can add if i want to
            });
            if (userData.page.isContinueEnabled) {
                IsStoredContinueEnabled = true;
                updatePageOption();
            }
            // game
            motivation = userData.game.motivation;
            emoji = userData.game.emoji;
            scoreArr = userData.game.scoreArr;
            scoreArr = scoreArr.filter((e) => e != null);
            displayScore(scoreArr);
            scorePagePlaceholder();
        } else {
            alert("no saved game to restore!");
        }
    };

    /******************************** game ********************************/
    const levelUp = () => {
        //levelling up
        if (clickNum % difficulty().difficulty == 0) {
            ++levelNum;
            playback();
        }
        gameLevel.innerHTML = `Level ${levelNum}`;
    };
    const game = () => {
        quitGameButton.innerHTML = `<i class="fas fa-pause"></i>`;
        randomQuote = random(motivation.length);
        randomEmoji = random(emoji.length);
        gameQuote.className = "quote";
        gameQuote.innerHTML = `${motivation[randomQuote]} <hr/> ${emoji[randomEmoji]}`;
        gameBadge.classList.add("badge");
        gameButton.classList.add("notify");
        gameBadge.innerHTML = ++clickNum;
        levelUp();
        getScore = { Clicks: clickNum, Level: levelNum };
    };
    const resetGame = () => {
        quitGameButton.innerHTML = `<i class="fas fa-home"></i>`;
        ScoreBoard(getScore);
        gameQuote.classList.remove("quote");
        gameQuote.innerHTML = "";
        gameBadge.classList.remove("badge");
        gameButton.classList.remove("notify");
        gameBadge.innerHTML = "";
        clickNum = 0;
        levelNum = 1;
        gameLevel.innerHTML = "";
        resetGameObstacle();
    };
    const checkDuplicateScore = (scoreobj) => {
        // duplicateCheck
        let jsonScore = JSON.stringify(scoreobj);
        let jsonArr = scoreArr.map((scoreobj) => JSON.stringify(scoreobj));
        if (!isScoreEmpty && !jsonArr.includes(jsonScore)) {
            scoreArr.push(scoreobj);
        }
    };
    const rankScores = (scoreArr) => {
        //getHighScore by sorting, limit the scores to be displayed to n where n= n>1 by setting the length
        let highScore = scoreArr.sort((a, b) => b.Clicks - a.Clicks);
        highScore.length = 10;
        return highScore;
    };
    const displayScore = (highscoreArr) => {
        scoreList.innerHTML = "";
        let scorehtml;
        highscoreArr.forEach((score) => {
            scorehtml = `<li class="score-list__item" >Clicks: ${score.Clicks}&nbsp;&nbsp; Level: ${score.Level} </li>`;
            scoreList.innerHTML += scorehtml;
        });
    };
    const ScoreBoard = (scoreobj) => {
        // empty score check
        isScoreEmpty = [null, undefined, 0].includes(scoreobj.Clicks);
        checkDuplicateScore(scoreobj);
        rankScores(scoreArr);
        displayScore(rankScores(scoreArr));
    };
    const quitGameDialog = () => {
        if (clickNum) {
            let choice = confirm("Game Paused\n\nAre You Sure To Quit?");
            if (choice) {
                showHomePage();
                resetGame();
                updatePageOption();
            }
        } else {
            showHomePage();
            resetGame();
        }
        scorePagePlaceholder();
    };
    //obstacles
    const killGame = (event) => {
        alert("GAME OVER\n\nyou didn't see this coming,did you? \nYour Score: Clicks: " + getScore.Clicks + " Level: " + getScore.Level);
        resetGame();
        showHomePage();
    };
    const gameObstacle = (event) => {
        if (!obstacleIntervalID) {
            obstacleIntervalID = setInterval(() => {
                $(".game-page__user")[0].insertAdjacentHTML(
                    "afterBegin",
                    `<span class="obstacle"> ${'<i class="fas fa-skull-crossbones fa-lg"></i>'.repeat(5)} </span>`
                );
                obstacleElem = $(".obstacle")[0];
                obstacleElem.addEventListener("click", killGame);
                setTimeout(
                    () => obstacleElem.remove(), 
                    difficulty().obstacleTimeout
                );
            }, difficulty().obstacleRate);
        }
    };
    const resetGameObstacle = () => {
        clearInterval(obstacleIntervalID);
        obstacleIntervalID = undefined;
    };

    /******************************** init ********************************/
    // pages init
    setTimeout(() => {
        _("splash-screen")[0].style.display = "none";
    }, 2000);
    randomTheme();
    randomAnimBg();
    hideAllPages();
    setInterval(statusLog, 1000);
    [...homePageButtons].forEach((elem) =>
        elem.addEventListener("click", showPage)
    );
    $(".info").forEach((elem) =>
        elem.insertAdjacentHTML("beforeend", backButtonHtml)
    );
    [...backButtons].forEach((elem) =>
        elem.addEventListener("click", showHomePage)
    );
    // settings init
    $(".settings-info__theme").forEach((elem) =>
        elem.addEventListener("click", setTheme)
    );
    gifArr.forEach((i) => {
        bgTheme.innerHTML += `<img class="bg-theme-ico__item" src="img/${i}">`;
    });
    $(".bg-theme-ico__item").forEach((elem) =>
        elem.addEventListener("click", setAnimatedBg)
    );
    setBgVisibility();
    $(".bg-theme__label")[0].addEventListener("click", setBgVisibility);
    $(".submit-btn")[0].addEventListener("click", () =>
        customUserInput($(".user-input"))
    );
    loadData.addEventListener("click", loadStore);
    saveData.addEventListener("click", saveStore);
    // game init
    gameButton.addEventListener("click", game);
    gameButton.addEventListener("click", gameObstacle);
    quitGameButton.addEventListener("click", quitGameDialog);
    // scorepage init
    scorePagePlaceholder();
}

/******************************** datasets ********************************/
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
let themeArr = ["alt1", "nat", "dark", "light", "minimal"];
let gifArr = [
    "gif0.gif",
    "gif1.gif",
    "gif2.gif",
    "gif3.gif",
    "gif4.gif",
    "gif5.gif",
    "gif6.gif",
    "gif7.gif",
    "gif8.gif",
    "gif9.gif",
];
