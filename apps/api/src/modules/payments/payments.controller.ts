import { Request, Response } from 'express';
import { PaymentsService } from './payments.service';

export class PaymentsController {
  static async getDashboard(req: Request, res: Response) {
    try {
      const metrics = await PaymentsService.getDashboardMetrics();
      res.json({ success: true, data: metrics });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getPayments(req: Request, res: Response) {
    try {
      const payments = await PaymentsService.getPayments(req.query);
      res.json({ success: true, data: payments });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getPayment(req: Request, res: Response) {
    try {
      const payment = await PaymentsService.getPaymentById(req.params.id);
      if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
      res.json({ success: true, data: payment });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async receivePayment(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const payment = await PaymentsService.receivePayment(req.body, userId);
      res.status(201).json({ success: true, data: payment });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async confirmPayment(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const payment = await PaymentsService.confirmPayment(req.params.id, userId);
      res.json({ success: true, data: payment });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async allocatePayment(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { invoiceId, amount } = req.body;
      const allocation = await PaymentsService.allocatePayment(req.params.id, invoiceId, Number(amount), userId);
      res.json({ success: true, data: allocation });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async generateReceipt(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { remarks } = req.body;
      const receipt = await PaymentsService.generateReceipt(req.params.id, remarks || '', userId);
      res.status(201).json({ success: true, data: receipt });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async cancelPayment(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { notes } = req.body;
      const payment = await PaymentsService.cancelPayment(req.params.id, notes || 'Cancelled by user', userId);
      res.json({ success: true, data: payment });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async refundPayment(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { notes } = req.body;
      const payment = await PaymentsService.refundPayment(req.params.id, notes || 'Refunded by user', userId);
      res.json({ success: true, data: payment });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
