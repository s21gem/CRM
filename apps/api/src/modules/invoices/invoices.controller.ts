import { Request, Response } from 'express';
import { InvoicesService } from './invoices.service';
import { ApiResponse } from '@fonebox/types';

export class InvoicesController {
  static async getDashboard(req: Request, res: Response) {
    try {
      const data = await InvoicesService.getDashboardMetrics();
      const response: ApiResponse<typeof data> = {
        success: true,
        message: 'Dashboard metrics retrieved',
        data,
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getInvoices(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const filters = {
        search: req.query.search as string,
        status: req.query.status as any,
      };

      const data = await InvoicesService.getInvoices(filters, page, limit);
      
      const response: ApiResponse<typeof data.items> = {
        success: true,
        message: 'Invoices retrieved',
        data: data.items,
        meta: data.meta,
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getInvoice(req: Request, res: Response) {
    try {
      const data = await InvoicesService.getInvoiceById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Invoice not found' });
      const response: ApiResponse<typeof data> = {
        success: true,
        message: 'Invoice retrieved',
        data,
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createDraft(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await InvoicesService.createDraft(req.body.repairOrderId, userId);
      const response: ApiResponse<typeof data> = {
        success: true,
        message: 'Invoice draft created',
        data,
      };
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async addLaborCharge(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await InvoicesService.addLaborCharge(req.params.id, req.body, userId);
      const response: ApiResponse<typeof data> = {
        success: true,
        message: 'Labor charge added',
        data,
      };
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async refreshParts(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await InvoicesService.refreshParts(req.params.id, userId);
      const response: ApiResponse<typeof data> = {
        success: true,
        message: 'Parts refreshed',
        data,
      };
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async approveInvoice(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await InvoicesService.approveInvoice(req.params.id, userId);
      const response: ApiResponse<typeof data> = {
        success: true,
        message: 'Invoice approved',
        data,
      };
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async issueInvoice(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await InvoicesService.issueInvoice(req.params.id, userId);
      const response: ApiResponse<typeof data> = {
        success: true,
        message: 'Invoice issued',
        data,
      };
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async voidInvoice(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await InvoicesService.voidInvoice(req.params.id, userId);
      const response: ApiResponse<typeof data> = {
        success: true,
        message: 'Invoice voided',
        data,
      };
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
