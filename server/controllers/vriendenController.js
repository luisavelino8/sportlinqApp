import PendingFriendRequest from '../models/pendingFriendRequest.js';
import { Sequelize } from 'sequelize';
import User from '../models/user.js';
import Friend from '../models/friend.js';

const searchFriend = (req, res, next) => {
    const searchValue = req.body.search;
    const currentUser = req.body.currentUser;
    console.log('Search Value:', searchValue);
    console.log('Current User:', currentUser);

    const whereClause = {};

    if (searchValue) {
        whereClause.userName = {
            [Sequelize.Op.like]: `%${searchValue}%`
        };
    }

    whereClause.user_id = {
        [Sequelize.Op.not]: currentUser
    };

    User.findAll({
        where: whereClause
    })
    .then(dbUsers => {
        if (dbUsers.length === 0) {
            return res.status(404).json({ message: "Geen gebruikers gevonden" });
        } else {
            const searchUserInfo = dbUsers.map(dbUser => ({
                user_id: dbUser.user_id,
                email: dbUser.email,
                userName: dbUser.userName,
                fullName: dbUser.fullName,
                city: dbUser.city,
            }));

            res.status(200).json(searchUserInfo);
        }
    })
    .catch(err => {
        console.log('Error:', err);
        res.status(500).json({ message: "Interne serverfout", error: err.message });
    });
};

const sendFriendRequest = async (req, res, next) => {
    const { currentUser, selectedUserId } = req.body;

    const existingFriendship = await Friend.findOne({
        where: {
            [Sequelize.Op.or]: [
                {
                    user1_id: currentUser,
                    user2_id: selectedUserId,
                },
                {
                    user1_id: selectedUserId,
                    user2_id: currentUser,
                },
            ],
        },
    });

    if (existingFriendship) {
        return res.status(400).json({ message: 'Deze gebruikers zijn al vrienden' });
    }

    const existingRequest1 = await PendingFriendRequest.findOne({
        where: {
            requesterUserId: currentUser,
            receiverUserId: selectedUserId,
        }
    });

    const existingRequest2 = await PendingFriendRequest.findOne({
        where: {
            requesterUserId: selectedUserId,
            receiverUserId: currentUser,
        }
    });

    if (existingRequest1 || existingRequest2) {
        return res.status(400).json({ message: 'Er bestaat al een vriendenverzoek tussen deze gebruikers' });
    }

    PendingFriendRequest.create({
      requesterUserId: currentUser,
      receiverUserId: selectedUserId,
    })
      .then(() => {
        res.status(200).json({ message: 'Vriendenverzoek succesvol verstuurd' });
      })
      .catch(err => {
        console.log('Error:', err);
        res.status(500).json({ message: 'Interne serverfout' });
      });
};

const getFriendRequests = async (req, res, next) => {
    const { user_id } = req.query;

    try {
        const myRequests = await PendingFriendRequest.findAll({
            where: {
                receiverUserId: user_id,
            },
        });

        const requesterUserInfo = [];

        // Loop door elk vriendverzoek en haal de gebruikersinformatie op
        for (const request of myRequests) {
            const requesterUser = await User.findOne({
                where: {
                    user_id: request.requesterUserId,
                },
                attributes: ['userName', 'fullName','city'],
            });

            // Voeg de gevonden informatie toe aan het array
            requesterUserInfo.push({
                id: request.id,
                user_id: request.requesterUserId,
                userName: requesterUser.userName,
                fullName: requesterUser.fullName,
                city: requesterUser.city,
            });
        }

        res.status(200).json(requesterUserInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van vriend requests' });
    }
};

const deleteRequest = async (req, res, next) => {
    const { id } = req.query;

    try {
        const request = await PendingFriendRequest.findOne({
            where: {
                id: id,
            },
        });

        if (!request) {
            return res.status(404).json({ message: 'Vriendenverzoek niet gevonden' });
        }

        await request.destroy();

        res.status(200).json({ message: 'Vriendenverzoek succesvol verwijderd' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van de request' });
    }
};

const acceptRequest = async (req, res, next) => {
    const { id } = req.query;

    try {
        const request = await PendingFriendRequest.findOne({
            where: {
                id: id,
            },
        });

        if (!request) {
            return res.status(404).json({ message: 'Vriendenverzoek niet gevonden' });
        }

        await Friend.create({
            user1_id: request.requesterUserId,
            user2_id: request.receiverUserId,
        })

        await request.destroy();

        res.status(200).json({ message: 'Vriendenverzoek succesvol geaccepteerd' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het accepteren van de request' });
    }
};

const getFriends = async (req, res, next) => {
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

        const friendsCount = myFriends.length;

        console.log('my friends: '+myFriends);
        res.status(200).json({myFriends, friendsCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van je vrienden' });
    }
};

export { searchFriend, sendFriendRequest, getFriendRequests, getFriends, deleteRequest, acceptRequest };
