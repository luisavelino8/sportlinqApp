import PendingSessionRequest from '../models/pendingSessionRequest.js';
import Location from '../models/location.js';
import User from '../models/user.js';
import Session from '../models/session.js';
import Review from '../models/review.js';
import { Sequelize } from 'sequelize';

// ZONDER REVIEW
const finishSessionWithoutReview = async (req, res, next) => {
    const { userInDB } = req.body;
    const { session_id } = req.body;
    const { currentUserID } = req.body;

    try {
        const session = await Session.findOne({
            where: {
                session_id: session_id,
            },
        });

        if (!session) {
            return res.status(404).json({ message: 'Sessie niet gevonden' });
        }

        session.finished = "YES";

        if (userInDB === 'user1') {
            session.reviewUser1 = 'NO';
        } else {
            session.reviewUser2 = 'NO';
        }

        await session.save();

        res.status(200).json({ message: 'Sessie afgerond zonder review' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het afronden van de sessie' });
    }
};

// MET REVIEW
const finishSessionWithReview = async (req, res, next) => {
    const { userInDB } = req.body;
    const { session_id } = req.body;
    const { location_id } = req.body;
    const { currentUserID } = req.body;
    const { reviewText } = req.body;
    const { rating } = req.body;

    try {
        const session = await Session.findOne({
            where: {
                session_id: session_id,
            },
        });

        if (!session) {
            return res.status(404).json({ message: 'Sessie niet gevonden' });
        }

        session.finished = "YES";

        if (userInDB === 'user1') {
            session.reviewUser1 = 'YES';
        } else {
            session.reviewUser2 = 'YES';
        }

        await session.save();

        await Review.create({
            session_id: session_id,
            location_id: location_id,
            user_id: currentUserID,
            reviewText: reviewText,
            rating: rating,
        })

        res.status(200).json({ message: 'Sessie afgerond met een review' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het afronden van de sessie' });
    }
};

const getReviews = async (req, res, next) => {
    const { user_id } = req.query;

    try {
        const myReviews = await Review.findAll({
            where: {
                user_id: user_id,
            },
            include: [
                {
                    model: Location,
                    as: 'locationReview',
                    attributes: ['locationName'],
                    where: {
                        location_id: Sequelize.col('reviews.location_id')
                    }
                },
                {
                    model: Session,
                    as: 'sessionReview',
                    attributes: ['date'],
                    where: {
                        session_id: Sequelize.col('reviews.session_id')
                    }
                },
            ]
        });

        console.log('my reviews: '+myReviews);
        res.status(200).json(myReviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van de reviews' });
    }
};

export { finishSessionWithoutReview, finishSessionWithReview, getReviews };