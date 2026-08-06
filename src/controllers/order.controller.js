import OrderService from '../services/order.service.js';
import CustomError from '../errors/custom.error.js';

class OrderController {
    static async getAll(req, res, next) {
        try {
            const orders = await OrderService.getAll();
            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const order = await OrderService.getById(id);
            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const { customerId, items, deliveryAddress, total } = req.body;
            if (!customerId || !items || !deliveryAddress || total === undefined) {
                throw new CustomError('VALIDATION_ERROR', 'Missing required order fields');
            }
            const order = await OrderService.create(req.body);
            res.status(201).json(order);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const order = await OrderService.update(id, req.body);
            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const order = await OrderService.delete(id);
            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    }
}

export default OrderController;