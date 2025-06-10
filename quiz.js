  // Quiz Application JavaScript Code
  const questions = [
  {
  question: "What is the capital city of West Bengal?",
  options: ["Kolkata", "Mumbai", "Bangalore", "Delhi"],
  answer: 0,
  explanation: "Kolkata has been the capital of West Bengal since British India."
  },
  {
  question: "How many letters are there in the English alphabet?",
  options: ["7", "2", "26", "50"],
  answer: 2,
  explanation: "The modern English alphabet is a Latin alphabet consisting of 26 letters."
  },
  {
  question: "Which is the largest ocean on Earth?",
  options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
  answer: 3,
  explanation: "The Pacific Ocean covers about 63 million square miles and contains more than half of the free water on Earth."
  },
  {
  question: "What is the boiling point of water at sea level?",
  options: ["90°C", "50°C", "100°C", "150°C"],
  answer: 2,
  explanation: "At sea level, water boils at 100°C (212°F). This changes with altitude."
  },
  {
  question: "Which planet is known as the Red Planet?",
  options: ["Venus", "Mars", "Jupiter", "Saturn"],
  answer: 1,
  explanation: "Mars appears reddish due to iron oxide (rust) on its surface."
  }
  ];

  let currentQuestion = 0;
  let score = 0;
  let userAnswers = Array(questions.length).fill(null);
  let quizSubmitted = false;

  // Initialize the quiz
  window.onload = () => {
      loadQuestion();
      updateNavButtons();
      
      // Load dark mode preference
      if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark');
        document.getElementById('darkModeBtn').textContent = '☀️ Light Mode';
      }
      
      // Load and display previous results more prominently
      const saved = JSON.parse(localStorage.getItem("quizResult"));
      if (saved) {
        const lastAttemptDate = new Date(saved.timestamp);
        const formattedDate = lastAttemptDate.toLocaleDateString();
        const formattedTime = lastAttemptDate.toLocaleTimeString();
        
        document.getElementById("result").innerHTML = `
          <div style="background: rgba(0,0,0,0.05); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: var(--primary);">Previous Attempt</h3>
            <p><strong>Score:</strong> ${saved.score}/${questions.length}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${formattedTime}</p>
            <p><strong>Percentage:</strong> ${saved.percentage}%</p>
          </div>
        `;
      }
    };

  function loadQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question").innerText = q.question;
  document.getElementById("options").innerHTML = "";
  document.getElementById("question-count").innerText = `Question ${currentQuestion + 1} of ${questions.length}`;
  document.getElementById("progress").style.width = `${((currentQuestion) / questions.length) * 100}%`;

  // Create options
  q.options.forEach((opt, i) => {
  const div = document.createElement("div");
  div.innerHTML = opt;

  // Highlight if already answered
  if (userAnswers[currentQuestion] === i) {
  div.classList.add("selected");
  }

  div.addEventListener("click", () => selectOption(i));
  document.getElementById("options").appendChild(div);
  });

  updateNavButtons();
  }

  function selectOption(index) {
  if (quizSubmitted) return;

  // Remove previous selection
  const options = document.querySelectorAll('#options div');
  options.forEach(opt => opt.classList.remove("selected"));

  // Select new option
  options[index].classList.add("selected");
  userAnswers[currentQuestion] = index;

  updateNavButtons();
  }

  function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
  currentQuestion++;
  loadQuestion();
  } else {
  // Show submit button on last question
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("submitBtn").style.display = "inline-block";
  }
  }

  function prevQuestion() {
  if (currentQuestion > 0) {
  currentQuestion--;
  loadQuestion();
  }
  }

  function updateNavButtons() {
  document.getElementById("prevBtn").disabled = currentQuestion === 0;
  document.getElementById("nextBtn").disabled = userAnswers[currentQuestion] === null;

  // Show submit button only on last question when answered
  if (currentQuestion === questions.length - 1 && userAnswers[currentQuestion] !== null) {
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("submitBtn").style.display = "inline-block";
  } else {
  document.getElementById("nextBtn").style.display = "inline-block";
  document.getElementById("submitBtn").style.display = "none";
  }
  }
    function submitQuiz() {
      quizSubmitted = true;
      score = 0;
      
      // Calculate score
      questions.forEach((q, i) => {
        if (userAnswers[i] === q.answer) {
          score++;
        }
      });
      
      // Show results
      document.getElementById("question").innerText = "🎉 Quiz Completed!";
      document.getElementById("options").innerHTML = "";
      document.getElementById("progress").style.width = "100%";
      document.getElementById("prevBtn").style.display = "none";
      document.getElementById("nextBtn").style.display = "none";
      document.getElementById("submitBtn").style.display = "none";
      document.getElementById("restartBtn").style.display = "inline-block";
      
      // Display score
      const percentage = Math.round((score / questions.length) * 100);
      document.getElementById("result").innerHTML = `
        <div class="score-display">
          <div class="score-circle">${score}/${questions.length}</div>
          <p>You scored ${percentage}%</p>
          <p>${getResultMessage(percentage)}</p>
        </div>
      `;
      
      // Save results with timestamp
      const result = {
        score: score,
        userAnswers: userAnswers,
        timestamp: new Date().toISOString(),
        percentage: percentage
      };
      localStorage.setItem("quizResult", JSON.stringify(result));
      
      // Show detailed answers
      showAnswerReview();
    }

  function getResultMessage(percentage) {
  if (percentage >= 90) return "Excellent! You're a quiz master!";
  if (percentage >= 70) return "Great job! You know your stuff!";
  if (percentage >= 50) return "Good effort! Keep learning!";
  return "Keep practicing! You'll get better!";
  }

  function showAnswerReview() {
  const userAnswerDiv = document.getElementById("userAnswer");
  userAnswerDiv.innerHTML = "<h3>Answer Review</h3>";

  questions.forEach((q, i) => {
  const ua = userAnswers[i];
  const isCorrect = ua === q.answer;

  userAnswerDiv.innerHTML += `
  <p style="background:${isCorrect ? 'var(--correct)' : 'var(--wrong)'};">
  <strong>Q${i + 1}: ${q.question}</strong><br><br>
  <strong>Your answer:</strong> ${ua !== null ? q.options[ua] : 'Not answered'}<br>
  <strong>${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</strong><br>
  ${!isCorrect ? `<strong>Correct answer:</strong> ${q.options[q.answer]}` : ''}<br><br>
  <em>${q.explanation}</em>
  </p>
  `;
  });
  }

  function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  userAnswers = Array(questions.length).fill(null);
  quizSubmitted = false;

  document.getElementById("prevBtn").style.display = "inline-block";
  document.getElementById("nextBtn").style.display = "inline-block";
  document.getElementById("restartBtn").style.display = "none";
  document.getElementById("userAnswer").innerHTML = "";


  const saved = JSON.parse(localStorage.getItem("quizResult"));
  if (saved) {
    const lastAttemptDate = new Date(saved.timestamp);
    const formattedDate = lastAttemptDate.toLocaleDateString();
    const formattedTime = lastAttemptDate.toLocaleTimeString();
    
    document.getElementById("result").innerHTML = `
      <div style="background: rgba(0,0,0,0.05); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: var(--primary);">Previous Attempt</h3>
        <p><strong>Score:</strong> ${saved.score}/${questions.length}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${formattedTime}</p>
        <p><strong>Percentage:</strong> ${saved.percentage}%</p>
      </div>
    `;
  } else {
    document.getElementById("result").innerHTML = "";
  }

  loadQuestion();
  }

  function toggleDarkMode() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
  localStorage.setItem('darkMode', 'enabled');
  document.getElementById('darkModeBtn').textContent = '☀️ Light Mode';
  } else {
  localStorage.setItem('darkMode', 'disabled');
  document.getElementById('darkModeBtn').textContent = '🌙 Dark Mode';
  }
  }