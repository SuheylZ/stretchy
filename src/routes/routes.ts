// routes.ts
import express ,{ Request, Response }from 'express';
import yamlFilterMiddleware from '../middlewares/yamlFilter';
import upload from '../middlewares/multer';
import { __readYAMLFile__ } from '../controller';
import path from 'path';
const router = express.Router();
import fs from 'fs'
import archiver from 'archiver';
import * as uuid from 'uuid'
import * as _ from 'underscore'

router.post('/api/upload',upload.single('file'),yamlFilterMiddleware,async (req, res) => {

  try {
  
 // Access the uploaded file details using req.file
 const uploadedFile = req.file;
  if(!req.body.indices || req.body.indices ==='')
    throw new Error('please provide indices');

    const indicesArray = req.body.indices.split(',');
  // __readYAMLFile__(uploadedFile?.originalname!, ['booking', 'trips'])
  __readYAMLFile__(uploadedFile?.originalname!, indicesArray)
 // Handle the file as needed
 const inputFolderPath = path.join(__dirname,'../static');
 const outputPath = path.join(__dirname,'../static/');
 const id=uuid.v4();
 const outputZipPath = outputPath+`${id}.zip`;
 
 // Create a writable stream to the compressed archive
 const outputZipStream = fs.createWriteStream(outputZipPath);
 
 // Create a zip archiver
 const archive = archiver('zip', { zlib: { level: 9 } }); // Compression level: 9 (highest)
 
 // Pipe the output stream to the archive
 archive.pipe(outputZipStream);
 
 // Append all files in the input folder to the archive
 const files = fs.readdirSync(inputFolderPath);
 files.forEach((fileName) => {
   const filePath = path.join(inputFolderPath, fileName);
   archive.file(filePath, { name: fileName });
 });
 
 // Finalize the archive
 await archive.finalize();
 
 // Handle events
 await outputZipStream.on('close', () => {
   res.send({id:id,message:'File uploaded successfully!'});
 });
 
 outputZipStream.on('error', (err) => {
   console.error('Error creating compressed archive:', err);
 });

} catch (error) {
    throw error
}
});

router.get('/api/:id/download', async (req: Request, res: Response) => {
  // Assuming the file you want to send is located in the 'static' directory

  try {
    
  if(!req.params.id)
    throw new Error('please provide id');

  const filePath = path.join(__dirname,'../static', `${req.params.id}.zip`);
 // Set the response headers to indicate a file download
 res.setHeader('Content-Disposition', `attachment; filename=${req.params.id}.zip`);
  
 res.setHeader('Content-Type', 'application/zip');

 // Stream the file to the response
  res.sendFile(filePath);
} catch (error) {
    throw error
}
});

export default router;