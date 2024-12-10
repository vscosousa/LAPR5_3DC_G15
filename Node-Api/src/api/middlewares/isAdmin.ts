import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../../config';

const getTokenFromHeader = (req: { headers: { authorization?: string; }; }) => {
  console.log("Headers:", req.headers);
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = getTokenFromHeader(req);
    
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as any;
    console.log("Decoded:", decoded);

    if (decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] !== 'Admin') {
        res.status(403).json({ message: 'Access denied: Admins only' });
        return;
      }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
};