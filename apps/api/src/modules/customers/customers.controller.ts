import { Request, Response } from 'express';
import { PrismaClient, Prisma, AuthEvent } from '@prisma/client';
import { ApiResponse } from '@fonebox/types';
import { CustomersService } from './customers.service';

const prisma = new PrismaClient();

export class CustomersController {
  
  static async getCustomers(req: Request, res: Response) {
    try {
      const { page = '1', limit = '50', search, status, type } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const where: Prisma.CustomerWhereInput = {};

      if (status) {
        where.status = String(status);
      }
      if (type) {
        where.type = type as any;
      }

      if (search) {
        const searchStr = String(search);
        where.OR = [
          { firstName: { contains: searchStr, mode: 'insensitive' } },
          { lastName: { contains: searchStr, mode: 'insensitive' } },
          { email: { contains: searchStr, mode: 'insensitive' } },
          { phone: { contains: searchStr, mode: 'insensitive' } },
          { company: { contains: searchStr, mode: 'insensitive' } },
          { customerNumber: { contains: searchStr, mode: 'insensitive' } },
          { devices: { some: { imei: { contains: searchStr, mode: 'insensitive' } } } },
          { devices: { some: { serialNumber: { contains: searchStr, mode: 'insensitive' } } } },
          { devices: { some: { deviceNumber: { contains: searchStr, mode: 'insensitive' } } } },
        ];
      }

      const [customers, total] = await prisma.$transaction([
        prisma.customer.findMany({
          where,
          include: {
            devices: { select: { id: true, brand: true, model: true, imei: true } }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take,
        }),
        prisma.customer.count({ where })
      ]);

      const response: ApiResponse = {
        success: true,
        data: { customers, total, page: Number(page), limit: Number(limit) }
      };
      return res.status(200).json(response);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to fetch customers' });
    }
  }

  static async getCustomerDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
          devices: true,
          leads: true,
          customerNotes: {
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { firstName: true, lastName: true } } }
          }
        }
      });
      
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }
      
      const response: ApiResponse = { success: true, data: customer };
      return res.status(200).json(response);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to fetch customer details' });
    }
  }

  static async getCustomerTimeline(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const customerActivities = await prisma.customerActivity.findMany({
        where: { customerId: id },
        include: { user: { select: { firstName: true, lastName: true } } }
      });

      const leads = await prisma.lead.findMany({
        where: { customerId: id },
        select: { id: true }
      });
      const leadIds = leads.map(l => l.id);

      const leadActivities = await prisma.leadActivity.findMany({
        where: { leadId: { in: leadIds } },
        include: { user: { select: { firstName: true, lastName: true } } }
      });

      // Merge and sort
      const timeline = [
        ...customerActivities.map(a => ({ ...a, source: 'CUSTOMER' })),
        ...leadActivities.map(a => ({ ...a, source: 'LEAD' }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const response: ApiResponse = { success: true, data: timeline };
      return res.status(200).json(response);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to fetch timeline' });
    }
  }

  static async createCustomer(req: Request, res: Response) {
    try {
      const data = req.body;
      const user = (req as any).user;

      const result = await CustomersService.createCustomer(data, user?.userId, req.ip || '', req.headers['user-agent']);

      return res.status(201).json({ success: true, data: result } as ApiResponse);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to create customer' });
    }
  }

  static async updateCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const user = (req as any).user;

      const result = await CustomersService.updateCustomer(id, data, user?.userId, req.ip || '', req.headers['user-agent']);

      return res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to update customer' });
    }
  }

  static async registerDevice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const user = (req as any).user;

      const result = await CustomersService.registerDevice(id, data, user?.userId, req.ip || '', req.headers['user-agent']);

      return res.status(201).json({ success: true, data: result } as ApiResponse);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to register device' });
    }
  }
}
