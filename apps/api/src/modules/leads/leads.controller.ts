import { Request, Response } from 'express';
import { LeadsService, leadSchema } from './leads.service';
import { ApiResponse } from '@fonebox/types';
import { LeadType } from '@prisma/client';

export class LeadsController {
  private static async handleSubmission(req: Request, res: Response, type: LeadType) {
    try {
      const parsed = leadSchema.safeParse({ ...req.body, type });
      
      if (!parsed.success) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid input', 
          error: parsed.error.message 
        } as ApiResponse);
      }

      const lead = await LeadsService.createLead(parsed.data);

      return res.status(201).json({
        success: true,
        message: 'Lead created successfully',
        data: {
          id: lead.id,
          referenceNumber: lead.referenceNumber,
        }
      } as ApiResponse);
    } catch (error: any) {
      console.error('Lead submission error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error while processing lead.' 
      } as ApiResponse);
    }
  }

  static async submitInquiry(req: Request, res: Response) {
    return LeadsController.handleSubmission(req, res, LeadType.GENERAL_INQUIRY);
  }

  static async submitQuote(req: Request, res: Response) {
    return LeadsController.handleSubmission(req, res, LeadType.QUOTE_REQUEST);
  }

  static async submitRepair(req: Request, res: Response) {
    return LeadsController.handleSubmission(req, res, LeadType.REPAIR_REQUEST);
  }

  static async submitBusiness(req: Request, res: Response) {
    return LeadsController.handleSubmission(req, res, LeadType.BUSINESS_CONSULTATION);
  }
}
