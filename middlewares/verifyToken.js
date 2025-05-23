const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) => {
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer')) {
   return res.status(401).json({message: 'Token no proporcionado o mal formado.'});
}
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user = {id: decoded.id};
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({message:'Token invalido o expirado', error: error.message});
    }

}

module.exports = verifyToken;

