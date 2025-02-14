import { Router } from 'express';
const router = Router();
import { createLocation, getLocations, getLocationById, updateLocation, deleteLocation } from '../controllers/locationController';
import auth from '../middlewares/auth';

router.post('/', auth, createLocation);
router.get('/', getLocations);
router.get('/:id', getLocationById);
router.put('/:id', auth, updateLocation);
router.delete('/:id', auth, deleteLocation);

export default router;