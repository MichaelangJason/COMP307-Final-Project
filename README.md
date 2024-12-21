# Prerequisites

We are using Chrome as our navigation tool. 
Connect to https://fall2024-comp307-group07.cs.mcgill.ca/ 

## Technologies Used:

MongoDB: Stores and manages flexible data structures for services and users.
Express: Simplifies server-side logic and API development.
React: Builds interactive and dynamic user interfaces.
Node.js: Executes server-side JavaScript for backend functionality.


## Our features:

Seamless access to login, logout, and scheduled meetings.
Create and manage one-time or recurring meetings with customizable time slots and polls.
View, edit, delete, and sort meetings based on status.
Approve or decline alternative schedules proposed by participants.
Manage personal details, update passwords, and set notification preferences.
Admins can view, edit, and manage member profiles and details.


## In detail: 

### Landing Page: Provides seamless access to login and logout options, as well as a link to the Upcoming Meetings page.

### Create Meeting Page: Design your own meeting by filling out a simple form with all the required details.

Meetings can be scheduled as recurring or one-time events.
Each date can accommodate multiple time slots.
Optionally, create a poll to allow participants to vote on preferred time slots while setting up the meeting.

### Upcoming Meetings Page: Displays a list of all your scheduled meetings.

Includes an option to delete meetings you no longer need.
Features a sorting tool to organize meetings by different statuses.
Manage Meetings Page:
View all your meetings with tools to:

Edit meeting details.
Copy a sharable link for others to register.
Sort meetings by status for easier navigation.

### Request Page: Review all alternative schedules proposed by participants along with their availabilities.

Approve or decline these requests directly from this page.

### Profile Page: Manage your personal information

View personal informations like: Name, ID, and email.
Update your password and set your preferred notification method.

### Admin Features: Restricted to users with an admin role.

View all website members and their details.
Access and manage individual member pages by clicking on their profile.
Edit member information as needed.


## To run it locally

### Environment Setup:

Install Node.js (v14+ recommended).

Ensure your database (e.g., MongoDB or PostgreSQL) is running and properly configured.

### Repository Setup:

Clone the repository: git clone git@github.com:MichaelangJason/COMP307-Final-Project.git
Install dependencies for both client and server applications (cd to both frontend and backend): npm install

### Configuration:

Set up the .env file with required environment variables if not already exist:


MONGO_URI=mongodb://localhost:27017/Bookedin
JWT_SECRET=blue-bacon-stole-jamies-key

### Start the server: npm start

Visit your browser with your localhost port


API Documentation in ./backend/README.md
