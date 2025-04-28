import { Router } from 'express';
import { personalDetailController } from './personaldata_controller';


const router = Router();

// Define routes
router.get('/', personalDetailController.getAll);

export default router;
