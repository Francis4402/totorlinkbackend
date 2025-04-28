import { Request, Response } from 'express';
import { customerService } from './personaldata_service';


export const personalDetailController = {
  async getAll(req: Request, res: Response) {
    const data = await customerService.getAll();
    res.json(data);
  },
};
