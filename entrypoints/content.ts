import React from "react";
import { createRoot } from "react-dom/client";
import AutoReplyPopup from "./popup/AutoReplyPopup";
import image from "@/assets/sparkleStickIcon.png";
export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],
  main() {
    console.log("Hello LinkedIn content.");
    const observer = new MutationObserver(() => {
      setupInputListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function setupInputListeners() {
      const messageInputContainer = document.querySelector<HTMLElement>(
        ".msg-form__contenteditable"
      );
      if (
        messageInputContainer &&
        !messageInputContainer.hasAttribute("data-listener-added")
      ) {
        messageInputContainer.setAttribute("data-listener-added", "true");
        messageInputContainer.addEventListener("focus", showIconButton);
        messageInputContainer.addEventListener("click", (event) => {
          if (!messageInputContainer.contains(event.target as Node)) {
            hideIconButton();
          }
        });
      }
    }
    function showIconButton(event: FocusEvent) {
      const messageInputContainer = event.target as HTMLElement;
      if (!document.querySelector("#my-extension-icon")) {
        const iconButton = document.createElement("button");
        iconButton.id = "my-extension-icon";
        iconButton.innerHTML = `<img src="${image}" style="width:10px;height:10px;margin:2px" alt="Icon">`;
        iconButton.style.position = "absolute";
        iconButton.style.padding = "2px";
        iconButton.style.right = "10px";
        iconButton.style.bottom = "3px";
        iconButton.style.transform = "translateY(-50%)";
        iconButton.style.background = "white";
        iconButton.style.border = "none";
        iconButton.style.borderRadius = "7px";
        iconButton.style.cursor = "pointer";
        messageInputContainer.parentElement?.appendChild(iconButton);
        iconButton.addEventListener("click", (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          togglePopup();
        });
      }
    }

    function hideIconButton() {
      const iconButton =
        document.querySelector<HTMLButtonElement>("#my-extension-icon");
      if (iconButton) {
        iconButton.remove();
      }
    }

    function togglePopup() {
      let popupContainer = document.getElementById("react-popup-container");
      if (!popupContainer) {
        popupContainer = document.createElement("div");
        popupContainer.id = "react-popup-container";

        const messageInputContainer = document.querySelector(
          ".scaffold-layout__inner"
        );
        if (messageInputContainer && messageInputContainer.parentElement) {
          messageInputContainer.parentElement.style.position = "relative";
          messageInputContainer.parentElement.appendChild(popupContainer);
        } else {
          document.body.appendChild(popupContainer);
        }
        const root = createRoot(popupContainer);
        root.render(React.createElement(AutoReplyPopup));
      } else {
        popupContainer.remove();
      }
    }

    window.addEventListener("message", (event) => {
      if (
        event.data.type === "FROM_POPUP" &&
        event.data.action === "insertReply"
      ) {
        const messageInput = document.querySelector(
          ".msg-form__contenteditable"
        );
        if (messageInput) {
          const newParagraph = document.createElement("p");
          newParagraph.textContent = event.data.reply;
          messageInput.innerHTML = "";
          messageInput.appendChild(newParagraph);
          const inputEvent = new Event("input", { bubbles: true });
          messageInput.dispatchEvent(inputEvent);
        } else {
          console.error("LinkedIn message input not found!");
        }
      }
      // popup close krne ke liye
      else if (event.data.type === "CLOSE_POPUP") {
        const popupContainer = document.getElementById("react-popup-container");
        if (popupContainer) {
          popupContainer.remove();
        }
      }
    });
  },
});
