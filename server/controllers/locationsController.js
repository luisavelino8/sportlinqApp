import Location from '../models/location.js';

const getAllLocations = async (req, res, next) => {
    try {
        const locations = await Location.findAll();
        res.status(200).json(locations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van locaties' });
    }
};

export { getAllLocations };