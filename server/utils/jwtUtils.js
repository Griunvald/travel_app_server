import jwt from 'jsonwebtoken';

export const signJwt = async (...args) => {
    const secretKey = process.env.JWT_SECRET_KEY;
    const expiresIn = process.env.JWT_EXPIRES_IN;

    const payload = Object.assign({}, ...args);

    try {
        const token = await jwt.sign(payload, secretKey, { expiresIn });
        return token;
    } catch (err){
       throw err;
    }
}

export const verifyJwt = async (token) => {
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY)
    return decodedToken;
}
