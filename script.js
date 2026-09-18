/* =====================================================
   FORMSPREE
===================================================== */

const formspreeURL = "https://formspree.io/f/xgavekbg";

/* =====================================================
   QUESTION PAGE
===================================================== */

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const response = document.getElementById("response");

/* =========================
   YES BUTTON
========================= */

if (yesBtn) {
  yesBtn.addEventListener("click", async () => {
    yesBtn.disabled = true;

    noBtn.style.display = "none";

    /*
            Save YES locally so the next page knows
            that she came from the YES button.
        */

    localStorage.setItem("answer", "YES ❤️");

    /*
            Send response to Formspree
        */

    await sendResponse("YES ❤️");

    /*
            Go to planning form
        */

    window.location.href = "form.html";
  });
}

/* =========================
   NO BUTTON
========================= */

let attempts = 0;

function moveNoButton() {
  if (!noBtn) return;

  attempts++;

  const padding = 20;

  const maxX = window.innerWidth - noBtn.offsetWidth - padding;

  const maxY = window.innerHeight - noBtn.offsetHeight - padding;

  const x = Math.random() * Math.max(maxX, padding);

  const y = Math.random() * Math.max(maxY, padding);

  noBtn.style.position = "fixed";

  noBtn.style.left = `${x}px`;

  noBtn.style.top = `${y}px`;

  if (response) {
    if (attempts === 3) {
      response.textContent = "😂 Nice try!";
    }

    if (attempts === 6) {
      response.textContent = "You really want that NO button? 😭😂";
    }

    if (attempts === 9) {
      response.textContent = "Okay okay 😂 you are determined!";
    }
  }
}

/*
    Keep the existing runaway behavior.
*/

if (noBtn) {
  noBtn.addEventListener("mouseover", moveNoButton);

  noBtn.addEventListener("touchstart", moveNoButton);

  /*
        If she actually manages to click No,
        accept the answer.
    */

  noBtn.addEventListener("click", async () => {
    if (response) {
      response.textContent = "That's okay 😊 Thanks for being honest.";

      response.style.color = "#555";
    }

    noBtn.style.position = "relative";

    noBtn.style.left = "auto";

    noBtn.style.top = "auto";

    localStorage.setItem("answer", "NO");

    await sendResponse("NO");
  });
}

/* =====================================================
   PLANNING FORM
===================================================== */

const planForm = document.getElementById("planForm");

const planSelect = document.getElementById("plan");

const otherPlanGroup = document.getElementById("otherPlanGroup");

const otherPlan = document.getElementById("otherPlan");

/* =========================
   OTHER PLAN
========================= */

if (planSelect) {
  planSelect.addEventListener("change", () => {
    if (planSelect.value === "Something else") {
      otherPlanGroup.style.display = "block";

      otherPlan.required = true;
    } else {
      otherPlanGroup.style.display = "none";

      otherPlan.required = false;
    }
  });
}

/* =========================
   FORM SUBMISSION
========================= */

if (planForm) {
  planForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const date = document.getElementById("date").value;

    const time = document.getElementById("time").value;

    let plan = planSelect.value;

    const message = document.getElementById("message").value;

    /*
                If she selected "Something else",
                use her custom plan.
            */

    if (plan === "Something else") {
      plan = otherPlan.value;
    }

    const formResponse = document.getElementById("formResponse");

    formResponse.textContent = "Saving your plan... 💌";

    /*
                Save the information locally.

                This allows invitation.html to
                display the choices.
            */

    localStorage.setItem("date", date);

    localStorage.setItem("time", time);

    localStorage.setItem("plan", plan);

    localStorage.setItem("message", message);

    /*
                Send everything to Formspree
            */

    const formData = new FormData();

    formData.append("name", "Worship");

    formData.append("response", "YES ❤️");

    formData.append("date", date);

    formData.append("time", time);

    formData.append("plan", plan);

    formData.append("message", message);

    try {
      const result = await fetch(formspreeURL, {
        method: "POST",

        body: formData,

        headers: {
          Accept: "application/json",
        },
      });

      if (result.ok) {
        formResponse.textContent = "Plan saved! ❤️";

        /*
                        Small delay before
                        opening invitation.
                    */

        setTimeout(() => {
          window.location.href = "invitation.html";
        }, 800);
      } else {
        formResponse.textContent = "Something went wrong. Please try again.";
      }
    } catch (error) {
      console.error(error);

      formResponse.textContent =
        "Couldn't send the plan. Please check your connection.";
    }
  });
}

/* =====================================================
   INVITATION PAGE
===================================================== */

const invitationDate = document.getElementById("invitationDate");

const invitationTime = document.getElementById("invitationTime");

const invitationPlan = document.getElementById("invitationPlan");

const invitationMessage = document.getElementById("invitationMessage");

const invitationMessageContainer = document.getElementById(
  "invitationMessageContainer",
);

if (invitationDate) {
  const date = localStorage.getItem("date");

  const time = localStorage.getItem("time");

  const plan = localStorage.getItem("plan");

  const message = localStorage.getItem("message");

  /* =========================
       FORMAT DATE
    ========================= */

  if (date) {
    const dateObject = new Date(date + "T00:00:00");

    invitationDate.textContent = dateObject.toLocaleDateString("en-ZA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } else {
    invitationDate.textContent = "Not selected";
  }

  /* =========================
       TIME
    ========================= */

  if (time) {
    invitationTime.textContent = time;
  } else {
    invitationTime.textContent = "Not selected";
  }

  /* =========================
       PLAN
    ========================= */

  if (plan) {
    invitationPlan.textContent = plan;
  } else {
    invitationPlan.textContent = "Not selected";
  }

  /* =========================
       MESSAGE
    ========================= */

  if (message && message.trim() !== "") {
    invitationMessage.textContent = message;
  } else {
    invitationMessageContainer.style.display = "none";
  }

  /*
        Celebration when invitation opens
    */

  createCelebration();
}

/* =====================================================
   FORMSPREE FUNCTION
===================================================== */

async function sendResponse(answer) {
  const formData = new FormData();

  formData.append("name", "Worship");

  formData.append("response", answer);

  try {
    await fetch(formspreeURL, {
      method: "POST",

      body: formData,

      headers: {
        Accept: "application/json",
      },
    });

    console.log("Response sent successfully.");
  } catch (error) {
    console.error("Error sending response:", error);
  }
}

/* =====================================================
   CELEBRATION
===================================================== */

function createCelebration() {
  const celebration = document.getElementById("celebration");

  if (!celebration) return;

  const emojis = ["💖", "✨", "🎉", "💕", "⭐", "🥳"];

  for (let i = 0; i < 60; i++) {
    const item = document.createElement("span");

    item.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    item.style.left = Math.random() * 100 + "vw";

    item.style.top = Math.random() * 100 + "vh";

    item.style.fontSize = Math.random() * 20 + 20 + "px";

    item.style.setProperty("--x", Math.random());

    item.style.setProperty("--y", Math.random());

    celebration.appendChild(item);

    setTimeout(() => {
      item.remove();
    }, 2000);
  }
}
