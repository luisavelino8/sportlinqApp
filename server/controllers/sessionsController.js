import PendingSessionRequest from '../models/pendingSessionRequest.js';
import Location from '../models/location.js';
import User from '../models/user.js';
import Session from '../models/session.js';
import { Sequelize } from 'sequelize';

const getSessionRequests = async (req, res, next) => {
    try {
        const currentUserId = req.query.user_id;
        const sessionRequests = await PendingSessionRequest.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { requesterUserId: currentUserId },
                    { receiverUserId: currentUserId }
                ]
            },
            include: [
                {
                    model: Location,
                    as: 'locationRelation',
                    attributes: ['locationName', 'street']
                },
                {
                    model: User,
                    as: 'requesterUser',
                    attributes: ['userName'],
                    where: {
                        user_id: Sequelize.col('PendingSessionRequests.requesterUserId')
                    }
                },
                {
                    model: User,
                    as: 'receiverUser',
                    attributes: ['userName'],
                    where: {
                        user_id: Sequelize.col('PendingSessionRequests.receiverUserId')
                    }
                }
            ]
        });

        res.status(200).json(sessionRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van sessions' });
    }
};

const deleteSessionRequest = async (req, res, next) => {
    const { id } = req.query;

    try {
        const request = await PendingSessionRequest.findOne({
            where: {
                id: id,
            },
        });

        if (!request) {
            return res.status(404).json({ message: 'Sessie verzoek niet gevonden' });
        }

        await request.destroy();

        res.status(200).json({ message: 'Sessie verzoek succesvol verwijderd' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het verwijderen van de sessie verzoek' });
    }
};

const acceptSessionRequest = async (req, res, next) => {
    const { id } = req.query;

    try {
        const request = await PendingSessionRequest.findOne({
            where: {
                id: id,
            },
        });

        if (!request) {
            return res.status(404).json({ message: 'Sessie verzoek niet gevonden' });
        }

        await Session.create({
            user1_id: request.requesterUserId,
            user2_id: request.receiverUserId,
            location_id: request.location_id,
            date: request.date,
            finished: "notconfirmed",
            reviewUser1: "notconfirmed",
            reviewUser2: "notconfirmed",
        })

        await request.destroy();

        res.status(200).json({ message: 'Sessie verzoek succesvol geaccepteerd' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het accepteren van de sessie verzoek' });
    }
};

const getSessions = async (req, res, next) => {
    try {
        const currentUserId = req.query.user_id;
        const sessions = await Session.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { user1_id: currentUserId },
                    { user2_id: currentUserId }
                ]
            },
            include: [
                {
                    model: Location,
                    as: 'locationRelation',
                    attributes: ['locationName', 'street']
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

        res.status(200).json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van sessions' });
    }
};

export { getSessionRequests, deleteSessionRequest, acceptSessionRequest, getSessions };