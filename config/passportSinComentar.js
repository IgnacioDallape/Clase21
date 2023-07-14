import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const initializatePassport = () => {
    passport.use('jwt', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: 'secreto123'
    },
    async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (err) {
            console.log(err);
            done(null, err);
        }
    }));
};

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['cookieToken'];
    }
    console.log(token);
    return token;
};

const passportCall = (st) => {
    return (req, res, next) => {
        passport.authenticate(st, function(err, user, info) {
            if (err) return next(err);
            if (!user) {
                console.log(info.message);
                return res.status(401).send({ message: info.message ? info.message : info.toString() });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: 'no autorizado' });
        if (req.user.role !== role) return res.status(401).send({ error: 'no permissions' });
        next();
    };
};

export { initializatePassport, passportCall, authorization };
