const Controller = require('../controllers');

const GridController = Controller.Grid;
const LessonsController = Controller.Lessons;
const PrivatesController = Controller.Privates;
const InstructorsController = Controller.Instructors;
const GridFactoryController = Controller.GridFactory;
const InstructorPreferencesController = Controller.InstructorPreferences;

module.exports = (app) => {
    app.options('/api/*', (req, res, next) => {
        res.send(200);
    });

    app.get('/api', (req, res) => res.status(200).send({
        routes: {
            list: [
                '/api/grid',
                '/api/factory',
                '/api/lessons',
                '/api/privates',
                '/api/instructors',
                '/api/preferences'
            ],
            description: {
                '/api/grid': 'The list of generated grids and grid data.',
                '/api/lessons': 'The current quantities of lessons',
                '/api/privates': 'The current list of private lessons and related information.',
                '/api/instructors': 'The list of instructors and related information, including preferences and privates.',
                '/api/preferences': 'The list of preferred lessons from a specified instructor.'
            }
        }
    }));
    app.all('/api', (req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Grid
    app.get('/api/grid', GridController.retrieve);
    app.put('/api/grid', GridController.update);
    app.delete('/api/grid', GridController.destroy);
    app.all('/api/grid', (req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // GridFactory
    app.post('/api/factory', GridFactoryController.create);
    app.all('/api/grid', (req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Instructors (all)
    app.get('/api/instructors', InstructorsController.list);
    app.post('/api/instructors', InstructorsController.create);
    app.all('/api/instructors', (req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Instructors (single)
    app.get('/api/instructors/:instructorId', InstructorsController.retrieve);
    app.put('/api/instructors/:instructorId', InstructorsController.update);
    app.delete('/api/instructors/:instructorId', InstructorsController.destroy);
    app.all('/api/instructors/:instructorId', (req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Instructors.Privates (single)
    app.get('/api/instructors/:instructorId/privates', InstructorsController.retrievePrivates);
    app.all('/api/instructors/:instructorId/privates', (req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Instructors.InstructorPreferences (single)
    app.get('/api/instructors/:instructorId/preferences', InstructorsController.retrievePreferences);
    app.all('/api/instructors/:instructorId/preferences', (req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Preferences (all)
    app.get('/api/preferences', InstructorPreferencesController.list);
    app.post('/api/preferences', InstructorPreferencesController.create);
    app.all('/api/preferences', (req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Preferences (single)
    app.get('/api/preferences/:preferenceId', InstructorPreferencesController.retrieve);
    app.put('/api/preferences/:preferenceId', InstructorPreferencesController.update);
    app.delete('/api/preferences/:preferenceId', InstructorPreferencesController.destroy);
    app.all('/api/preferences/:preferenceId', (req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Lessons (all)
    app.get('/api/lessons', LessonsController.list);
    app.all('/api/lessons', (req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Lessons (single)
    app.get('/api/lessons/:lessonId', LessonsController.retrieve);
    app.put('/api/lessons/:lessonId', LessonsController.update);
    app.all('/api/lessons/:lessonId', (req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Privates (all)
    app.get('/api/privates', PrivatesController.list);
    app.post('/api/privates', PrivatesController.create);
    app.all('/api/privates', (req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });

    // Privates (single)
    app.get('/api/privates/:privateId', PrivatesController.retrieve);
    app.put('/api/privates/:privateId', PrivatesController.update);
    app.delete('/api/privates/:privateId', PrivatesController.destroy);
    app.all('/api/privates/:privateId', (req, res) => {
        res.status(405).send({
            message: 'Method Not Allowed',
        });
    });
};
