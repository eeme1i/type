document.addEventListener("DOMContentLoaded", () => {
  const appElement = document.querySelector("#app");
  if (!appElement) {
    console.error("App element not found!");
    return;
  }

  const textArea = document.getElementById("text");

  // initialize width from localStorage if set
  const storedWidth = localStorage.getItem("textAreaWidth");
  if (storedWidth) {
    textArea.style.width = storedWidth;
  }

  // observe width changes and save to localStorage
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      // offsetWidth includes padding and scrollbar in border-box sizing
      const width = `${entry.target.offsetWidth}px`;
      localStorage.setItem("textAreaWidth", width);
    }
  });
  resizeObserver.observe(textArea);

  const fontSizeInput = document.getElementById("font-size");
  const fontSizeValue = document.getElementById("font-size-value");
  const themeToggleButton = document.getElementById("theme-toggle");
  const timeDisplay = document.getElementById("time");
  const fullscreenToggleButton = document.getElementById("fullscreen-toggle");
  const downloadBtn = document.getElementById("download-btn");

  // toggle fullscreen
  fullscreenToggleButton.addEventListener("click", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      fullscreenToggleButton.innerText = "fullscreen";
    } else {
      document.documentElement.requestFullscreen();
      fullscreenToggleButton.innerText = "exit";
    }
  });

  // download written content as .txt file
  downloadBtn.addEventListener("click", () => {
    const text = textArea.value;
    if (!text) {
      return;
    }
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "typing.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // set time
  const date = new Date();
  timeDisplay.innerText = getFormattedTime(date);

  // update the time every second
  setInterval(() => {
    const date = new Date();

    timeDisplay.innerText = getFormattedTime(date);
  }, 1000);

  function getFormattedTime(date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function applyTheme(theme) {
    if (theme === "light") {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  }

  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    applyTheme(storedTheme);
  }

  themeToggleButton.addEventListener("click", () => {
    const isLightMode = document.body.classList.toggle("light");
    const newTheme = isLightMode ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  });

  // check if there is a value in local storage
  const storedTextValue = localStorage.getItem("text");
  if (storedTextValue) {
    textArea.value = storedTextValue;
    updateStats(storedTextValue);
  }

  // check if there is a value in local storage for font size and apply it after the next frame
  requestAnimationFrame(() => {
    const storedFontSizeValue = localStorage.getItem("fontSize");
    if (storedFontSizeValue) {
      fontSizeInput.value = storedFontSizeValue;
      fontSizeValue.innerText = storedFontSizeValue;
      textArea.style.fontSize = `${storedFontSizeValue}px`;
    }
  });

  // on change store the value in local storage
  textArea.addEventListener("input", () => {
    localStorage.setItem("text", textArea.value);
    updateStats(textArea.value);
  });

  // on change update the font size
  fontSizeInput.addEventListener("input", () => {
    const fontSize = fontSizeInput.value;
    fontSizeValue.innerText = fontSize;
    textArea.style.fontSize = `${fontSize}px`;
    localStorage.setItem("fontSize", fontSize);
  });

  function updateStats(text) {
    const words = text.split(/\s+/).filter((word) => word.length > 0).length;
    // ignore new lines
    const characters = text.replace(/\n/g, "").length;
    document.getElementById("words").innerText = words.toString();
    document.getElementById("characters").innerText = characters.toString();
  }
});
