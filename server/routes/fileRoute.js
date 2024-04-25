import { Router } from 'express';
import FileController from '../controllers/FileController.js';
import FileRepository from '../repositories/FileRepository.js';

const router = Router();
const fileController = new FileController(FileRepository);

router.get('/signed-url', fileController.getSignedUrl.bind(fileController));

export default router;

