import DeliveryService from '../services/delivery.service.js';
import CustomError from '../errors/custom.error.js';

class DeliveryController {
    static async getAll(req, res, next) {
        try {
            const deliveries = await DeliveryService.getAll();
            res.status(200).json(deliveries);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const delivery = await DeliveryService.getById(id);
            res.status(200).json(delivery);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const { orderId } = req.body;
            if (!orderId) {
                throw new CustomError('VALIDATION_ERROR', 'Missing required delivery fields (orderId)');
            }
            const delivery = await DeliveryService.create(req.body);
            res.status(201).json(delivery);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const delivery = await DeliveryService.update(id, req.body);
            res.status(200).json(delivery);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const delivery = await DeliveryService.delete(id);
            res.status(200).json(delivery);
        } catch (error) {
            next(error);
        }
    }
}

export default DeliveryController;