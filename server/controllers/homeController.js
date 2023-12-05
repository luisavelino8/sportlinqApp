import PendingSessionRequest from '../models/pendingSessionRequest.js';
import Location from '../models/location.js';
import User from '../models/user.js';
import Session from '../models/session.js';
import Review from '../models/review.js';
import Friend from '../models/friend.js';
import { Sequelize } from 'sequelize';

const getSessionsFromFriends = async (req, res, next) => {
    const { user_id } = req.query;
    const numericUserId = parseInt(user_id, 10); // deze voor user id vergelijking

    try {
        const friends = await Friend.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { user1_id: user_id },
                    { user2_id: user_id },
                ],
            },
        });

        if (friends.length === 0) {
            // Geen vrienden gevonden
            return res.status(404).json({ message: 'geen vrienden gevonden' });
        }

        // Verzamel de gebruikers-ID's van deze vrienden
        const friendUserIds = friends.map(friend => {
            return friend.user1_id === numericUserId ? friend.user2_id : friend.user1_id;
        });
        
        const sessionsFromFriends = await Session.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { user1_id: { [Sequelize.Op.in]: friendUserIds } },
                    { user2_id: { [Sequelize.Op.in]: friendUserIds } },
                ],
                [Sequelize.Op.not]: { [Sequelize.Op.or]: [{ user1_id: numericUserId }, { user2_id: numericUserId }] },
            },
            include: [
                {
                    model: Location,
                    as: 'locationRelation',
                    attributes: ['locationName']
                },
                {
                    model: User,
                    as: 'user1',
                    attributes: ['userName'],
                    where: {
                        user_id: Sequelize.col('sessions.user1_id')
                    }
                },
                {
                    model: User,
                    as: 'user2',
                    attributes: ['userName'],
                    where: {
                        user_id: Sequelize.col('sessions.user2_id')
                    }
                }
            ]
        });

        if (sessionsFromFriends.length === 0) {
            // Geen vrienden gevonden
            return res.status(404).json({ message: 'je vrienden hebben geen recente sessies gehad.' });
        }
        
        const sessionsWithUserType = sessionsFromFriends.map(session => {
            // Vergelijk de gebruikers-ID's van vrienden met user1_id en user2_id in elke sessie
            const isUser1Friend = friendUserIds.includes(session.user1_id);
            const isUser2Friend = friendUserIds.includes(session.user2_id);
        
            // Bepaal welke gebruiker de vriend vertegenwoordigt in deze sessie
            let whichUserIsFriend = null;
            if (isUser1Friend && isUser2Friend) {
                whichUserIsFriend = 'BOTH';
            } else if (isUser1Friend) {
                whichUserIsFriend = 'USER1';
            } else if (isUser2Friend) {
                whichUserIsFriend = 'USER2';
            }
        
            // Voeg de identificatie van de vriend toe aan de sessie
            return {
                ...session.toJSON(),
                whichUserIsFriend,
            };
        });

        res.status(200).json(sessionsWithUserType);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van sessies van vrienden' });
    }
};


export { getSessionsFromFriends };
