import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// const signup = (req, res, next) => {
//     // checks if email already exists
//     User.findOne({ where : {
//         email: req.body.email, 
//     }})
//     .then(dbUser => {
//         if (dbUser) {
//             return res.status(409).json({message: "email already exists"});
//         } else if (req.body.email && req.body.password) {
//             // password hash
//             bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
//                 if (err) {
//                     return res.status(500).json({message: "couldnt hash the password"}); 
//                 } else if (passwordHash) {
//                     return User.create(({
//                         email: req.body.email,
//                         userName: req.body.userName,
//                         password: passwordHash,
//                     }))
//                     .then(() => {
//                         res.status(200).json({message: "user created"});
//                     })
//                     .catch(err => {
//                         console.log(err);
//                         res.status(502).json({message: "error while creating the user"});
//                     });
//                 };
//             });
//         } else if (!req.body.password) {
//             return res.status(400).json({message: "password not provided"});
//         } else if (!req.body.email) {
//             return res.status(400).json({message: "email not provided"});
//         };
//     })
//     .catch(err => {
//         console.log('error', err);
//     });
// };

const signup = async (req, res, next) => {
    try {
      // Controleer of de e-mail al bestaat
      const existingEmail = await User.findOne({ where: { email: req.body.email } });
  
      if (existingEmail) {
        return res.status(409).json({ message: "E-mailadres bestaat al" });
      }
  
      // Controleer of de gebruikersnaam al bestaat
      const existingUserName = await User.findOne({ where: { userName: req.body.userName } });
  
      if (existingUserName) {
        return res.status(409).json({ message: "Gebruikersnaam bestaat al" });
      }
  
      // Als de e-mail en gebruikersnaam uniek zijn, ga verder met de registratie
      if (req.body.email && req.body.password) {
        // password hash
        bcrypt.hash(req.body.password, 12, async (err, passwordHash) => {
          if (err) {
            return res.status(500).json({ message: "Kon het wachtwoord niet hashen" });
          } else if (passwordHash) {
            try {
              // Maak de gebruiker aan
              await User.create({
                email: req.body.email,
                userName: req.body.userName,
                password: passwordHash,
              });
  
              return res.status(200).json({ message: "Gebruiker is aangemaakt" });
            } catch (createError) {
              console.log(createError);
              return res.status(502).json({ message: "Fout bij het aanmaken van de gebruiker" });
            }
          }
        });
      } else if (!req.body.password) {
        return res.status(400).json({ message: "Wachtwoord niet opgegeven" });
      } else if (!req.body.email) {
        return res.status(400).json({ message: "E-mail niet opgegeven" });
      }
    } catch (error) {
      console.log('Error', error);
      return res.status(500).json({ message: "Interne serverfout" });
    }
};
  

const login = (req, res, next) => {
    // checks if email exists
    User.findOne({ where : {
        email: req.body.email, 
    }})
    .then(dbUser => {
        if (!dbUser) {
            return res.status(404).json({message: "Gebruiker niet gevonden"});
        } else {
            // password hash
            bcrypt.compare(req.body.password, dbUser.password, (err, compareRes) => {
                if (err) { // error while comparing
                    res.status(502).json({message: "error while checking user password"});
                } else if (compareRes) { // password match
                    const token = jwt.sign({ email: req.body.email }, 'secret', { expiresIn: '1h' });
                    res.status(200).json({message: "user logged in", "token": token});
                } else { // password doesnt match
                    res.status(401).json({message: "Vul de juiste wachtwoord in"});
                };
            });
        };
    })
    .catch(err => {
        console.log('error', err);
    });
};

const getUserInfo = (req, res, next) => {
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


const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];
    let decodedToken; 
    try {
        decodedToken = jwt.verify(token, 'secret');
        console.log(token);
    } catch (err) {
        return res.status(500).json({ message: err.message || 'could not decode the token' });
    };
    if (!decodedToken) {
        res.status(401).json({ message: 'unauthorized' });
    } else {
        res.status(200).json({ message: 'here is your resource' });
    };
};

export { signup, login, isAuth, getUserInfo };