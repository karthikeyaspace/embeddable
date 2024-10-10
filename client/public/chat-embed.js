(function () {
    var script = document.currentScript || document.querySelector("script[data-id]");
    var chatbotId = script.getAttribute("data-id");
    var iframe = document.createElement("iframe");
    iframe.src = "http://localhost:5173/chat/" + chatbotId;
    iframe.style.position = "fixed";
    iframe.style.bottom = "20px";
    iframe.style.right = "20px";
    iframe.style.width = "400px";
    iframe.style.height = "600px";
    iframe.style.border = "none";
    iframe.style.zIndex = "9999";
    document.body.appendChild(iframe);
  })();