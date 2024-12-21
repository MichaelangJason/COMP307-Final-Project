# Prerequisites

Browser Used: Google Chrome

URL to the running website: https://fall2024-comp307-group07.cs.mcgill.ca

Admin user pre-setup: 
Email: admin@mcgill.ca 
Password: Admin123!

You can add more users by signing up.

## How do we separate work?
Frontend (styling + api calls) :  
Han Wen Fu (ID:261033784),  Jessica Lee (ID:261033385), Iqra Pardesi (ID:261047708)

Database + Backend :  
YuTong Wei (ID:261073062),   Jiaju Nie (ID:261095892),

## Table : What each teammate coded?

## Han Wen Fu (ID: 261033784):
Initial React App folders and starting files setup 
Book Meeting page
Poll Voting page
Edit Meeting page
Requests page
Create Meeting page
Public pages Navbar
Cancel Meeting popup
Selected Calendar Date component
Request Accordion component
Request Status Label component
Meeting Participant component
Meeting Poll component
Participant Card component
Red Button Link component
Poll Options component
Meeting Overview component
Submit Button component
Time Slot component


## Iqra Pardesi(ID:261047708)
Public page - Landing Page(Home.tsx) 
Profile Page(Profile.tsx, profileBox.tsx and Profile.scss)
Designing submit button for profile.tsx 
Designing edit button for profile.tsx 
Handling new password update


## Jessica Lee (ID:261033385)
MeetingCard Component
MemberCard Component
Red Button Link Component (isGray, isLoggedIn, onLogout, setButtonText, setButtonPageTo)
Admin Member Dashboard Page
Meeting Page
Deletion Popup
Manage Self-hosted Meeting Page (asked help from Jiaju for api calls)
NavBarContent 
PrivateNav 
AdminNav 
Profile Page (90% Functioning + Styling)
Login Page
Signup Page
Styling for all of the above pages, components
Credit to : Jiaju, HanWen, YuTong for guiding me through github disaster


## YuTong Wei (ID:261073062)
AuthRouters endpoints (with corresponding controller and util fns)
ProfileRoutes endpoints (with corresponding controller and util fns)
AdminRoutes endpoints (with corresponding controller and util fns)
PollRoutes endpoints (with corresponding controller and util fns)
AdminMiddleware for admin role check
PrivateMiddleware for JWT token validation


## Jiaju Nie (ID: 261095892)
MeetingRoutes endpoints (with corresponding controller and util fns)
RequestRoutes endpoints (with corresponding controller and util fns)
Poll result choosing algo
Database with validation schemas
Database mock data + jest test
Database helper fns



## To run it locally

(Once deployed frontend localy it should run automatically)

URL: http://localhost:3000/ 

Admin user pre-setup: 
Email: admin@mcgill.ca 
Password: Admin1!

You can add more users by signing up.

### Environment Setup:

Install Node.js (v14+ recommended).

Ensure your database (e.g., MongoDB or PostgreSQL) is running and properly configured.

### Repository Setup:

Clone the repository: git clone git@github.com:MichaelangJason/COMP307-Final-Project.git
Install dependencies for both client and server applications (cd to both frontend and backend): npm install

### Configuration:

Set up the .env file with required environment variables if not already exist:

PORT=3007
MONGO_URI=mongodb://localhost:27017/Bookedin
JWT_SECRET=blue-bacon-stole-jamies-key
DEV_MODE=1 # enable mongo in memory, also use mock data
BYPASS_AUTH=0 # Bypass middleware and role check

### Start the server: npm start

Visit your browser with your localhost port

API Documentation in ./backend/README.md


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
Each date can accommodate multiple time slots. Add slots with black + button.
Optionally, create a poll to allow participants to vote on preferred time slots while setting up the meeting.

### Upcoming Meetings Page: Displays a list of all your scheduled meetings.

Includes an option to delete meetings you no longer need.
Features a sorting tool to organize meetings by different statuses.

### Manage Meetings Page: View all your meetings and manage meetings

Edit meeting details.
Copy a sharable link for others to register to the meeting. Also display the poll link.
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

### Poll page: Accessed via url displayed in copy button in Manage meetings

Vote for the most prepered slot. 
The poll will show the results (the number of results you choose) in your upcoming meetings after timeout.

