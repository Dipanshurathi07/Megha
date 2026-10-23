const yesButton = document.querySelector("#yes-button");
const noButton = document.querySelector("#no-button");
const answerMessage = document.querySelector("#answer-message");
const buttonArea = document.querySelector("#button-area");

if (yesButton && answerMessage) {
  yesButton.addEventListener("click", () => {
    answerMessage.textContent = "Yay! 🥰 Sending you the biggest virtual hug. Text me when you're free? 💞";
    yesButton.textContent = "You just made my day! 💗";
  });
}

if (noButton && buttonArea && answerMessage) {
  let dodges = 0;
  const dodge = () => {
    const area = buttonArea.getBoundingClientRect();
    const button = noButton.getBoundingClientRect();
    const maxX = Math.max(0, area.width - button.width);
    noButton.style.position = "absolute";
    noButton.style.left = `${Math.random() * maxX}px`;
    noButton.style.top = `calc(50% + ${Math.random() * 34 - 17}px)`;
    dodges += 1;
    if (dodges === 1) answerMessage.textContent = "Hehe, Nahi is feeling shy! 😳";
  };
  noButton.addEventListener("pointerenter", dodge);
  noButton.addEventListener("touchstart", (event) => {
    event.preventDefault();
    dodge();
  }, { passive: false });
  noButton.addEventListener("click", () => {
    answerMessage.textContent = "No worries, cutie! Your real answer always counts. Sending you love either way. 🫶";
    noButton.textContent = "Okay, I heard you 💛";
    noButton.style.position = "relative";
    noButton.style.left = "";
    noButton.style.top = "";
  });
}

const giftButton = document.querySelector("#gift-button");
const giftReveal = document.querySelector("#gift-reveal");
if (giftButton && giftReveal) {
  const giftScene = document.querySelector("#gift-scene");
  const replayGift = document.querySelector("#gift-replay");
  const giftPetals = document.querySelector("#gift-petals");
  const giftCaption = document.querySelector("#gift-scene-caption");
  let petalTimeout;
  const sendHug = () => {
    giftScene.classList.remove("gift-scene-playing");
    void giftScene.offsetWidth;
    giftScene.classList.add("gift-scene-playing");
    giftCaption.textContent = "A little hug is travelling from Delhi to Kolkata…";
    giftPetals.replaceChildren();
    const petals = ["🌸", "♡", "🌷", "✿", "♥", "🌸", "♡", "✿", "💗", "🌷", "♡", "🌸"];
    giftPetals.replaceChildren(...petals.map((petal, index) => {
      const element = document.createElement("span");
      element.className = "gift-floating-petal";
      element.textContent = petal;
      element.style.setProperty("--petal-index", String(index));
      return element;
    }));
    window.clearTimeout(petalTimeout);
    petalTimeout = window.setTimeout(() => {
      giftCaption.textContent = "Hug delivered! Hold for 8 seconds, madam. 🫂";
      giftScene.classList.remove("gift-scene-playing");
      giftPetals.replaceChildren();
    }, 2600);
  };
  giftButton.addEventListener("click", () => {
    giftReveal.hidden = false;
    giftButton.hidden = true;
    giftReveal.querySelector("h2").focus();
    sendHug();
  });
  replayGift.addEventListener("click", sendHug);
}

const reasonButton = document.querySelector("#reason-button");
if (reasonButton) {
  const reasons = [
    ["👀", "Kolkata has my favourite eyes. Apparently they're yours."],
    ["📋", "HR madam, please approve one Delhi-to-Kolkata hug."],
    ["🥺", "Soft heart. Strong madam. Cute combo."],
    ["💌", "One message from you = my Delhi day made."],
    ["🤭", "Even your thoda-sakht face is adorable."],
    ["🫶", "Distance: long. My soft spot for you: longer."],
    ["🌷", "You, being exactly you. That's the whole reason."],
    ["💔", "Tu chali gayi, achha hai... tujhe mujhse bahut behtar mil gaya hoga. Bas ek baar wajah bata deti—main sirf itna hi chahta tha. Baaki, tu khush reh."]
  ];
  let current = 0;
  reasonButton.addEventListener("click", () => {
    current = (current + 1) % reasons.length;
    document.querySelector("#reason-icon").textContent = reasons[current][0];
    document.querySelector("#reason-text").textContent = reasons[current][1];
    document.querySelector("#reason-counter").textContent = `${String(current + 1).padStart(2, "0")} / ${reasons.length}`;
  });
}

const quizOptions = document.querySelector("#quiz-options");
if (quizOptions) {
  const questions = [
    {
      question: "What's the best start to my day?",
      options: ["7–9 wali call with you 🌤️", "Your cute voice note 💌", "You getting your beauty sleep 😴"],
      feedback: ["Correct. Delhi ka mood instantly sunny. ☀️", "Voice note replay count? Classified information. 🤭", "Also correct. HR madam ki rest policy respected. 🫡"]
    },
    {
      question: "Gym join karne ka mera cutest motivation?",
      options: ["Health ke liye, obviously 💪", "Tere liye ek din badiya body banaunga 😏", "Mirror ko impress karna (nice try) 🪞"],
      feedback: ["Green-flag answer. Strong and healthy is the goal. 💚", "Caught me. Tere liye extra motivation, but no deadline. 😉", "Mirror ko bol, Megha's approval matters more. 😌"]
    },
    {
      question: "Workout ke baad reward mein kya chahiye?",
      options: ["Megha ka proud wala “good job” 🥹", "Ek extra-zor ka hug, if she wants 🫂", "Kolkata snacks. Recovery is important 🍰"],
      feedback: ["Bas, ab roz workout karne ka mann karega. 🥹", "Hug request submitted—only if you feel like it. 🤍", "Finally, someone understands evidence-based snacking. 🍰"]
    },
    {
      question: "Agar HR madam ko mujhse thoda gussa aaye…",
      options: ["Main pehle sununga aur sorry bolunga 🥺", "Ek meme bhejunga—par baat bhi karunga 🤭", "Chai/coffee pe calmly sort karenge ☕"],
      feedback: ["Good boyfriend policy: listen first, excuses later. ✅", "Meme as ice-breaker, honest talk as the actual fix. 📋", "Meeting invite accepted. Agenda: us, not spreadsheets. ☕"]
    },
    {
      question: "Finally Kolkata mein milne par dream first date?",
      options: ["Treats, long talks & stealing one bite 🍰", "Evening walk and silly smiles 🌆", "Cosy café, eye-contact challenge ☕"],
      feedback: ["I promise to ask before stealing your fries. Probably. 😇", "Delhi-Kolkata distance: temporarily defeated. 🌆", "I will absolutely lose the eye-contact challenge. 🫣"]
    }
  ];
  let current = 0;
  let locked = false;
  let pickedAnswers = [];
  const heading = document.querySelector("#quiz-question");
  const progressLabel = document.querySelector("#quiz-progress-label");
  const progressBar = document.querySelector("#quiz-progress-bar");
  const feedback = document.querySelector("#quiz-feedback");
  const result = document.querySelector("#quiz-result");
  const renderQuestion = () => {
    locked = false;
    const item = questions[current];
    heading.textContent = item.question;
    progressLabel.textContent = `QUESTION ${String(current + 1).padStart(2, "0")} OF ${questions.length}`;
    progressBar.style.width = `${((current + 1) / questions.length) * 100}%`;
    feedback.textContent = "";
    quizOptions.replaceChildren(...item.options.map((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.textContent = option;
      button.addEventListener("click", () => chooseAnswer(button, index));
      return button;
    }));
  };
  const chooseAnswer = (button, index) => {
    if (locked) return;
    locked = true;
    button.classList.add("selected");
    pickedAnswers.push(questions[current].options[index]);
    feedback.textContent = questions[current].feedback[index];
    window.setTimeout(() => {
      current += 1;
      if (current === questions.length) {
        quizOptions.hidden = true;
        heading.hidden = true;
        feedback.hidden = true;
        document.querySelector("#quiz-result-copy").textContent =
          `Official result: ${questions.length}/${questions.length} adorable answers. Your choices: ${pickedAnswers.join(" • ")}. Verdict: Megha is still my favourite answer to everything. ♡`;
        document.querySelector("#quiz-answer-summary").replaceChildren(...pickedAnswers.map((answer, index) => {
          const badge = document.createElement("span");
          badge.className = "quiz-answer-chip";
          badge.textContent = `${index + 1}. ${answer}`;
          return badge;
        }));
        result.hidden = false;
      } else {
        renderQuestion();
      }
    }, 850);
  };
  renderQuestion();
  document.querySelector("#quiz-restart").addEventListener("click", () => {
    current = 0;
    pickedAnswers = [];
    quizOptions.hidden = false;
    heading.hidden = false;
    feedback.hidden = false;
    result.hidden = true;
    renderQuestion();
  });
}

const ratingForm = document.querySelector("#rating-form");
if (ratingForm) {
  const labels = [
    ["looks", "Looks", "😎"],
    ["nature", "Nature", "🫶"],
    ["naughty", "Naughty level", "🤭"],
    ["shy", "Shy-o-meter", "🫣"],
    ["chaos", "Chaos level", "🌀"],
    ["anger", "Gussa meter", "😤"]
  ];
  const sliders = [...ratingForm.querySelectorAll("[data-rating]")];
  const resultPanel = document.querySelector("#rating-result");
  const updateSlider = (slider) => {
    document.querySelector(`#output-${slider.name}`).value = `${slider.value}/10`;
    const percentage = ((Number(slider.value) - 1) / 9) * 100;
    slider.style.background = `linear-gradient(to right, #ce6576 ${percentage}%, #f0e5df ${percentage}%)`;
  };
  sliders.forEach((slider) => {
    updateSlider(slider);
    slider.addEventListener("input", () => updateSlider(slider));
  });

  ratingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const ratings = Object.fromEntries(sliders.map((slider) => [slider.name, Number(slider.value)]));
    const average = Object.values(ratings).reduce((total, score) => total + score, 0) / sliders.length;
    const sorted = [...labels].sort((left, right) => ratings[right[0]] - ratings[left[0]]);
    const topTrait = sorted[0];
    let verdict;
    if (average >= 9) verdict = `A ${average.toFixed(1)}/10?! The review board suspects the judge may be a little in love. Case dismissed. 💘`;
    else if (average >= 7) verdict = `${average.toFixed(1)}/10: Certified cutie, occasional chaos gremlin, and very clearly your favourite. 🏆`;
    else if (average >= 5) verdict = `${average.toFixed(1)}/10: Needs improvement. Luckily, the judge has agreed to continue dating him during the remedial classes. 📝`;
    else verdict = `${average.toFixed(1)}/10: Brutal review! Boyfriend has been sent to the Compliment & Snack Rehabilitation Centre. 🍪`;

    document.querySelector("#result-score").textContent = average.toFixed(1);
    document.querySelector("#result-verdict").textContent = verdict;
    document.querySelector("#result-breakdown").replaceChildren(...labels.map(([key, label, emoji]) => {
      const badge = document.createElement("span");
      badge.className = "result-badge";
      badge.textContent = `${emoji} ${label}: ${ratings[key]}/10`;
      return badge;
    }));
    const rapidAnswers = [...ratingForm.querySelectorAll('input[name="flirtyStare"]:checked, input[name="firstBlush"]:checked, input[name="oneMoreMinute"]:checked, input[name="teaseComeback"]:checked')].map((input) => {
      const question = input.closest("fieldset").querySelector("legend").textContent;
      const answer = input.nextElementSibling.textContent;
      return `${question} ${answer}`;
    });
    document.querySelector("#result-rapid").textContent = rapidAnswers.length
      ? `Blush-confession verdict: ${rapidAnswers.join(" ")}`
      : "Blush-confession verdict: jury ne filhaal secrets apne paas rakhe hain. Very mysterious. 👀";

    const selected = (name) => ratingForm.querySelector(`input[name="${name}"]:checked`)?.value;
    const arrivalScenes = {
      hug: "We spot each other and, if we both want, meet in the warmest big hug—Delhi and Kolkata suddenly feel a little closer. 🫂",
      blush: "We spot each other, both smile, and suddenly forget the clever things we planned to say. Cute blushing is officially allowed. 🫣",
      gussa: "Megha gives me the classic “itni der laga di!” look; I say sorry, she tries not to smile, and the reunion gussa melts away. 😤",
      hands: "We find each other, grin like silly people, and hold hands if it feels right—finally together, not just on a screen. 🤝"
    };
    const affectionScenes = {
      him: "I ask Megha if a kiss feels okay; it happens only if we both genuinely want to. 💋",
      megha: "Megha gets to make the first move if she wants; a happy yes from both is the only green light. 💋",
      both: "A kiss can happen only if it feels like a mutual moment and we both say yes. 💋",
      later: "First meet pe no pressure—we can decide together another time, only if we both want to. 🤍"
    };
    const hugScenes = {
      him: "I open my arms and ask if she wants a hug; her comfort decides the next move. 🫂",
      megha: "Megha launches the first hug attack, if she feels like it—and I happily hug back. 🫂",
      both: "We both move in for a hug at once: full Bollywood timing, gentle collision. 🤭",
      ask: "I ask “hug?” first, and we go with whatever feels comfortable for both. 🤍"
    };
    const cookingScenes = {
      him: "I cook something for Megha, while she gets full taste-tester authority. 👨‍🍳",
      megha: "Megha cooks for me and I volunteer as the extremely enthusiastic sous-chef. 😇",
      together: "We cook together: teamwork, taste tests, and probably a little kitchen chaos. 🍝",
      order: "We order something delicious—first date hai, cooking exam thodi. 😋"
    };
    const shyScenes = {
      him: "I’m the one blushing first, especially if she looks into my eyes. 🫣",
      megha: "Megha gets the cute shy smile, and I try not to make her blush more. 🌷",
      both: "We both get shy, forget our prepared lines, and laugh about it. 🤭"
    };
    const clingScenes = {
      him: "I’ll probably ask for extra hugs—but only when she’s in the mood. 🫂",
      megha: "Megha can claim the cuddle spot whenever she wants; her choice, her pace. 😉",
      both: "We’ll both be a little clingy, with mutual yeses and comfy personal space. 🤍",
      space: "We’ll enjoy the date and give each other room; closeness can happen naturally. 🌿"
    };
    const teasingScenes = {
      late: "She gets one tiny “late kyun aaye?” complaint, I apologise properly, and then we laugh about it. 😄",
      tease: "My teasing gets one playful HR complaint; I promise to behave if she says “bas”—terms and conditions accepted. 🤭",
      none: "No gussa required: just a peaceful, extra-long hug if we both feel like it. ♡"
    };
    const dateScenes = {
      food: "Then it’s Kolkata treats, unhurried conversation, and me pretending I’m not stealing a bite. 🍰",
      walk: "Then we take a slow evening walk and hold hands only if that feels comfy for both of us. 🌆",
      coffee: "Then a cosy café, lots of catching up, and an eye-contact challenge I will probably lose. ☕"
    };
    const meetScene = [
      arrivalScenes[selected("arrival")] || "We finally meet, take a breath, and let the first moment be exactly what feels natural. 🤍",
      hugScenes[selected("firstHug")] || "We’ll check in and let the first hug happen only if we both want it.",
      affectionScenes[selected("kiss")] || "We check in with each other and let affection happen only if we both feel comfortable.",
      cookingScenes[selected("cooking")] || "We’ll decide together whether to cook or pick a favourite Kolkata treat.",
      shyScenes[selected("shyOne")] || "A little shyness is welcome; there’s no perfect way to meet.",
      clingScenes[selected("clingy")] || "We’ll find a comfy balance between closeness and space.",
      teasingScenes[selected("tease")] || "A little laughter, a little softness, and absolutely no pressure to follow a script.",
      dateScenes[selected("date")] || "We choose a cosy first date together and enjoy finally being in the same city."
    ].join(" ");
    document.querySelector("#meet-reveal-text").textContent = meetScene;
    document.querySelector("#share-rating").dataset.shareText =
      `Megha's Boyfriend Report™: ${average.toFixed(1)}/10 overall. ${topTrait[2]} ${topTrait[1]} scored ${ratings[topTrait[0]]}/10. ${verdict} Blush-confession verdict: ${rapidAnswers.join(" ")} Our first-meet daydream: ${meetScene}`;
    resultPanel.hidden = false;
    resultPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.querySelector("#edit-rating").addEventListener("click", () => {
    resultPanel.hidden = true;
    ratingForm.scrollIntoView({ behavior: "smooth", block: "start" });
    sliders[0].focus();
  });

  document.querySelector("#share-rating").addEventListener("click", async (event) => {
    const text = event.currentTarget.dataset.shareText;
    const status = document.querySelector("#share-status");
    if (navigator.share) {
      try {
        await navigator.share({ title: "Megha's Boyfriend Report™", text });
        status.textContent = "Verdict shared with the jury. 💌";
        return;
      } catch (error) {
        if (error.name === "AbortError") {
          status.textContent = "Share cancelled. The verdict is still safely right here. ♡";
          return;
        }
        if (error.name !== "NotAllowedError" && error.name !== "InvalidStateError") {
          throw error;
        }
      }
    }
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = "Report copied! Paste it wherever you want. 💌";
      } catch (error) {
        if (error.name !== "NotAllowedError" && error.name !== "NotFoundError") {
          throw error;
        }
        status.textContent = "Your browser blocked copying. You can still screenshot your report. 📸";
      }
    } else {
      status.textContent = "Screenshot your report to share it with the jury. 📸";
    }
  });
}

const catchArena = document.querySelector("#catch-arena");
if (catchArena) {
  const startButton = document.querySelector("#start-catch");
  const welcome = document.querySelector("#arena-welcome");
  const finishMessage = document.querySelector("#catch-finish");
  const scoreLabel = document.querySelector("#heart-score");
  const timerLabel = document.querySelector("#heart-timer");
  const bestLabel = document.querySelector("#heart-best");
  const storageKey = "megha-catch-hearts-best";
  let score = 0;
  let timeLeft = 20;
  let spawnInterval;
  let timerInterval;
  let running = false;

  try {
    bestLabel.textContent = localStorage.getItem(storageKey) || "0";
  } catch {
    bestLabel.textContent = "0";
  }

  const finishGame = () => {
    window.clearInterval(spawnInterval);
    window.clearInterval(timerInterval);
    running = false;
    catchArena.querySelectorAll(".floating-game-heart").forEach((heart) => heart.remove());
    let best = Number(bestLabel.textContent) || 0;
    if (score > best) {
      best = score;
      try {
        localStorage.setItem(storageKey, String(best));
      } catch {
        bestLabel.textContent = String(best);
      }
      bestLabel.textContent = String(best);
    }
    const message = score >= 20
      ? `Insane HR reflexes! ${score} hearts caught! Delhi is officially impressed. 😍`
      : score >= 10
        ? `${score} hearts caught! Certified Kolkata heart-catcher. I owe you ${score} virtual hugs. 🫂`
        : `${score} ${score === 1 ? "heart" : "hearts"}! HR madam was busy approving leave requests, na? One more try? 💌`;
    const text = document.createElement("span");
    text.textContent = message;
    const replay = document.createElement("button");
    replay.className = "button button-primary";
    replay.type = "button";
    replay.textContent = "Rematch? 💗";
    replay.addEventListener("click", startGame);
    finishMessage.replaceChildren(text, replay);
    finishMessage.hidden = false;
  };

  const spawnHeart = () => {
    if (!running) return;
    const heart = document.createElement("button");
    heart.type = "button";
    heart.className = "floating-game-heart";
    heart.textContent = ["💗", "💌", "💕", "🌷", "❤️"][Math.floor(Math.random() * 5)];
    heart.setAttribute("aria-label", "Catch a flying love heart");
    const maxLeft = Math.max(0, catchArena.clientWidth - 50);
    const maxTop = Math.max(0, catchArena.clientHeight - 54);
    heart.style.left = `${Math.random() * maxLeft}px`;
    heart.style.top = `${Math.random() * maxTop}px`;
    heart.addEventListener("click", () => {
      if (!running) return;
      score += 1;
      scoreLabel.textContent = String(score);
      heart.remove();
    });
    catchArena.append(heart);
    window.setTimeout(() => heart.remove(), 1150);
  };

  function startGame() {
    window.clearInterval(spawnInterval);
    window.clearInterval(timerInterval);
    score = 0;
    timeLeft = 20;
    running = true;
    scoreLabel.textContent = "0";
    timerLabel.textContent = "20";
    welcome.hidden = true;
    finishMessage.hidden = true;
    catchArena.querySelectorAll(".floating-game-heart").forEach((heart) => heart.remove());
    spawnHeart();
    spawnInterval = window.setInterval(spawnHeart, 470);
    timerInterval = window.setInterval(() => {
      timeLeft -= 1;
      timerLabel.textContent = String(timeLeft);
      if (timeLeft <= 0) finishGame();
    }, 1000);
  }

  startButton.addEventListener("click", startGame);
}

const matchBoard = document.querySelector("#match-board");
if (matchBoard) {
  const emojis = ["👀", "💌", "🌷", "🫂", "🍓", "💼"];
  const pairLabel = document.querySelector("#match-pairs");
  const movesLabel = document.querySelector("#match-moves");
  const message = document.querySelector("#match-message");
  const hugCount = document.querySelector("#hug-count");
  const hugProgressBar = document.querySelector("#hug-progress-bar");
  const hugProgress = document.querySelector(".hug-progress");
  const hugStatus = document.querySelector("#hug-status");
  const celebration = document.querySelector("#hug-celebration");
  let cards = [];
  let opened = [];
  let matched = 0;
  let moves = 0;
  let locked = false;
  let mismatchTimeout;
  const hugLines = [
    "A Delhi hug is on its way to Kolkata. 🫂",
    "Virtual hug delivered! Distance: still losing. 💌",
    "One more squeeze for my HR madam. 🌷",
    "Delhi → Kolkata: hug express, no delays. 🚄",
    "You're matching hearts and stealing mine. 💗",
    "All hugs delivered. Ab ek real wali pending hai. 🥺"
  ];

  const shuffleCards = (items) => {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
  };

  const drawCards = () => {
    matchBoard.replaceChildren(...cards.map((emoji, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "match-tile";
      button.textContent = "♡";
      button.setAttribute("aria-label", `Hidden love card ${index + 1}`);
      button.addEventListener("click", () => flipCard(button, index));
      return button;
    }));
  };

  const showMatchBurst = (firstCard, secondCard) => {
    const first = firstCard.getBoundingClientRect();
    const second = secondCard.getBoundingClientRect();
    const board = matchBoard.getBoundingClientRect();
    const burst = document.createElement("span");
    burst.className = "match-burst";
    burst.textContent = matched === emojis.length ? "🫂 💗" : "💌 ✨";
    burst.setAttribute("aria-hidden", "true");
    burst.style.left = `${(first.left + second.left) / 2 + first.width / 2 - board.left}px`;
    burst.style.top = `${(first.top + second.top) / 2 - board.top}px`;
    matchBoard.append(burst);
    window.setTimeout(() => burst.remove(), 900);
  };

  const resetMatch = () => {
    window.clearTimeout(mismatchTimeout);
    cards = shuffleCards([...emojis, ...emojis]);
    opened = [];
    matched = 0;
    moves = 0;
    locked = false;
    pairLabel.textContent = "0";
    movesLabel.textContent = "0";
    hugCount.textContent = "0";
    hugProgressBar.style.width = "0%";
    hugProgress.setAttribute("aria-valuenow", "0");
    hugStatus.textContent = "A match = one virtual hug from Delhi to Kolkata. Ready? 💌";
    hugStatus.classList.remove("hug-latest");
    celebration.hidden = true;
    celebration.scrollIntoView?.({ behavior: "instant", block: "nearest" });
    document.querySelectorAll(".match-burst").forEach((burst) => burst.remove());
    message.textContent = "Flip two cards. Let's see that HR memory!";
    drawCards();
  };

  const flipCard = (button, index) => {
    if (locked || button.classList.contains("is-open") || button.classList.contains("is-matched")) return;
    button.classList.add("is-open");
    button.textContent = cards[index];
    button.setAttribute("aria-label", `Love card: ${cards[index]}`);
    opened.push({ button, emoji: cards[index] });
    if (opened.length < 2) return;
    moves += 1;
    movesLabel.textContent = String(moves);
    if (opened[0].emoji === opened[1].emoji) {
      opened.forEach((card) => {
        card.button.classList.add("is-matched");
        card.button.disabled = true;
      });
      const [firstCard, secondCard] = opened.map((card) => card.button);
      matched += 1;
      pairLabel.textContent = String(matched);
      hugCount.textContent = String(matched);
      hugProgressBar.style.width = `${(matched / emojis.length) * 100}%`;
      hugProgress.setAttribute("aria-valuenow", String(matched));
      hugStatus.textContent = hugLines[matched - 1];
      hugStatus.classList.remove("hug-latest");
      void hugStatus.offsetWidth;
      hugStatus.classList.add("hug-latest");
      opened.forEach((card) => {
        card.button.classList.add("just-matched");
        window.setTimeout(() => card.button.classList.remove("just-matched"), 550);
      });
      opened = [];
      showMatchBurst(firstCard, secondCard);
      if (matched === emojis.length) {
        locked = true;
        message.textContent = `Perfect match! All ${emojis.length} pairs found in ${moves} moves. Delhi boy is impressed. 🏆`;
        celebration.hidden = false;
        window.setTimeout(() => celebration.scrollIntoView({ behavior: "smooth", block: "center" }), 160);
      } else {
        message.textContent = ["Matching skills: HR-approved! ✅", "Kolkata is winning; Delhi is cheering! ✨", "A match! A virtual hug just arrived. 🫂"][matched % 3];
      }
      return;
    }
    locked = true;
    message.textContent = "Mismatch! Itna confidently HR mein bhi decision leti ho? 😜";
    mismatchTimeout = window.setTimeout(() => {
      opened.forEach((card) => {
        card.button.classList.remove("is-open");
        card.button.textContent = "♡";
        card.button.setAttribute("aria-label", "Hidden love card");
      });
      opened = [];
      locked = false;
      message.textContent = "Try again, cutie. No appraisal consequences.";
    }, 650);
  };

  document.querySelector("#restart-match").addEventListener("click", resetMatch);
  document.querySelector("#play-again-match").addEventListener("click", () => {
    resetMatch();
    matchBoard.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  resetMatch();
}

const nextNoteButton = document.querySelector("#next-note");
if (nextNoteButton) {
  const notes = [
    "Delhi se Kolkata: ek virtual hug, express delivery. 🫂",
    "HR madam, please approve one extra I-miss-you. 💌",
    "Tumhari aankhein = my favourite long-distance view. 👀",
    "Thodi sakht, bahut pyaari. That's my girl. 🌷",
    "Distance map pe hai. Tum toh mere dil mein ho. ♡",
    "Aaj dil thoda bhaari ho? No fixing, bas ek tight Delhi wala hug. 🫂"
  ];
  let noteIndex = 0;
  nextNoteButton.addEventListener("click", () => {
    noteIndex = (noteIndex + 1) % notes.length;
    document.querySelector(".tiny-note-card p").textContent = notes[noteIndex];
  });
}

const promiseButton = document.querySelector("#promise-button");
if (promiseButton) {
  const response = document.querySelector("#promise-response");
  const showResponse = (text) => {
    response.textContent = text;
    response.hidden = false;
  };

  promiseButton.addEventListener("click", () => {
    showResponse("Promise accepted, madam. Rona aaye toh ro lena, phir jab ready ho apna agla chhota step choose karna. Tumhe har cheez akele solve nahi karni—help maangna bhi strength hai. Proud of you. 🤍");
  });

  document.querySelector("#reset-button").addEventListener("click", () => {
    showResponse("Theek hai, madam. Bas yaad rakho: ek tough din tumhari poori kahani nahi hota. Rukna, sochna, ek practical step lena—apni pace par. Delhi se ek hug. 🫂");
  });

  const resetToggle = document.querySelector("#soft-reset-toggle");
  const resetContent = document.querySelector("#soft-reset-content");
  resetToggle.addEventListener("click", () => {
    const isExpanded = resetToggle.getAttribute("aria-expanded") === "true";
    resetToggle.setAttribute("aria-expanded", String(!isExpanded));
    resetContent.hidden = isExpanded;
    resetToggle.lastElementChild.textContent = isExpanded ? "＋" : "−";
  });
}
