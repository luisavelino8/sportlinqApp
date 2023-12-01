import User from '../models/user.js';
import Friend from '../models/friend.js';
import { Sequelize } from 'sequelize';
import PendingSessionRequest from '../models/pendingSessionRequest.js';


const getFriendsForSessions = async (req, res, next) => {
    // try {
    //     const currentUserId = req.query.user_id;

    //     const friends = await User.findAll({
    //         attributes: ['user_id', 'userName'],
    //         where: {
    //             user_id: {
    //                 [Sequelize.Op.not]: currentUserId,
    //             },
    //         },
    //     });
    //     res.status(200).json(friends);
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van locaties' });
    // }

    const { user_id } = req.query;

    try {
        const myFriends = await Friend.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { user1_id: user_id },
                    { user2_id: user_id }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'user1',
                    attributes: ['userName'],
                    where: {
                        user_id: Sequelize.col('friends.user1_id')
                    }
                },
                {
                    model: User,
                    as: 'user2',
                    attributes: ['userName'],
                    where: {
                        user_id: Sequelize.col('friends.user2_id')
                    }
                },
            ]
        });

        console.log('my friends: '+myFriends);
        res.status(200).json(myFriends);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van je vrienden voor een sessie' });
    }
};

const sendSessionRequest = async (req, res, next) => {
    const { currentUser, selectedFriendID, selectedLocationID, selectedDate } = req.body;

    const existingRequests = await PendingSessionRequest.findAndCountAll({
        where: {
            requesterUserId: currentUser,
            receiverUserId: selectedFriendID,
        }
    });

    const numberOfRequests = existingRequests.count;

    if (numberOfRequests >= 3) {
        return res.status(400).json({ message: 'Je kunt maximaal drie sessieverzoeken sturen naar dezelfde gebruiker' });
    }

    PendingSessionRequest.create({
      requesterUserId: currentUser,
      receiverUserId: selectedFriendID,
      location_id: selectedLocationID,
      date: selectedDate,
    })
      .then(() => {
        res.status(200).json({ message: 'Sessie verzoek succesvol verstuurd' });
      })
      .catch(err => {
        console.log('Error:', err);
        res.status(500).json({ message: 'Interne serverfout' });
      });
};

export { getFriendsForSessions, sendSessionRequest };