(function () {
  var script =
    document.currentScript || document.querySelector("script[data-id]");
  var chatbotId = script.getAttribute("data-id");
  var iframe = document.createElement("iframe");
  iframe.className = "embeddable-chatbot";
  iframe.src = "http://localhost:5173/chat/" + chatbotId;

  var bubble = document.createElement("div");
  bubble.className = "embeddable-chatbot-button";
  bubble.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';

  var isChatbotOpen = false;

  function toggleChatbot() {
    isChatbotOpen = !isChatbotOpen;
    iframe.style.display = isChatbotOpen ? "block" : "none";
    bubble.classList.toggle("active", isChatbotOpen);
    if (isChatbotOpen) {
      resizeChatbot();
    }
  }

  bubble.onclick = toggleChatbot;

  function resizeChatbot() {
    var windowWidth = window.innerWidth;

    if (windowWidth <= 480) {
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.bottom = "0";
      iframe.style.right = "0";
      iframe.style.borderRadius = "0";
    } else {
      iframe.style.width = "400px";
      iframe.style.height = "600px";
      iframe.style.bottom = "80px";
      iframe.style.right = "40px";
      iframe.style.borderRadius = "10px";
    }
  }

  window.addEventListener("resize", function () {
    if (isChatbotOpen) {
      resizeChatbot();
    }
  });

  var style = document.createElement("style");

  style.innerHTML = `
    .embeddable-chatbot {
      position: fixed;
      border: none;
      box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
      display: none;
      transition: all 0.3s ease;
      z-index: 1000;
    }
    
    .embeddable-chatbot-button {
      position: fixed;
      bottom: 15px;
      right: 15px;
      width: 50px;
      height: 50px;
      border-radius: 30px;
      background-color: #0057ff;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      select: none;
      transition: all 0.3s ease;
      z-index: 1001;
    }

    .embeddable-chatbot-button:active {
      transform: scale(0.5);
    }

    @media (max-width: 480px) {
      .embeddable-chatbot-button {
        bottom: 10px;
        right: 10px;
        width: 50px;
        height: 50px;
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(bubble);
  document.body.appendChild(iframe);
})();
