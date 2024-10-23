let answerArray = [];

fetch("./answerArray.json")
  .then((response) => response.json())
  .then((data) => {
    answerArray = data; // Store the loaded data in answerArray
  })
  .catch((error) => {
    console.error("Error loading answerArray:", error);
  });

$(document).ready(function () {
  let interval;
  let isRunning = false;
  let wordArray = [];

  let displayedWords = [];
  let displayTime = 0;
  let currentIndex = 0;
  let manualMode = false;
  let showAnswer = false;

  // Update progress bar with transition
  function updateProgressBar() {
    let progressElement = $("#progress");
    progressElement.css({
      transition: `width ${displayTime}s linear`, // Set transition to match displayTime
      width: "100%",
    });
  }

  // Clear the progress bar
  function clearProgressBar() {
    let progressElement = $("#progress");
    progressElement.css({
      transition: "none", // Remove transition temporarily
      width: "0%", // Reset width
    });
  }

  // Random Word Display Logic
  function randomizeWords() {
    if (displayedWords.length === wordArray.length) {
      displayedWords = [];
    }

    let newWord;
    do {
      currentIndex = Math.floor(Math.random() * wordArray.length);
      newWord = wordArray[currentIndex];
    } while (displayedWords.includes(newWord));

    $("#displayWord").text(newWord);
    displayedWords.push(newWord);

    if (showAnswer) {
      const textAnswer = answerArray.find(
        (item) => item.text === newWord
      )?.answer;

      if (textAnswer) {
        $("#displayAnswer").text(textAnswer).removeClass("hidden"); // Show answer
      } else {
        $("#displayAnswer").addClass("hidden");
      }
    } else {
      $("#displayAnswer").addClass("hidden"); // Hide answer
    }

    if (!manualMode) {
      clearProgressBar(); // Reset progress bar
      setTimeout(updateProgressBar, 100); // Start progress bar with a small delay

      interval = setInterval(() => {
        if (displayedWords.length === wordArray.length) {
          displayedWords = [];
        }

        do {
          currentIndex = Math.floor(Math.random() * wordArray.length);
          newWord = wordArray[currentIndex];
        } while (displayedWords.includes(newWord));

        $("#displayWord").text(newWord);
        displayedWords.push(newWord);

        if (showAnswer) {
          const textAnswer = answerArray.find(
            (item) => item.text === newWord
          )?.answer;

          if (textAnswer) {
            $("#displayAnswer").text(textAnswer).removeClass("hidden"); // Show answer
          } else {
            $("#displayAnswer").addClass("hidden");
          }
        } else {
          $("#displayAnswer").addClass("hidden"); // Hide answer
        }

        clearProgressBar(); // Reset progress bar
        setTimeout(updateProgressBar, 100); // Start progress bar with a small delay
      }, displayTime * 1000);
    }
  }

  function startGame() {
    wordArray = $("#wordList")
      .val()
      .split(",")
      .map((word) => word.trim());
    displayTime = parseFloat($("#displayTime").val());
    showAnswer = $("#showAnswer").is(":checked"); // Get value of checkbox
    manualMode = $("#manualMode").is(":checked"); // Get value of checkbox
    let progressBarElement = $("#progress-bar");

    if (manualMode) {
      progressBarElement.addClass("hidden");
    } else {
      progressBarElement.removeClass("hidden");
    }

    if (wordArray.length > 0 && displayTime > 0) {
      $("#configPanel").addClass("hidden");
      $("#displayArea").removeClass("hidden");
      isRunning = true;
      displayedWords = [];
      randomizeWords();
    } else {
      alert("Please provide a valid word list and display time.");
    }
  }

  function stopGame() {
    clearInterval(interval);
    clearProgressBar(); // Stop progress bar
    isRunning = false;
  }

  // Start game and hide config
  $("#startRandomizer").click(function () {
    startGame();
    if (manualMode) {
      $("#toggleGame")
        .text("Continue")
        .removeClass("bg-red-500")
        .addClass("bg-green-500");
    } else {
      $("#toggleGame")
        .text("Stop Game")
        .removeClass("bg-green-500")
        .addClass("bg-red-500");
    }
  });

  // Toggle between stop and continue
  $("#toggleGame").click(function () {
    if (manualMode) {
      randomizeWords();
      return;
    }

    if (isRunning) {
      stopGame();
      $("#toggleGame")
        .text("Continue Game")
        .removeClass("bg-red-500")
        .addClass("bg-green-500");
    } else {
      randomizeWords();
      $("#toggleGame")
        .text("Stop Game")
        .removeClass("bg-green-500")
        .addClass("bg-red-500");
      isRunning = true;
    }
  });

  // Show config panel and hide flash cards
  $("#showConfig").click(function () {
    $("#displayArea").addClass("hidden");
    $("#configPanel").removeClass("hidden");
    stopGame();
    $("#displayWord").text("");
  });

  // Listen for "space" keypress to trigger start/stop
  $(document).keydown(function (e) {
    if (e.code === "Space") {
      e.preventDefault();
      $("#toggleGame").click();
    }
  });
});
