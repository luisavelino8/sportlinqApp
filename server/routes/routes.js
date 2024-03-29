import express from 'express';

import { signup, login, isAuth, getUserInfo } from '../controllers/auth.js';
import { updateProfile, getUpdatedUserInfo, passwordCheck } from '../controllers/accountdetail.js';
import { getAllLocations } from '../controllers/locationsController.js';
import { searchFriend, sendFriendRequest, getFriendRequests, getFriends, deleteRequest, acceptRequest } from '../controllers/vriendenController.js';
import { getFriendsForSessions, sendSessionRequest } from '../controllers/newSessionController.js';
import { getSessionRequests, deleteSessionRequest, acceptSessionRequest, getSessions } from '../controllers/sessionsController.js';
import { finishSessionWithoutReview, finishSessionWithReview, getReviews } from '../controllers/reviewsController.js';
import { getSessionsFromFriends } from '../controllers/homeController.js';

const router = express.Router();

// voor authenticatie
router.post('/login', login);
router.post('/signup', signup);
router.get('/private', isAuth);
router.post('/getUserInfo', getUserInfo);

// voor home tab
router.get('/getSessionsFromFriends', getSessionsFromFriends);

// voor locaties
router.get('/locations', getAllLocations);

// voor profile updates
router.patch('/updateProfile', updateProfile);
router.post('/getUpdatedUserInfo', getUpdatedUserInfo);
router.post('/passwordCheck', passwordCheck);

// voor vrienden
router.post('/searchFriend', searchFriend);
router.post('/sendFriendRequest', sendFriendRequest);
router.get('/getFriendRequests', getFriendRequests);
router.get('/getFriends', getFriends);
router.delete('/deleteRequest', deleteRequest);
router.post('/acceptRequest', acceptRequest);


// voor nieuwe sessie
router.get('/getFriendsForSessions', getFriendsForSessions);
router.post('/sendSessionRequest', sendSessionRequest);

// voor sessions
router.get('/getSessionRequests', getSessionRequests);
router.delete('/deleteSessionRequest', deleteSessionRequest);
router.post('/acceptSessionRequest', acceptSessionRequest);
router.get('/sessions', getSessions);

// voor reviews
router.patch('/finishSessionWithoutReview', finishSessionWithoutReview);
router.patch('/finishSessionWithReview', finishSessionWithReview);
router.get('/getReviews', getReviews);



export default router;