(function () {
  function genCustomerId() {
    var str = "";
    for (var i = 0; i < 6; i++)
      str += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    return str;
  }

  async function fetchChatbot(chatbotId) {
    try {
      const response = await fetch("http://localhost:8000/getwebsitedetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatbot_id: chatbotId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const website = await response.json();
      return website.website;
    } catch (error) {
      console.error("Error fetching chatbot config:", error);
      return null;
    }
  }

  var script =
    document.currentScript || document.querySelector("script[data-id]");
  var chatbotId = script.getAttribute("data-id");

  fetchChatbot(chatbotId)
    .then((config) => {
      if (config) {
        chatHeader.innerHTML = `
            <span>${config.website}</span>
            <span class="close-btn">&times;</span>
          `;

        var closeBtn = chatHeader.querySelector(".close-btn");
        closeBtn.onclick = function () {
          chatWindow.style.display = "none";
          isOpen = false;
        };

        addMessage(config.default_message);

        // Populate Website Info tab
        infoContainer.innerHTML = `
            <div class="info-item">
              <h3>Website Name</h3>
              <p>${config.website}</p>
            </div>
            <div class="info-item">
              <h3>Contact</h3>
              <p>${config.contact}</p>
            </div>
            <div class="info-item">
              <h3>Default Questions</h3>
              <ul class="default-questions">
                ${
                  config.default_questions &&
                  config.default_questions
                    .map((question) => `<li>${question}</li>`)
                    .join("")
                }
              </ul>
            </div>
          `;

        // Add click event for default questions
        infoContainer
          .querySelectorAll(".default-questions li")
          .forEach((item) => {
            item.addEventListener("click", function () {
              chatTabs.querySelector('[data-tab="chat"]').click();
              input.value = this.textContent;
              sendMessage(chatbotId);
            });
          });

        sendBtn.onclick = function () {
          sendMessage(chatbotId);
        };

        input.onkeypress = function (e) {
          if (e.key === "Enter") {
            sendMessage(chatbotId);
          }
        };
      }
    })
    .catch((error) => {
      console.error("Error initializing chatbot:", error);
    });

  var customerId = localStorage.getItem("embeddable.customerId");
  if (customerId === null) {
    customerId = genCustomerId();
    localStorage.setItem("embeddable.customerId", customerId);
  }

  async function sendChatMessage(chatbotId, message) {
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatbot_id: chatbotId,
          message: message,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) return data.response;
      return "Sorry, there was an error processing your message.";
    } catch (error) {
      console.error("Error sending chat message:", error);
      return "Sorry, there was an error processing your message.";
    }
  }

  var button = document.createElement("div");
  button.className = "embeddable-chatbot-button";
  button.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';

  var chatWindow = document.createElement("div");
  chatWindow.className = "embeddable-chatbot-window";

  var chatHeader = document.createElement("div");
  chatHeader.className = "chatbot-header";

  var chatTabs = document.createElement("div");
  chatTabs.className = "chatbot-tabs";
  chatTabs.innerHTML =
    '<div class="chatbot-tab active" data-tab="chat">Chat</div><div class="chatbot-tab" data-tab="info">Website Info</div>';

  var chatContent = document.createElement("div");
  chatContent.className = "chatbot-content";

  var messagesContainer = document.createElement("div");
  messagesContainer.className = "chatbot-messages";

  var infoContainer = document.createElement("div");
  infoContainer.className = "chatbot-info";

  var inputArea = document.createElement("div");
  inputArea.className = "chatbot-input";
  inputArea.innerHTML =
    '<input type="text" placeholder="Type a message..."><button>Send</button>';

  chatContent.appendChild(messagesContainer);
  chatContent.appendChild(infoContainer);

  chatWindow.appendChild(chatHeader);
  chatWindow.appendChild(chatTabs);
  chatWindow.appendChild(chatContent);
  chatWindow.appendChild(inputArea);

  var widget = document.createElement("div");
  widget.className = "embeddable-chatbot-widget";
  widget.appendChild(button);
  widget.appendChild(chatWindow);

  // Add widget to page
  document.body.appendChild(widget);

  // Chat functionality
  var input = inputArea.querySelector("input");
  var sendBtn = inputArea.querySelector("button");

  function addMessage(content, isUser = false) {
    var messageElement = document.createElement("div");
    messageElement.className =
      "message " + (isUser ? "user-message" : "bot-message");
    messageElement.textContent = content;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function sendMessage(chatbotId) {
    var message = input.value.trim();
    if (message) {
      addMessage(message, true);
      input.value = "";
      sendChatMessage(chatbotId, message).then((response) => {
        addMessage(response);
      });
    }
  }

  // Event listeners
  var isOpen = false;
  button.onclick = function () {
    chatWindow.style.display = isOpen ? "none" : "flex";
    isOpen = !isOpen;
  };

  // Tab functionality
  chatTabs.addEventListener("click", function (e) {
    if (e.target.classList.contains("chatbot-tab")) {
      chatTabs
        .querySelectorAll(".chatbot-tab")
        .forEach((tab) => tab.classList.remove("active"));
      e.target.classList.add("active");
      var tabName = e.target.getAttribute("data-tab");
      messagesContainer.style.display = tabName === "chat" ? "block" : "none";
      infoContainer.style.display = tabName === "info" ? "block" : "none";
    }
  });

  var style = document.createElement("style");
  style.innerHTML = `
      .embeddable-chatbot-widget {
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 9999;
      }
      .embeddable-chatbot-button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #0057ff;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
      }
      .embeddable-chatbot-button:hover {
        background-color: #3a7bd5;
        transform: scale(1.05);
      }
      .embeddable-chatbot-window {
        display: none;
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 350px;
        height: 500px;
        border-radius: 12px;
        background-color: #ffffff;
        box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
        overflow: hidden;
        flex-direction: column;
        transition: all 0.3s ease;
      }
      .chatbot-header {
        background-color: #4a90e2;
        color: white;
        padding: 15px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .chatbot-tabs {
        display: flex;
        background-color: #f5f5f5;
        border-bottom: 1px solid #e0e0e0;
      }
      .chatbot-tab {
        flex: 1;
        text-align: center;
        padding: 10px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      .chatbot-tab.active {
        background-color: #ffffff;
        border-bottom: 2px solid #4a90e2;
      }
      .chatbot-content {
        flex-grow: 1;
        overflow-y: auto;
        padding: 15px;
        background-color: #f9f9f9;
      }
      .chatbot-messages {
        display: none;
      }
      .chatbot-info {
        display: none;
      }
      .chatbot-input {
        display: flex;
        padding: 10px;
        background-color: white;
        border-top: 1px solid #e0e0e0;
      }
      .chatbot-input input {
        flex-grow: 1;
        border: 1px solid #e0e0e0;
        border-radius: 20px;
        outline: none;
        padding: 8px 15px;
        font-size: 14px;
      }
      .chatbot-input button {
        background-color: #4a90e2;
        color: white;
        border: none;
        border-radius: 20px;
        padding: 8px 15px;
        margin-left: 10px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      .chatbot-input button:hover {
        background-color: #3a7bd5;
      }
      .message {
        margin-bottom: 10px;
        max-width: 80%;
      }
      .user-message {
        background-color: #4a90e2;
        color: white;
        padding: 10px 15px;
        border-radius: 18px 18px 0 18px;
        margin-left: auto;
        display: inline-block;
      }
      .bot-message {
        background-color: #e9e9e9;
        color: #333;
        padding: 10px 15px;
        border-radius: 18px 18px 18px 0;
        display: inline-block;
      }
      .close-btn {
        cursor: pointer;
        font-size: 20px;
      }
      .info-item {
        margin-bottom: 15px;
      }
      .info-item h3 {
        margin: 0 0 5px 0;
        font-size: 16px;
        color: #4a90e2;
      }
      .info-item p {
        margin: 0;
        font-size: 14px;
      }
      .default-questions {
        list-style-type: none;
        padding: 0;
      }
      .default-questions li {
        cursor: pointer;
        padding: 5px 0;
        color: #4a90e2;
      }
      .default-questions li:hover {
        text-decoration: underline;
      }
    `;
  document.head.appendChild(style);
})();
