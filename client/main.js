const messageForm = document.getElementById("message-form");
const openPopupButton = document.getElementById("btn-open-popup");
const closePopupButton = document.getElementById("btn-close-popup");
const tabButtons = document.querySelectorAll(".tab-button");
const loadingIndicator = document.getElementById("loading");
let activeBoard = "chat";

function togglePopup() {
    const overlay = document.getElementById("popupOverlay");
    overlay.classList.toggle("show");
}

openPopupButton.addEventListener("click", togglePopup);
closePopupButton.addEventListener("click", togglePopup);

// Function to show loading indicator
function showLoadingIndicator() {
    loadingIndicator.style.display = "block"; // Show loading
}

// Function to hide loading indicator
function hideLoadingIndicator() {
    loadingIndicator.style.display = "none"; // Hide loading
}

messageForm.addEventListener("submit", handleSubmitButton);

// Tab switching logic
tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".message-container").forEach(container => {
            container.classList.remove("active");
        });
        document.querySelectorAll(".tab-button").forEach(btn => {
            btn.classList.remove("active");
        });

        activeBoard = button.dataset.board; // Update active board
        document.getElementById(activeBoard).classList.add("active"); // Show selected board
        button.classList.add("active"); // Highlight clicked tab
        fetchData(activeBoard); // Fetch messages for the selected board
    });
});

// Function to add forum message to the page
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

    // Event listeners for like and delete buttons
    forumMessageElement.querySelector(".likeButton").addEventListener("click", () => handleLike(data.id, forumMessageElement));
    forumMessageElement.querySelector(".deleteButton").addEventListener("click", () => handleDelete(data.id, forumMessageElement));
}

// Fetch data for the active board
async function fetchData(board) {
    showLoadingIndicator(); // Show loading indicator
    const response = await fetch(`http://localhost:8080/data?board=${board}`);
    const forumMessages = await response.json();
    forumMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    document.getElementById(board).innerHTML = ""; // Clear previous messages
    forumMessages.forEach((data) => {
        addForumMessageToPage(data, board);
    });
    hideLoadingIndicator(); // Hide loading indicator
}

async function handleSubmitButton(event) {
    event.preventDefault();
    const formData = new FormData(messageForm);
    const formValues = Object.fromEntries(formData);

    if (!formValues.name.trim() || !formValues.location.trim() || !formValues.textBox.trim()) {
        showNotification("Please fill out all fields."); // Show notification for errors
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
        showNotification("Message submitted successfully!"); // Notify user of success
    } catch (error) {
        console.error("Error submitting form:", error);
    }
}

async function handleLike(id, element) {
    const response = await fetch(`http://localhost:8080/data/${id}/like`, {
        method: 'POST',
    });
    const updatedData = await response.json();
    element.querySelector(".like-count").textContent = updatedData.likes; // Update like count in the UI
}

async function handleDelete(id, element) {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (confirmed) {
        await fetch(`http://localhost:8080/data/${id}`, {
            method: 'DELETE',
        });
        element.remove(); // Remove the message from the UI
        showNotification("Message deleted successfully!"); // Notify user of success
    }
}

// Notification function to show user feedback
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove(); // Remove notification after 3 seconds
    }, 3000);
}

// Load the default board on startup
fetchData(activeBoard);