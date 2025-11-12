import { Router } from 'express';
import type { Request, Response } from 'express';
import { getMessages } from '../controllers/message.controller';

const router= Router();

router.get("/:senderId/:receiverId",  (req: Request, res: Response) => getMessages(req, res));

export default router;