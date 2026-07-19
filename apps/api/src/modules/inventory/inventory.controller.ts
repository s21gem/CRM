import { Request, Response } from 'express';
import { InventoryService } from './inventory.service';
import { ApiResponse } from '@fonebox/types';

export class InventoryController {
  static async getDashboard(req: Request, res: Response) {
    try {
      const data = await InventoryService.getDashboardMetrics();
      const response: ApiResponse<typeof data> = {
        success: true,
        message: 'Inventory dashboard metrics retrieved',
        data,
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getItems(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const filters = {
        search: req.query.search as string,
        categoryId: req.query.categoryId as string,
        status: req.query.status as any,
      };

      const data = await InventoryService.getItems(page, limit, filters);
      
      const response: ApiResponse<typeof data.items> = {
        success: true,
        message: 'Inventory items retrieved',
        data: data.items,
        meta: data.meta,
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getItem(req: Request, res: Response) {
    try {
      const data = await InventoryService.getItemById(req.params.id);
      const response: ApiResponse<typeof data> = {
        success: true,
        message: 'Item retrieved',
        data,
      };
      res.json(response);
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async createItem(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await InventoryService.createItem(req.body, userId);
      const response: ApiResponse<typeof data> = {
        success: true,
        message: 'Inventory item created',
        data,
      };
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updateItem(req: Request, res: Response) {
    try {
      const data = await InventoryService.updateItem(req.params.id, req.body);
      const response: ApiResponse<typeof data> = {
        success: true,
        message: 'Inventory item updated',
        data,
      };
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async reserveParts(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { repairOrderId, inventoryItemId, quantity } = req.body;
      const data = await InventoryService.reserveParts(repairOrderId, inventoryItemId, quantity, userId);
      const response: ApiResponse<typeof data> = {
        success: true,
        message: 'Parts reserved successfully',
        data,
      };
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async releaseReservation(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await InventoryService.releaseReservation(req.params.id, userId);
      const response: ApiResponse<typeof data> = {
        success: true,
        message: 'Reservation released',
        data,
      };
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async consumeReservation(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await InventoryService.consumeParts(req.params.id, userId);
      const response: ApiResponse<typeof data> = {
        success: true,
        message: 'Parts consumed successfully',
        data,
      };
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async adjustStock(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { inventoryItemId, newQuantity, reason } = req.body;
      const data = await InventoryService.adjustStock(inventoryItemId, newQuantity, reason, userId);
      const response: ApiResponse<typeof data> = {
        success: true,
        message: 'Stock adjusted successfully',
        data,
      };
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
