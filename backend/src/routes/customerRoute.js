import express from 'express';
import customerController from '../controllers/customerController.js';

const router = express.Router();

router.get('/', customerController.getAllCustomers);
router.get('/:id/history', customerController.getCustomerHistory);
router.post('/save', customerController.saveCustomer);
router.delete('/delete/:id', customerController.deleteCustomer);
router.get('/history/:id', customerController.getCustomerHistory);
router.get('/:id/notes', customerController.getNotes);
router.post('/:id/notes', customerController.addNote);
router.delete('/notes/:noteId', customerController.deleteNote);
export default router;