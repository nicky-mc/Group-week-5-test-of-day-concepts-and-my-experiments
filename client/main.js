const messageForm = document.getElementById("message-form");
const messageContainer = document.getElementById("message-container");
const openPopupButton = document.getElementById("btn-open-popup");
const closePopupButton = document.getElementById("btn-close-popup");

function togglePopup() {
  const overlay = document.getElementById("popupOverlay");
  overlay.classList.toggle("show");
}

openPopupButton.addEventListener("click", togglePopup);
closePopupButton.addEventListener("click", togglePopup);

messageForm.addEventListener("submit", handleSubmitButton);

function addForumMessageToPage(data) {
  const forumMessageElement = document.createElement("div");
  forumMessageElement.classList.add("forum-message");

  const date = data.date ? new Date(data.date) : new Date();
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
  messageContainer.appendChild(forumMessageElement);

  // Add event listeners for the like and delete buttons
  forumMessageElement
    .querySelector(".likeButton")
    .addEventListener("click", () => handleLike(data.id, forumMessageElement));
  forumMessageElement
    .querySelector(".deleteButton")
    .addEventListener("click", () =>
      handleDelete(data.id, forumMessageElement)
    );
}

async function fetchData() {
  const response = await fetch("http://localhost:8080/data");
  const forumMessage = await response.json();
  forumMessage.sort((a, b) => new Date(b.date) - new Date(a.date));
  messageContainer.innerHTML = "";
  forumMessage.forEach((data) => {
    addForumMessageToPage(data);
  });
}

async function handleSubmitButton(event) {
  event.preventDefault();
  const formData = new FormData(messageForm);
  const formValues = Object.fromEntries(formData);
  formValues.date = new Date().toISOString();
  console.log(formValues);

  const response = await fetch("http://localhost:8080/add-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValues),
  });
  const newMessage = await response.json();
  addForumMessageToPage(newMessage);
  messageForm.reset();
}

async function handleLike(id, element) {
  console.log(`Like button clicked for message id: ${id}`);
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
    element.remove(); // Remove the message element from the DOM
    console.log(`Deleted message with id: ${id}`);
  }
}

fetchData();
