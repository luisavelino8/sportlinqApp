import PendingSessionRequest from '../models/pendingSessionRequest.js';
import Location from '../models/location.js';
import User from '../models/user.js';
import Session from '../models/session.js';
import { Sequelize } from 'sequelize';

const finishSessionWithoutReview = async (req, res, next) => {
    const { session_id } = req.body;

    try {
        const session = await Session.findOne({
            where: {
                session_id: session_id,
            },
        });

        if (!session) {
            return res.status(404).json({ message: 'Sessie niet gevonden' });
        }

        if (session.finished === 'YES') {
            return res.status(200).json({ message: 'Sessie is al afgerond' });
        }

        session.finished = "YES";
        await session.save();

        res.status(200).json({ message: 'Sessie afgerond zonder review' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het afronden van de sessie' });
    }
};

export { finishSessionWithoutReview };