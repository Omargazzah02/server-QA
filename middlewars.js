
export function isAuthenticated (req , res , next ) {
    const token = req.cookies.token; 
    if (!token) return res.status(401).json({ message: 'Missing token' });

    try {

        const decoded = verifyToken(token)
        req.user = decoded;
        next()


    } catch(err) {
      res.status(403).json({'message' : 'Invalid token'})

    }



}
