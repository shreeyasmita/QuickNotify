const form = document.getElementById("notificationForm");
const messageInput = document.getElementById("message");
const charCount = document.getElementById("charCount");
const feedback = document.getElementById("feedback");
const sendButton = document.getElementById("sendButton");

messageInput.addEventListener("input", () => {
  charCount.textContent = `${messageInput.value.length} / 3000`;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  feedback.hidden = true;
  sendButton.disabled = true;
  sendButton.querySelector("span:first-child").textContent = "Publishing...";

  const payload = {
    title: document.getElementById("title").value.trim(),
    category: document.getElementById("category").value,
    message: messageInput.value.trim()
  };

  try {
    const response = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Something went wrong.");

    feedback.className = "feedback success";
    feedback.textContent = `✓ ${result.message} Message ID: ${result.messageId || "created"}`;
    feedback.hidden = false;
    form.reset();
    charCount.textContent = "0 / 3000";
  } catch (error) {
    feedback.className = "feedback error";
    feedback.textContent = `Unable to send: ${error.message}`;
    feedback.hidden = false;
  } finally {
    sendButton.disabled = false;
    sendButton.querySelector("span:first-child").textContent = "Publish notification";
  }
});
