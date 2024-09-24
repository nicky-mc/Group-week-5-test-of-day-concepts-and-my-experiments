const messageForm = document.getElementById("message-form");
const openPopupButton = document.getElementById("btn-open-popup");
const closePopupButton = document.getElementById("btn-close-popup");
const tabButtons = document.querySelectorAll(".tab-button");
let activeBoard = "chat";

function togglePopup() {
  const overlay = document.getElementById("popupOverlay");
  overlay.classList.toggle("show");
}

openPopupButton.addEventListener("click", togglePopup);
closePopupButton.addEventListener("click", togglePopup);

messageForm.addEventListener("submit", handleSubmitButton);

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".message-container").forEach((container) => {
      container.classList.remove("active");
    });
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.remove("active");
    });

    activeBoard = button.dataset.board;
    document.getElementById(activeBoard).classList.add("active");
    button.classList.add("active");
    fetchData(activeBoard);
  });
});

function addForumMessageToPage(data, board) {
  const forumMessageElement = document.createElement("div");
  forumMessageElement.classList.add("forum-message");

  const date = new Date(data.timestamp);
  const formattedDate = date.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  forumMessageElement.innerHTML = `
    <p>
      Name: ${data.name} <br> 
      Location: ${data.location} <br>
      Message: ${data.message_post} <br>
      Date: ${formattedDate} <br>
      Likes: <span class="like-count">${data.likes || 0}</span> <br>
    </p>
    <button class="likeButton" data-id="${data.id}">Like</button>
    <button class="deleteButton" data-id="${data.id}">Delete</button>
  `;
  document.getElementById(board).appendChild(forumMessageElement);

  forumMessageElement
    .querySelector(".likeButton")
    .addEventListener("click", () => handleLike(data.id, forumMessageElement));
  forumMessageElement
    .querySelector(".deleteButton")
    .addEventListener("click", () =>
      handleDelete(data.id, forumMessageElement)
    );
}

async function fetchData(board) {
  const response = await fetch(`http://localhost:8080/data?board=${board}`);
  const forumMessages = await response.json();
  forumMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  document.getElementById(board).innerHTML = "";
  forumMessages.forEach((data) => {
    addForumMessageToPage(data, board);
  });
}

async function handleSubmitButton(event) {
  event.preventDefault();
  const formData = new FormData(messageForm);
  const formValues = Object.fromEntries(formData);

  // Check for null or empty values
  if (
    !formValues.name.trim() ||
    !formValues.location.trim() ||
    !formValues.textBox.trim()
  ) {
    alert("Please fill out all fields.");
    return;
  }

  formValues.board = activeBoard;

  try {
    const response = await fetch("http://localhost:8080/add-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    const newMessage = await response.json();
    addForumMessageToPage(newMessage, activeBoard);
    messageForm.reset();
    togglePopup(); // Close the popup after submission
  } catch (error) {
    console.error("Error submitting form:", error);
  }
}

async function handleLike(id, element) {
  const response = await fetch(`http://localhost:8080/data/${id}/like`, {
    method: "POST",
  });
  const updatedData = await response.json();
  element.querySelector(".like-count").textContent = updatedData.likes;
}

async function handleDelete(id, element) {
  const confirmed = confirm("Are you sure you want to delete this post?");
  if (confirmed) {
    await fetch(`http://localhost:8080/data/${id}`, {
      method: "DELETE",
    });
    element.remove();
  }
}

// Load the default board on startup
fetchData(activeBoard);
