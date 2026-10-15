const imagePool = {
    memes: [
        "images/memes/meme0210.png",
        "images/memes/meme0317.png",
        "images/memes/meme0414.png",
        "images/memes/meme0624.png",
        "images/memes/meme0711.png",
        "images/memes/meme0719.png",
        "images/memes/meme0821.png",
        "images/memes/meme0823.png",
        "images/memes/meme1012.png",
        "images/memes/meme1125.png",
        "images/memes/meme1215.png"
    ],
    videogames: [
        "images/videogames/vg0112.png",
        "images/videogames/vg0120.png",
        "images/videogames/vg0214.png",
        "images/videogames/vg0216.png",
        "images/videogames/vg0222.png",
        "images/videogames/vg0226.png",
        "images/videogames/vg0310.png",
        "images/videogames/vg0408.png",
        "images/videogames/vg0517.png",
        "images/videogames/vg0523.png",
        "images/videogames/vg0524.png",
        "images/videogames/vg0616.png",
        "images/videogames/vg0720.png",
        "images/videogames/vg0805.png",
        "images/videogames/vg0925.png",
        "images/videogames/vg1018.png",
        "images/videogames/vg1021.png"
    ],
    websites: [
        "images/websites/web0116.png",
        "images/websites/web0300.png",
        "images/websites/web0413.png",
        "images/websites/web0424.png",
        "images/websites/web0426.png",
        "images/websites/web0517.png",
        "images/websites/web0605.png",
        "images/websites/web0622.png",
        "images/websites/web0708.png",
        "images/websites/web0725.png",
        "images/websites/web0802.png",
        "images/websites/web0810.png",
        "images/websites/web0919.png",
        "images/websites/web0923.png",
        "images/websites/web1011.png",
        "images/websites/web1118.png",
        "images/websites/web1206.png",
        "images/websites/web1221.png",
        "images/websites/web1224.png"
    ],
    companies: [
      "images/companies/comp1901.png",
      "images/companies/comp1905.png",
      "images/companies/comp1912.png",
      "images/companies/comp1919.png",
      "images/companies/comp1926.png",
      "images/companies/comp1933.png",
      "images/companies/comp1941.png",
      "images/companies/comp1948.png",
      "images/companies/comp1957.png",
      "images/companies/comp1964.png",
      "images/companies/comp1969.png",
      "images/companies/comp1974.png",
      "images/companies/comp1980.png",
      "images/companies/comp1988.png",
      "images/companies/comp1993.png",
      "images/companies/comp1998.png",
      "images/companies/comp2003.png",
      "images/companies/comp2007.png",
      "images/companies/comp2010.png",
      "images/companies/comp2012.png",
      "images/companies/comp2014.png",
      "images/companies/comp2016.png",
      "images/companies/comp2018.png",
      "images/companies/comp2019.png",
      "images/companies/comp2020.png",
      "images/companies/comp2022.png",
      "images/companies/comp2024.png",
      "images/companies/comp2026.png",
    ]
};

//  date format for each category (month-year or year)
const dateFormatByGame = {
    memes: "month-year",
    videogames: "month-year",
    websites: "month-year",
    companies: "year"
};

const MONTHS = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

// get references from HTML elements
const game = document.body.dataset.game;
const image = document.getElementById("gameimage");
const newGameButton = document.getElementById("newgame");
const playerNamesInput = document.getElementById("playernames");
const createPlayersButton = document.getElementById("createplayers");
const playerGames = document.getElementById("playergames");
const gameStatus = document.getElementById("gamestatus");
const answerReveal = document.getElementById("answerreveal");

// runs game code in the subpages only and not homepage
if (
    game &&
    image &&
    newGameButton &&
    playerNamesInput &&
    createPlayersButton &&
    playerGames &&
    gameStatus &&
    answerReveal
) {
    const dateFormat = dateFormatByGame[game];

    // game status variables
    let currentImagePath = "";
    let players = [];
    let roundComplete = false;

    // shows a random SS from the current game's image pool
    function showRandomImage() {
        const images = imagePool[game];

        const randomIndex = Math.floor(Math.random() * images.length);
        currentImagePath = images[randomIndex];

        image.src = currentImagePath;

        // resets round
        answerReveal.textContent = "";
        roundComplete = false;

        // reset guesses for new round
        players.forEach(player => {player.guess = null; player.submitted = false; player.distance = null;});

        if (players.length > 0) {
            renderPlayerCards();
            gameStatus.textContent =
                "New round ready. Everyone can start guessing!";
        }
    }
    // creates players objects based on # of names
    function createPlayers() {
        const names = playerNamesInput.value
            .split(",")
            // trims names (in case of extra spaces/commas)
            .map(name => name.trim())
            .filter(name => name.length > 0);

        if (names.length === 0) {
            gameStatus.textContent =
                "Enter at least one player name.";
            return;
        }
        // map() creates player objects
        players = names.map(name => ({
            name: name,
            points: 0,
            guess: null,
            submitted: false,
            distance: null,
            pointsElement: null,
            feedbackElement: null
        }));

        playerNamesInput.disabled = true;
        createPlayersButton.disabled = true;

        renderPlayerCards();

        gameStatus.textContent =
            "Players created! Players can now start guessing!";
    }
    // Generate a UI box thing for each player
    function renderPlayerCards() {
        playerGames.replaceChildren();

        players.forEach((player, index) => {
            const card = document.createElement("section");
            card.className = "player-card";

            // player name and score share the same header line
            const header = document.createElement("div");
            header.className = "player-header";

            const heading = document.createElement("h3");
            heading.textContent = player.name;

            const points = document.createElement("span");
            points.className = "player-points";
            points.textContent = `Points: ${player.points}`;

            header.append(heading, points);

            // guess label and input
            const label = document.createElement("label");
            label.htmlFor = `guess-${index}`;
            label.textContent =
                dateFormat === "year"
                    ? "Enter your guess (year):"
                    : "Enter your guess (month and year):";

            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${index}`;
            input.className = "player-guess";
            input.placeholder =
                dateFormat === "year"
                    ? "Example: 2016"
                    : "Example: June 2016";

            // each player's submit button
            const submitButton = document.createElement("button");
            submitButton.type = "button";
            submitButton.className = "submit-guess";
            submitButton.textContent = "Submit Guess";

            // each card has its own status/results area
            const feedback = document.createElement("p");
            feedback.className = "player-feedback";
            feedback.textContent = "Waiting for your guess.";

            // keep references so scores and results can be updated later
            player.pointsElement = points;
            player.feedbackElement = feedback;

            submitButton.addEventListener("click", function () {
                submitGuess(player, input, submitButton, feedback);
            });

            card.append(
                header,
                label,
                input,
                submitButton,
                feedback
            );
            playerGames.append(card);
        });
    }
    // reads guess and validates it, shows submit confirmation msg
    function submitGuess(player, input, submitButton, feedback) {
        if (roundComplete || player.submitted) {
            return;
        }

        const guess = parseGuess(input.value, dateFormat);

        if (!guess) {
            feedback.textContent =
                dateFormat === "year"
                    ? "Enter a valid four-digit year, such as 2016."
                    : "Enter a valid month and year, such as June 2016.";
            return;
        }

        player.guess = guess;
        player.submitted = true;

        input.disabled = true;
        submitButton.disabled = true;

        feedback.textContent =
            "Guess submitted. Waiting for the other players...";

        // completes round when every player guesses
        if (players.every(player => player.submitted)) {
            completeRound();
        }
    }

    // accept a year, or a month and year, depending on the game format
    function parseGuess(value, format) {
        const text = value.trim();

        if (format === "year") {
            if (!/^\d{4}$/.test(text)) {
                return null;
            }
            return {
                year: Number(text),
                month: null
            };
        }

        // format: June 2016 or Jun 2016
        const match = text.match(/^([A-Za-z]+)\s+(\d{4})$/);
        if (match) {
          const monthName = match[1].toLowerCase();
          const month = MONTHS.findIndex(name => name.toLowerCase() === monthName) + 1;
          
          if (month >= 1 && month <= 12) {
            return { month: month, year: Number(match[2]) };
          }
        }
        return null;
    }

    // pulls correct answer from image filename
    function getAnswerFromImage(path, format) {
        const filename = path
            .split("/")
            .pop()
            .replace(/\.[^.]+$/, "");

        if (format === "year") {
            // Year-only filenames must end in a four-digit year, such as topic2020.png
            // not used yet
            const match = filename.match(/(\d{4})$/);

            if (!match) {
                return null;
            }

            return {
                year: Number(match[1]),
                month: null
            };
        }

        // image files end in MMYY, e.g. meme1125.png
        const match = filename.match(/(\d{2})(\d{2})$/);

        if (!match) {
            return null;
        }

        const month = Number(match[1]);
        const year = 2000 + Number(match[2]);

        if (month < 1 || month > 12) {
            return null;
        }
        return {month, year};
    }

    // calculate how far a guess is from the answer
    function calculateDistance(guess,answer,format) {
        if (format === "year") {
            return Math.abs(guess.year-answer.year);
        }

        const guessedMonths = guess.year*12+guess.month;
        const answerMonths = answer.year*12+answer.month;

        return Math.abs(guessedMonths-answerMonths);
    }

    // turn a date object into something readable
    function formatDate(date,format) {
        if (format === "year") {
            return String(date.year);
        }
        return `${MONTHS[date.month-1]} ${date.year}`;
    }

    // turn the numerical distance into a readable result
    function formatDistance(distance, format) {
        if (distance === 0) {
            return "On the dot!";
        }

        if (format === "year") {
            return `${distance} ${distance === 1 ? "year" : "years"} away.`;
        }

        const years = Math.floor(distance / 12);
        const months = distance % 12;
        const parts = [];

        if (years > 0) {
            parts.push(
                `${years} ${years === 1 ? "year" : "years"}`
            );
        }

        if (months > 0) {
            parts.push(
                `${months} ${months === 1 ? "month" : "months"}`
            );
        }
        return `${parts.join(", ")} away.`;
    }

    // reveal the answer and award the point once everybody has guessed
    function completeRound() {
        const answer = getAnswerFromImage(currentImagePath, dateFormat);

        players.forEach(player => {
            player.distance = calculateDistance(player.guess,answer,dateFormat);
        });

        const closestDistance = Math.min(
            ...players.map(player => player.distance)
        );

        const winners = players.filter(
            player => player.distance === closestDistance
        );

        // everyone tied for closest gets one point
        winners.forEach(player => {
            player.points += 1;
        });

        roundComplete = true;

        answerReveal.textContent =
            `Answer: ${formatDate(answer, dateFormat)}`;

        const winnerSet = new Set(winners);

        players.forEach(player => {
            player.pointsElement.textContent =
                `Points: ${player.points}`;

            player.feedbackElement.textContent =
                `Your guess: ${formatDate(player.guess, dateFormat)} (` +
                `${formatDistance(player.distance, dateFormat)}) ` +
                (winnerSet.has(player)
                    ? "Closest! +1 point."
                    : "");
        });
        if (winners.length === 1) {
            gameStatus.textContent =
                `${winners[0].name} was closest and earns 1 point!`;
        } else {
            gameStatus.textContent =
                `It's a tie! ${winners.map(p => p.name).join(", ")} ` +
                "each earn 1 point.";
        }
    }
    newGameButton.addEventListener("click", showRandomImage);
    createPlayersButton.addEventListener("click", createPlayers);
}