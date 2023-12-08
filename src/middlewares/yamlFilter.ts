import { Request, Response, NextFunction } from 'express';
import path from 'path';

const yamlFilterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const filePath = '.'+req.file?.mimetype.split('/')[1] // Use req.originalUrl for full URL with query parameters
  // Check if the file has a ".yaml" extension
  if (filePath.includes('yaml')) {
    // Proceed with handling the request for .yaml files
    next();
  } else {
    // If the file does not have a .yaml extension, send an error response
    res.status(400).send('Bad Request: Only .yaml files are allowed.');
  }
};

export default yamlFilterMiddleware;