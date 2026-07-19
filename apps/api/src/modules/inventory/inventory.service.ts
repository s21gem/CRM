import { PrismaClient, Prisma, InventoryItemStatus, InventoryMovementType, ReservationStatus, InventoryMovementReason } from '@prisma/client';

const prisma = new PrismaClient();

export class InventoryService {
  /**
   * Helper to calculate available stock.
   */
  static getAvailableStock(currentStock: number, reservedStock: number): number {
    return currentStock - reservedStock;
  }

  /**
   * Creates a new inventory item and logs INITIAL_STOCK movement if quantity > 0.
   */
  static async createItem(data: Prisma.InventoryItemUncheckedCreateInput, userId: string) {
    return prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.create({
        data,
      });

      if (item.currentStock > 0) {
        await tx.inventoryMovement.create({
          data: {
            inventoryItemId: item.id,
            quantity: item.currentStock,
            previousStock: 0,
            newStock: item.currentStock,
            movementType: InventoryMovementType.IN,
            reason: InventoryMovementReason.INITIAL_STOCK,
            createdById: userId,
          },
        });
      }

      return item;
    });
  }

  /**
   * Updates an inventory item's core details.
   */
  static async updateItem(id: string, data: Prisma.InventoryItemUncheckedUpdateInput) {
    // Current stock and reserved stock cannot be directly updated here; they require movements.
    delete data.currentStock;
    delete data.reservedStock;
    
    return prisma.inventoryItem.update({
      where: { id },
      data,
    });
  }

  /**
   * Gets an item by ID.
   */
  static async getItemById(id: string) {
    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    if (!item) throw new Error('Item not found');
    
    return {
      ...item,
      availableStock: this.getAvailableStock(item.currentStock, item.reservedStock),
    };
  }

  /**
   * Lists items with pagination and filters.
   */
  static async getItems(
    page: number = 1,
    limit: number = 20,
    filters: any = {}
  ) {
    const where: Prisma.InventoryItemWhereInput = {
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.status && { status: filters.status }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { partNumber: { contains: filters.search, mode: 'insensitive' } },
          { sku: { contains: filters.search, mode: 'insensitive' } },
          { barcode: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      prisma.inventoryItem.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.inventoryItem.count({ where }),
    ]);

    const itemsWithAvailable = items.map(item => ({
      ...item,
      availableStock: this.getAvailableStock(item.currentStock, item.reservedStock),
    }));

    return {
      items: itemsWithAvailable,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Reserves parts for a Repair Order.
   */
  static async reserveParts(
    repairOrderId: string,
    inventoryItemId: string,
    quantity: number,
    userId: string
  ) {
    if (quantity <= 0) throw new Error('Quantity must be greater than zero');

    return prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findUnique({ where: { id: inventoryItemId } });
      if (!item) throw new Error('Inventory item not found');
      if (item.status !== InventoryItemStatus.ACTIVE) throw new Error('Item is not active');

      const available = this.getAvailableStock(item.currentStock, item.reservedStock);
      if (available < quantity) {
        throw new Error(`Insufficient stock. Only ${available} available.`);
      }

      // Check for existing ACTIVE reservation to merge (Option B)
      let reservation = await tx.inventoryReservation.findUnique({
        where: {
          active_reservation_unique: {
            repairOrderId,
            inventoryItemId,
            status: ReservationStatus.ACTIVE,
          },
        },
      });

      if (reservation) {
        reservation = await tx.inventoryReservation.update({
          where: { id: reservation.id },
          data: {
            quantity: reservation.quantity + quantity,
          },
        });
      } else {
        reservation = await tx.inventoryReservation.create({
          data: {
            repairOrderId,
            inventoryItemId,
            quantity,
            status: ReservationStatus.ACTIVE,
            unitCostSnapshot: item.defaultCost,
            unitPriceSnapshot: item.defaultPrice,
          },
        });
      }

      // Update reserved stock
      const updatedItem = await tx.inventoryItem.update({
        where: { id: inventoryItemId },
        data: {
          reservedStock: { increment: quantity },
        },
      });

      // Create Movement Ledger Entry
      await tx.inventoryMovement.create({
        data: {
          inventoryItemId,
          repairOrderId,
          reservationId: reservation.id,
          quantity,
          previousStock: item.currentStock, // Note: currentStock doesn't change on reserve
          newStock: item.currentStock,
          movementType: InventoryMovementType.RESERVE,
          reason: InventoryMovementReason.REPAIR,
          createdById: userId,
        },
      });

      // Log Repair Activity
      await tx.repairActivity.create({
        data: {
          repairOrderId,
          userId,
          action: 'PARTS_RESERVED',
          details: `Reserved ${quantity} x ${item.name} (SKU: ${item.sku})`,
        },
      });

      return reservation;
    });
  }

  /**
   * Releases a reservation back into available stock.
   */
  static async releaseReservation(reservationId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const reservation = await tx.inventoryReservation.findUnique({
        where: { id: reservationId },
        include: { item: true },
      });

      if (!reservation) throw new Error('Reservation not found');
      if (reservation.status !== ReservationStatus.ACTIVE) {
        throw new Error(`Cannot release reservation with status ${reservation.status}`);
      }

      const updatedReservation = await tx.inventoryReservation.update({
        where: { id: reservationId },
        data: {
          status: ReservationStatus.RELEASED,
          releasedAt: new Date(),
        },
      });

      // Decrease reserved stock
      await tx.inventoryItem.update({
        where: { id: reservation.inventoryItemId },
        data: {
          reservedStock: { decrement: reservation.quantity },
        },
      });

      // Ledger entry
      await tx.inventoryMovement.create({
        data: {
          inventoryItemId: reservation.inventoryItemId,
          repairOrderId: reservation.repairOrderId,
          reservationId: reservation.id,
          quantity: reservation.quantity,
          previousStock: reservation.item.currentStock,
          newStock: reservation.item.currentStock,
          movementType: InventoryMovementType.RELEASE,
          reason: InventoryMovementReason.REPAIR,
          createdById: userId,
        },
      });

      // Log Repair Activity
      await tx.repairActivity.create({
        data: {
          repairOrderId: reservation.repairOrderId,
          userId,
          action: 'PARTS_RELEASED',
          details: `Released ${reservation.quantity} x ${reservation.item.name} from reservation`,
        },
      });

      return updatedReservation;
    });
  }

  /**
   * Consumes reserved parts.
   */
  static async consumeParts(reservationId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const reservation = await tx.inventoryReservation.findUnique({
        where: { id: reservationId },
        include: { item: true },
      });

      if (!reservation) throw new Error('Reservation not found');
      if (reservation.status !== ReservationStatus.ACTIVE) {
        throw new Error(`Cannot consume reservation with status ${reservation.status}`);
      }

      const updatedReservation = await tx.inventoryReservation.update({
        where: { id: reservationId },
        data: {
          status: ReservationStatus.CONSUMED,
          consumedAt: new Date(),
        },
      });

      // Decrease both currentStock and reservedStock
      const newStock = reservation.item.currentStock - reservation.quantity;
      if (newStock < 0) {
        throw new Error('Consumption would cause negative stock, database corrupted');
      }

      await tx.inventoryItem.update({
        where: { id: reservation.inventoryItemId },
        data: {
          currentStock: { decrement: reservation.quantity },
          reservedStock: { decrement: reservation.quantity },
        },
      });

      // Ledger entry
      await tx.inventoryMovement.create({
        data: {
          inventoryItemId: reservation.inventoryItemId,
          repairOrderId: reservation.repairOrderId,
          reservationId: reservation.id,
          quantity: reservation.quantity,
          previousStock: reservation.item.currentStock,
          newStock: newStock,
          movementType: InventoryMovementType.CONSUME,
          reason: InventoryMovementReason.REPAIR,
          createdById: userId,
        },
      });

      // Update Repair partsCost if you wanted to here, or leave it for later cost aggregation
      // We will increment the partsCost dynamically.
      await tx.repairOrder.update({
        where: { id: reservation.repairOrderId },
        data: {
          partsCost: { increment: reservation.unitPriceSnapshot * reservation.quantity },
        }
      });

      // Log Repair Activity
      await tx.repairActivity.create({
        data: {
          repairOrderId: reservation.repairOrderId,
          userId,
          action: 'PARTS_CONSUMED',
          details: `Consumed ${reservation.quantity} x ${reservation.item.name} for repair`,
        },
      });

      return updatedReservation;
    });
  }

  /**
   * Manual Stock Adjustment
   */
  static async adjustStock(
    inventoryItemId: string,
    newQuantity: number,
    reasonText: string,
    userId: string
  ) {
    if (newQuantity < 0) throw new Error('Stock cannot be negative');

    return prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findUnique({ where: { id: inventoryItemId } });
      if (!item) throw new Error('Item not found');

      const difference = newQuantity - item.currentStock;
      if (difference === 0) return item; // No change

      const available = this.getAvailableStock(item.currentStock, item.reservedStock);
      // New available cannot be negative
      if (available + difference < 0) {
        throw new Error('Adjustment would cause available stock to become negative due to reservations.');
      }

      const adjustment = await tx.inventoryAdjustment.create({
        data: {
          inventoryItemId,
          oldQuantity: item.currentStock,
          newQuantity,
          reason: reasonText,
          createdById: userId,
          approvedById: userId, // Assuming auto-approve for now
        },
      });

      const updatedItem = await tx.inventoryItem.update({
        where: { id: inventoryItemId },
        data: { currentStock: newQuantity },
      });

      await tx.inventoryMovement.create({
        data: {
          inventoryItemId,
          adjustmentId: adjustment.id,
          quantity: Math.abs(difference),
          previousStock: item.currentStock,
          newStock: newQuantity,
          movementType: difference > 0 ? InventoryMovementType.IN : InventoryMovementType.OUT,
          reason: InventoryMovementReason.ADJUSTMENT,
          notes: reasonText,
          createdById: userId,
        },
      });

      return updatedItem;
    });
  }

  /**
   * Retrieves dashboard metrics.
   */
  static async getDashboardMetrics() {
    const [totalItems, outOfStock, lowStock, totalMovements] = await Promise.all([
      prisma.inventoryItem.count(),
      prisma.inventoryItem.count({ where: { currentStock: 0 } }),
      prisma.inventoryItem.count({
        where: {
          currentStock: { gt: 0, lte: prisma.inventoryItem.fields.reorderLevel },
        },
      }),
      prisma.inventoryMovement.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    const activeReservations = await prisma.inventoryReservation.count({
      where: { status: ReservationStatus.ACTIVE },
    });

    const recentMovements = await prisma.inventoryMovement.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        item: { select: { name: true, sku: true } },
        createdBy: { select: { firstName: true, lastName: true } },
      },
    });

    return {
      totalItems,
      outOfStock,
      lowStock,
      activeReservations,
      movementsToday: totalMovements,
      recentMovements,
    };
  }
}
