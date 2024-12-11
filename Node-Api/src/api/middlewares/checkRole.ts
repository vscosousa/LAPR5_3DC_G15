const checkRole = (roles: string[]) => (req, res, next) => {
    const { auth } = req; // Use req.auth to get the JWT payload
    console.log(`Checking roles: ${roles}`);
    if (auth) {
        const tokenRole = auth['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        console.log(`Token role: ${tokenRole}`);
        if (roles.includes(tokenRole)) {
            console.log('Role check passed');
            return next();
        }
    }
    console.log('Role check failed');
    return res.status(403).json({ message: 'Forbidden' });
};

export default checkRole;