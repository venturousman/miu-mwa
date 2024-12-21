import multer from 'multer';
import path from 'node:path';
import { ErrorWithStatus } from '../models/errorWithStatus';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = file.mimetype.startsWith('image/')
            ? 'uploads/images'
            : file.mimetype === 'application/pdf'
            ? 'uploads/pdfs'
            : 'uploads/others';
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames
    },
});

export const imageUpload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            // cb(new Error('Only image files are allowed!'));
            cb(new ErrorWithStatus('Only image files are allowed!', 400));
        }
    },
});

export const pdfUpload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            // cb(null, false);
            cb(new ErrorWithStatus('Only PDF files are allowed!', 400));
        }
    },
});
