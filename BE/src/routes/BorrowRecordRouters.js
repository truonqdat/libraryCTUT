import express from 'express';
import BorrowController from '../controllers/BorrowRecordControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/from-reservation/:code', authMiddleware.isAdminMiddleware, BorrowController.createFromReservation);
router.post('/direct', BorrowController.createDirectBorrow);
router.post('/update', authMiddleware.isAdminMiddleware, BorrowController.updateBookStatus);
router.patch('/:id/return', BorrowController.returnBooks);
router.get('/getAll', BorrowController.getAllRecords);
router.post('/borrows/check-overdue', BorrowController.checkOverdueBooks);
router.get('/:id', BorrowController.getBorrowRecord);
router.get('/scan/:code', BorrowController.scanCode);
router.post('/process-scanned', authMiddleware.isLibrarianMiddleware, BorrowController.processScannedCodes);

export default router;