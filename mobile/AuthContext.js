import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [API_URL, setAPI_URL] = useState('');

  const [useToken, setToken] = useState(null);
  const [userObject, setUserObject] = useState(null);
  const [locations, setLocations] = useState([]);
  const [sessionRequests, setSessionRequests] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [listenPendingSessions, setListenPendingSessions] = useState(false);
  const [myFriends, setMyFriends] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [friendsCount, setFriendsCount] = useState(null);
  const [selectedSessionForReview, setSelectedSessionForReview] = useState(null);
  const [sessionReviewed, setSessionReviewed] = useState(false);


  return (
    <AuthContext.Provider value={{ API_URL, setAPI_URL, useToken, setToken, userObject, setUserObject, 
    locations, setLocations, sessionRequests, setSessionRequests, mySessions, setMySessions, 
    listenPendingSessions, setListenPendingSessions, myFriends, setMyFriends, myReviews, setMyReviews, 
    friendsCount, setFriendsCount, selectedSessionForReview, setSelectedSessionForReview, sessionReviewed, setSessionReviewed}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};