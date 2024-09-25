# Group-week-5- my testing ground to indulge my more over reaching ideas for proof of concepts

##Current functions 



## Client Side Explanation

### 1. **HTML Structure**
   - **Main Elements**:
     - **Header**: Contains the title of the application.
     - **Navigation**: Includes buttons (tabs) for different message boards (Chat, Health and Wellness, Advice).
     - **Main Content**: Houses a button to open a form for submitting messages, the form itself, and message containers for each board.
   - **Dynamic Elements**:
     - **Popup Overlay**: A modal that pops up to allow users to submit new messages. It is hidden by default and displayed when the user clicks the "Open Form" button.
     - **Message Containers**: Each board has a corresponding div to display messages specific to that board. Only one container is active at a time.

### 2. **CSS Styles (style.css)**
   - **Layout and Design**:
     - **Responsive Design**: Uses CSS media queries to adapt the layout for different screen sizes.
     - **Flexbox**: Utilizes flexbox for navigation buttons to ensure they are evenly spaced and aligned.
     - **Dynamic Effects**: Includes hover effects for buttons and transitions for showing/hiding elements (like the popup).
   - **Styling Elements**:
     - **Message Cards**: Styles for the message containers to make them visually appealing, including borders, padding, and shadows.
     - **Loading Indicator**: A visual cue that shows when data is being fetched.

### 3. **JavaScript Functionality (main.js)**
   - **DOM Manipulation**:
     - **Open/Close Popup**: Functions to show or hide the message submission form.
   - **Event Listeners**:
     - **Tab Switching**: Listens for clicks on tab buttons to show the relevant message board and fetch data for that board.
     - **Form Submission**: Captures data from the form and sends it to the server when the user submits it.
   - **Dynamic Data Handling**:
     - **Fetch Data**: Functionality to fetch messages from the server based on the selected board, dynamically rendering them on the page.
     - **Like and Delete Functions**: Handles user interactions for liking and deleting messages, updating the UI accordingly.
   - **Notifications**: Provides user feedback through notifications for actions like successful submissions or deletions.

## Server Side Explanation

### 1. **Server Setup (`server.js`)**
   - **Express Framework**: Uses Express to create a web server that handles incoming HTTP requests and routes them appropriately.
   - **CORS**: Configured to allow requests from different origins, enabling the frontend to communicate with the backend.
   - **Middleware**: Uses middleware like `express.json()` to parse incoming JSON request bodies.

### 2. **Database Connection**
   - **PostgreSQL**: Establishes a connection to a PostgreSQL database using the `pg` library, allowing the server to query and manipulate data.
   - **Environment Variables**: Sensitive information like the database connection string is stored in environment variables for security.

### 3. **HTTP Endpoints**
   - **GET `/data`**:
     - This endpoint retrieves messages for a specified board.
     - Validates that a board name is provided and queries the database to return the relevant messages in JSON format.
   - **POST `/add-data`**:
     - Handles the submission of new messages.
     - Validates input data (name, location, message, board) before inserting it into the database.
     - Returns the newly created message as a response.
   - **POST `/data/:id/like`**:
     - Increments the like count for a message identified by its ID.
     - Updates the database and returns the updated message data.
   - **DELETE `/data/:id`**:
     - Deletes a specified message from the database based on its ID.
     - Returns a confirmation message upon successful deletion.

### 4. **Error Handling**
   - **Input Validation**: Checks for missing fields in incoming requests and responds with appropriate error messages.
   - **Database Error Handling**: Catches errors during database operations and responds with a 500 status code for internal server errors.
   - **Centralized Error Handling Middleware**: Catches any unhandled errors in the application and logs them, providing a fallback response to the client.

### 5. **Logging**
   - **Console Logging**: Logs errors to the console, aiding in debugging and understanding server behavior during execution.

## Summary
This web application consists of a structured client side that utilizes HTML, CSS, and JavaScript for user interaction, and a robust server side built with Node.js and Express that handles data management through a PostgreSQL database. Together, they allow users to interact dynamically with the application, submitting, liking, and deleting messages in real-time while providing a responsive and user-friendly interface.



##Issues 


Data entered returns as undefined and empty 


##Potential changes, 

modernising of look and feel of the page, centralising of footer text with social media connections. 






<img width="1323" alt="Screenshot 2024-09-24 at 19 29 48" src="https://github.com/user-attachments/assets/2bf29d5a-a6e9-44f3-a1a5-8cbc9b3c3b4b">
<img width="1277" alt="Screenshot 2024-09-24 at 20 42 39" src="https://github.com/user-attachments/assets/9c7fd1ff-0a7c-4dab-9cd2-56c0fa17380e">
<img width="1277" alt="Screenshot 2024-09-24 at 20 42 46" src="https://github.com/user-attachments/assets/8ba49d73-485f-4986-b0e9-63f2bf7dc111">
<img width="1277" alt="Screenshot 2024-09-24 at 20 42 54" src="https://github.com/user-attachments/assets/afbe5ad8-a9a1-426a-abf7-cb5675a929fe">






