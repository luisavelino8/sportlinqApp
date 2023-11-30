import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const updateProfile = async (req, res, next) => {
    try {

      const existingUser = await User.findOne({ where: { userName: req.body.newUserName } });

      // Haal de huidige gebruiker op
      const dbUser = await User.findOne({ where: { email: req.body.email } });

      if (!dbUser) {
        return res.status(404).json({ message: "Gebruiker profiel niet geüpdatet" });
      }

      // Controleer of de nieuwe gebruikersnaam anders is dan de huidige gebruikersnaam
      if (existingUser && existingUser.userName !== dbUser.userName) {
        return res.status(409).json({ message: "Gebruikersnaam is al in gebruik" });
      }

      if (req.body.newPassword) {
        // Als newPassword aanwezig is, voer bcrypt.hash uit
        bcrypt.hash(req.body.newPassword, 12, async (err, passwordHash) => {
            if (err) {
                return res.status(500).json({ message: "Kon het wachtwoord niet hashen" });
            }

            // Bijwerken van het gebruikersprofiel
            dbUser.userName = req.body.newUserName || dbUser.userName;
            dbUser.password = passwordHash;
            dbUser.fullName = req.body.newFullName || dbUser.fullName;
            dbUser.city = req.body.newCity || dbUser.city;
            dbUser.aboutMe = req.body.newAboutMe || dbUser.aboutMe;

            // Sla de wijzigingen op
            await dbUser.save();

            res.status(200).json({ message: "Gebruiker profiel is geüpdatet!" });
        });
        } else {
        // Als newPassword ontbreekt, update het profiel zonder het wachtwoord te hashen
        dbUser.userName = req.body.newUserName || dbUser.userName;
        dbUser.fullName = req.body.newFullName || dbUser.fullName;
        dbUser.city = req.body.newCity || dbUser.city;
        dbUser.aboutMe = req.body.newAboutMe || dbUser.aboutMe;

        // Sla de wijzigingen op
        await dbUser.save();

        res.status(200).json({ message: "Gebruiker profiel is geüpdatet!" });
        }
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ message: "Interne serverfout" });
    }
};

const getUpdatedUserInfo = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
      .then(dbUser => {
          if (!dbUser) {
              return res.status(404).json({ message: "Gebruiker info niet gevonden" });
          } else {
              const userInfo = {
                  user_id: dbUser.user_id,
                  email: dbUser.email,
                  userName: dbUser.userName,
                  fullName: dbUser.fullName,
                  city: dbUser.city,
                  friends: dbUser.friends,
                  reviews: dbUser.reviews,
                  sessions: dbUser.sessions,
                  aboutMe: dbUser.aboutMe
              };
              res.status(200).json(userInfo);
          };
      })
      .catch(err => {
          console.log('error', err);
      });
};

const passwordCheck = (req, res, next) => {
    User.findOne({ where: { email: req.body.email } })
        .then(dbUser => {
            if (!dbUser) {
                return res.status(404).json({ message: "Gebruiker niet gevonden" });
            } else {
                bcrypt.compare(req.body.password, dbUser.password, (err, compareRes) => {
                    if (err) {
                        res.status(502).json({ message: "Error tijdens het controleren van het gebruikerswachtwoord" });
                    } else if (compareRes) {
                        res.status(200).json({ message: "Wachtwoord komt overeen" });
                    } else {
                        res.status(401).json({ message: "Wachtwoord komt niet overeen" });
                    }
                });
            }
        })
        .catch(err => {
            console.log('error', err);
            res.status(500).json({ message: "Interne serverfout" });
        });
};
  

export { updateProfile, getUpdatedUserInfo, passwordCheck };