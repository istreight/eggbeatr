const Controller = require('../controllers');

const GridController = Controller.Grid;
const HeadersController = Controller.Headers;
const LessonsController = Controller.Lessons;
const PrivatesController = Controller.Privates;
const InstructorsController = Controller.Instructors;
const GridFactoryController = Controller.GridFactory;
const InstructorPreferencesController = Controller.InstructorPreferences;

module.exports = (app) => {
    app.options('/api/*', (_req, res) => {
        res.sendStatus(200);
    });

    app.get('/api', (_req, res) => res.status(200).send({
        routes: {
            list: [
                '/api/headers',
                '/api/grid',
                '/api/factory',
                '/api/lessons',
                '/api/privates',
                '/api/instructors',
                '/api/preferences'
            ],
            description: {
                '/api/headers': 'The list of header titles and data.',
                '/api/grid': 'The list of grids and grid data.',
                '/api/lessons': 'The current quantities of lessons',
                '/api/privates': 'The current list of private lessons and related information.',
                '/api/instructors': 'The list of instructors and related information, including preferences and privates.',
                '/api/preferences': 'The list of preferred lessons from a specified instructor.'
            }
        }
    }));
    app.all('/api', (_req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Header (all)
    app.get('/api/headers', HeadersController.list);
    app.post('/api/headers', HeadersController.create);
    app.all('/api/headers', (_req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Header (single)
    app.get('/api/headers/:headerId', HeadersController.retrieve);
    app.delete('/api/headers/:headerId', HeadersController.destroy);
    app.all('/api/headers/:headerId', (_req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Grid (all)
    app.get('/api/grid', GridController.retrieve);
    app.post('/api/grid', GridController.create);
    app.all('/api/grid', (_req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Grid (single)
    app.put('/api/grid/:gridId', GridController.update);
    app.delete('/api/grid/:gridId', GridController.destroy);
    app.all('/api/grid/:gridId', (_req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // GridFactory
    app.post('/api/factory', GridFactoryController.create);
    app.all('/api/factory', (_req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Instructors (all)
    app.get('/api/instructors', InstructorsController.list);
    app.post('/api/instructors', InstructorsController.create);
    app.all('/api/instructors', (_req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Instructors (single)
    app.get('/api/instructors/:instructorId', InstructorsController.retrieve);
    app.put('/api/instructors/:instructorId', InstructorsController.update);
    app.delete('/api/instructors/:instructorId', InstructorsController.destroy);
    app.all('/api/instructors/:instructorId', (_req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Preferences (all)
    app.get('/api/preferences', InstructorPreferencesController.list);
    app.post('/api/preferences', InstructorPreferencesController.create);
    app.all('/api/preferences', (_req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Preferences (single)
    app.get('/api/preferences/:preferenceId', InstructorPreferencesController.retrieve);
    app.put('/api/preferences/:preferenceId', InstructorPreferencesController.update);
    app.delete('/api/preferences/:preferenceId', InstructorPreferencesController.destroy);
    app.all('/api/preferences/:preferenceId', (_req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Lessons (all)
    app.get('/api/lessons', LessonsController.list);
    app.post('/api/lessons', LessonsController.create);
    app.all('/api/lessons', (_req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Lessons (single)
    app.get('/api/lessons/:lessonId', LessonsController.retrieve);
    app.put('/api/lessons/:lessonId', LessonsController.update);
    app.delete('/api/lessons/:lessonId', LessonsController.destroy);
    app.all('/api/lessons/:lessonId', (_req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Privates (all)
    app.get('/api/privates', PrivatesController.list);
    app.post('/api/privates', PrivatesController.create);
    app.all('/api/privates', (_req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Privates (single)
    app.get('/api/privates/:privatesId', PrivatesController.retrieve);
    app.put('/api/privates/:privatesId', PrivatesController.update);
    app.delete('/api/privates/:privatesId', PrivatesController.destroy);
    app.all('/api/privates/:privatesId', (_req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });
};
