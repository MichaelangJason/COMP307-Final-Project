# API Documentation


## 1. Login/Register

POST `/register`

POST `/login`

DELETE `/logout`

## 2. Member

GET  `/profile/:userId`

PUT `/profile/:userId`

## 3. Admin

GET `/admin/members`

GET `/admin/members/search`

PUT `/admin/members/:userId`

DELETE `/admin/members/:userId`

POST `/admin/members/:userId/login-as`

## 4. Meeting

GET `/meeting/meetingId`

POST `/meeting/:hostId`

PUT `/meeting/:meetingId`

PUT `/meeting/book/:meetingId`

PUT `/meeting/unbook/:meetingId`

PUT `/meeting/cancel/:meetingId`

## 5. Poll

GET `/poll/:pollId`

PUT `/poll/:pollId`

~~POST `/poll/`~~

## 6. Requests

GET `/request/:requestId`

POST `/request/:hostId`

PUT `/request/:requestId`



