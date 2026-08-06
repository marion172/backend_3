import MockService from '../services/mock.service.js';

class MockController {

    static async mockingUsers(req, res, next) {
        try {
            const count = req.query.count ?? req.body?.count ?? 10;
            const users = MockService.generateMockUsers(count);

            return res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    static async mockingOrders(req, res, next) {
        try {
            const count = req.query.count ?? req.body?.count ?? 10;
            const saveToDatabase = req.query.saveToDatabase === 'true' || req.query.saveToDatabase === true || req.body?.saveToDatabase === true;

            if (saveToDatabase) {
                const result = await MockService.seedOrders(count);
                return res.status(201).json(result);
            }

            const orders = MockService.generateMockOrders(count);
            return res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    }

    static async generateProducts(req, res, next) {
        try {
            const count = req.query.count ?? req.body?.count ?? 10;
            const saveToDatabase = req.query.saveToDatabase === 'true' || req.query.saveToDatabase === true || req.body?.saveToDatabase === true;

            const products = MockService.generateMockProducts(count);

            if (saveToDatabase) {
                await MockService.saveMockProducts(products);
                return res.status(201).json({ products, message: 'Products saved in db successfully' });
            }

            return res.status(200).json({ products, message: 'Products generated successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async generateData(req, res, next) {
        try {
            const userCount = req.query.users ?? req.body?.users ?? 10;
            const orderCount = req.query.orders ?? req.body?.orders ?? 10;
            const saveToDatabase = req.query.saveToDatabase === 'true' || req.query.saveToDatabase === true || req.body?.saveToDatabase === true;

            if (saveToDatabase) {
                const result = await MockService.seedFullData({ userCount, orderCount });
                return res.status(201).json(result);
            }

            const data = MockService.generateFullMockData({ userCount, orderCount });
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    static async seedUsers(req, res, next) {
        try {
            const count = req.query.count ?? req.body?.count ?? 10;
            const result = await MockService.seedUsers(count);

            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async seedOrders(req, res, next) {
        try {
            const count = req.query.count ?? req.body?.count ?? 10;
            const result = await MockService.seedOrders(count);

            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async seedDeliveries(req, res, next) {
        try {
            const count = req.query.count ?? req.body?.count ?? 10;
            const result = await MockService.seedDeliveries(count);

            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async seedData(req, res, next) {
        try {
            const userCount = req.query.users ?? req.body?.users ?? 10;
            const orderCount = req.query.orders ?? req.body?.orders ?? 10;

            const result = await MockService.seedFullData({ userCount, orderCount });

            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default MockController;
