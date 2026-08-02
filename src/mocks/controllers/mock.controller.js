import MockService from '../services/mock.service.js';

class MockController {

    static async mockingUsers(req, res) {
        try {
            const rawCount = req.query.count;
            const count = rawCount ? (isNaN(parseInt(rawCount)) ? 10 : parseInt(rawCount)) : 10;

            if (count < 1 || count > 100) {
                return res.status(400).json({ error: 'Ingrese un numero entre 1 y 100.' });
            }

            const users = MockService.generateMockUsers(count);

            return res.status(200).json(users);
        } catch (error) {
            console.warn('Error generating mock users:', error);
            return res.status(500).json({ error: 'Error generating mock users' });
        }
    }

    static async mockingOrders(req, res) {
        try {
            const rawCount = req.query.count;
            const count = rawCount ? (isNaN(parseInt(rawCount)) ? 10 : parseInt(rawCount)) : 10;

            if (count < 1 || count > 100) {
                return res.status(400).json({ error: 'Ingrese un numero entre 1 y 100.' });
            }

            const orders = MockService.generateMockOrders(count);

            return res.status(200).json(orders);
        } catch (error) {
            console.warn('Error generating mock orders:', error);
            return res.status(500).json({ error: 'Error generating mock orders' });
        }
    }

    static async generateProducts(req, res) {
        try {
            const count = req.query.count || req.body?.count;
            const saveToDatabase = req.query.saveToDatabase === 'true' || req.query.saveToDatabase === true || req.body?.saveToDatabase === true;

            const countNum = isNaN(parseInt(count)) ? 10 : parseInt(count);

            if (countNum < 1 || countNum > 100) {
                return res.status(400).json({ error: 'Ingrese un numero entre 1 y 100.' });
            }

            const products = MockService.generateMockProducts(countNum);

            if (saveToDatabase) {
                await MockService.saveMockProducts(products);
                return res.status(201).json({ products, message: 'Products saved in db successfully' });
            }

            return res.status(200).json({ products, message: 'Products generated successfully' });
        } catch (error) {
            console.log('Error generating mock products:', error);
            return res.status(500).json({ statusCode: 500, message: 'Error generating mock products' });
        }
    }

    static async generateData(req, res) {
        try {
            const userCount = parseInt(req.query.users) || 10;
            const orderCount = parseInt(req.query.orders) || 10;

            const data = MockService.generateFullMockData({ userCount, orderCount });

            return res.status(200).json(data);
        } catch (error) {
            console.warn('Error generating full mock data:', error);
            return res.status(500).json({ error: 'Error generating full mock data' });
        }
    }

    static async seedUsers(req, res) {
        try {
            const rawCount = req.query.count;
            const count = rawCount ? (isNaN(parseInt(rawCount)) ? 10 : parseInt(rawCount)) : 10;

            if (count < 1 || count > 100) {
                return res.status(400).json({ error: 'Ingrese un número de registros válido entre 1 y 100.' });
            }

            const result = await MockService.seedUsers(count);

            return res.status(201).json(result);
        } catch (error) {
            console.error('Error seeding users in DB:', error);
            return res.status(500).json({ error: 'Error al insertar registros de prueba en MongoDB' });
        }
    }
}

export default MockController;
