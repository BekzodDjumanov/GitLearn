// THIS IS FOR HAMBURGER TRIGGER
const checkbox = document.querySelector("#hamburger input[type='checkbox']");
const dropdownMenu = document.getElementById("dropdownMenu");

// THIS IS SPECIFICALLY FOR THE DROP DOWN ON SMALLER SCREENS (HEADER)
checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    dropdownMenu.style.display = "flex";

    gsap.fromTo(
      dropdownMenu,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  } else {
    gsap.to(dropdownMenu, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        dropdownMenu.style.display = "none";
      },
    });
  }
});

// THIS IS FOR TRIGGERING CONFETTI AND INITIATING EACH DATA TOPIC ON CLICK
// Get the confetti element
const confetti = document.getElementById("confetti");

// Shared function to load topic and handle confetti visibility
function handleTopicChange(topicId) {
  loadTopic(topicId);

  if (topicId === "conclusion") {
    confetti.style.opacity = "1";
  } else {
    confetti.style.opacity = "0";
  }
}

// Listen on submenu items
document.querySelectorAll(".submenu li").forEach((li) => {
  li.addEventListener("click", function () {
    const topicId = this.getAttribute("data-topic");
    handleTopicChange(topicId);
  });
});

// Listen on top-level menu items
document.querySelectorAll(".menu-item[data-topic]").forEach((li) => {
  li.addEventListener("click", function () {
    const topicId = this.getAttribute("data-topic");
    handleTopicChange(topicId);
  });
});

// THIS IS FOR CONFETTI AND ITS DESIGN
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
const numberOfPieces = 100;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function randomColor() {
  const colors = [
    "#f87171",
    "#fbbf24",
    "#34d399",
    "#60a5fa",
    "#a78bfa",
    "#f472b6",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function createPieces() {
  for (let i = 0; i < numberOfPieces; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      color: randomColor(),
      speed: Math.random() * 3 + 1,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 - 5,
    });
  }
}

function updatePieces() {
  for (let p of pieces) {
    p.y += p.speed;
    p.rotation += p.rotationSpeed;

    if (p.y > canvas.height) {
      p.y = -10;
      p.x = Math.random() * canvas.width;
    }
  }
}

function drawPieces() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of pieces) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  }
}

function loop() {
  updatePieces();
  drawPieces();
  requestAnimationFrame(loop);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
createPieces();
loop();

// THIS IS FOR GSAP ANIMATION WHEN DATA-TOPIC IS CLICKED
const content = document.getElementById("content");

function loadTopic(topicId) {
  // Fade out old content first
  gsap.to(content, {
    duration: 0.5,
    opacity: 0,
    onComplete: () => {
      // Fetch new HTML
      fetch(`topics/${topicId}.html`)
        .then((res) => res.text())
        .then((html) => {
          content.innerHTML = html;
          // Fade new content in
          gsap.to(content, { duration: 0.5, opacity: 1, ease: "power2.inOut" });
        })
        .catch((err) => {
          console.error("Error loading topic:", err);
          gsap.to(content, { duration: 0.5, opacity: 1, ease: "power2.inOut" });
        });
    },
  });
}

// THIS IS FOR COLOR STAYING RED WHEN CLICKED ON SUBMENU LI
document.querySelectorAll(".submenu li, .nested-submenu li").forEach((li) => {
  li.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent bubbling up

    // Remove active from ALL li elements in all submenus
    document
      .querySelectorAll(".submenu li, .nested-submenu li")
      .forEach((item) => {
        item.classList.remove("active");
      });

    // Add active only to the clicked li
    li.classList.add("active");
  });
});

// THIS IS FOR WHEN EXPANDING PRIMARY TOPICS
// Expand/collapse submenus and rotate icon inside menu header
document.querySelectorAll(".menu-header").forEach((header) => {
  header.addEventListener("click", () => {
    const submenu = header.nextElementSibling;
    const icon = header.querySelector("i");

    if (
      !submenu ||
      (!submenu.classList.contains("submenu") &&
        !submenu.classList.contains("nested-submenu"))
    )
      return;

    const isOpen = submenu.style.maxHeight && submenu.style.maxHeight !== "0px";

    if (isOpen) {
      // Animate closing submenu
      gsap.to(submenu, {
        maxHeight: 0,
        duration: 0.3,
        ease: "power1.inOut",
      });
      icon.classList.remove("rotate");
      submenu.style.overflow = "hidden";
    } else {
      // Animate opening submenu

      gsap.to(submenu, {
        maxHeight: submenu.scrollHeight,
        duration: 0.3,
        ease: "power1.inOut",
        onStart: () => {
          icon.classList.add("rotate"); // add rotate BEFORE animation starts
        },
      });

      // Animate parent submenus to adjust height smoothly
      let parent = submenu.parentElement.closest(".submenu, .nested-submenu");
      while (parent) {
        submenu.style.overflow = "visible";
        gsap.to(parent, {
          maxHeight: parent.scrollHeight,
          duration: 0.3,
          ease: "power1.inOut",
        });
        parent = parent.parentElement.closest(".submenu, .nested-submenu");
      }
    }
  });
});

// FOR SIDE BAR ON SMALLER SCREENS
const checkbox2 = document.getElementById("checkbox2");
const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".overlay");

function hideSidebar() {
  checkbox2.checked = false;
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
}

checkbox2.addEventListener("change", () => {
  if (checkbox2.checked) {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  } else {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  }
});

// Hide sidebar if overlay is clicked
overlay.addEventListener("click", hideSidebar);

// THIS HIDES THE INTRODUCTION WHEN PROMPTED TO THE PAGE
// Change content when subtopic clicked
document.querySelectorAll(".submenu li").forEach((item) => {
  item.addEventListener("click", () => {
    const key = item.getAttribute("data-topic");
    document.getElementById("topic-title").textContent = topics[key].title;
    document.getElementById("topic-desc").textContent = topics[key].desc;

    ["desc-1", "desc-2", "desc-3", "desc-4", "desc-5", "desc-6"].forEach(
      (id) => {
        document.getElementById(id).style.display = "none";
      }
    );
  });
});
// FILTERING LOGIC
const searchInput = document.querySelector(".search-input");
const resultsList = document.querySelector(".search-results");

// Get all list items with data-topic attribute
const topicItems = document.querySelectorAll("[data-topic]");

// Build a search index
const topics = Array.from(topicItems).map((item) => ({
  text: item.textContent.trim(),
  element: item,
}));

searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  resultsList.innerHTML = "";

  if (!query) {
    resultsList.style.display = "none";
    return;
  }

  const matchedTopics = topics.filter((topic) =>
    topic.text.toLowerCase().includes(query)
  );

  if (matchedTopics.length === 0) {
    resultsList.innerHTML = "<li>No results found</li>";
  } else {
    matchedTopics.forEach((topic) => {
      const li = document.createElement("li");
      li.innerHTML = `<i class="fa-regular fa-file" style="margin-right: 8px; color: white;"></i>${topic.text}`;
      li.addEventListener("click", () => {
        const topicId = topic.element.getAttribute("data-topic");
        if (topicId) {
          handleTopicChange(topicId);
        }
        resultsList.style.display = "none";
        searchInput.value = topic.text;
      });
      resultsList.appendChild(li);
    });
  }

  resultsList.style.display = "block";
});

// Hide results if clicking outside
document.addEventListener("click", function (e) {
  if (!searchInput.contains(e.target) && !resultsList.contains(e.target)) {
    resultsList.style.display = "none";
  }
});

// THIS HIDES THE DROP DOWN WHEN RESIZING HEADER
window.addEventListener("resize", () => {
  if (window.innerWidth > 900 && checkbox.checked) {
    checkbox.checked = false;
    dropdownMenu.style.pointerEvents = "none";
    gsap.set(dropdownMenu, { opacity: 0, y: -20 });
  }
});

// IDK
const sr = ScrollReveal({
  distance: "65px",
  duration: 2600,
  reset: true,
  once: true,
});
