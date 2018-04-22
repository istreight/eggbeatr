const Controller = require('../Controllers');

const LessonsController = Controller.Lessons;
const PrivatesController = Controller.Privates;
const InstructorsController = Controller.Instructors;
const InstructorPreferencesController = Controller.InstructorPreferences;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        routes: {
            list: [
                "/api/instructors",
                "/api/instructors/:instructorId/preferences",
                "/api/lessons",
                "/api/privates"
            ],
            description: {
                "/api/instructors": "The list of instructors and related information, including preferences and privates.",
                "/api/instructors/:instructorId/preferences": "The list of preferred lessons from a specified instructor.",
                "/api/lessons": "The current quantities of lessons",
                "/api/privates": "The current list of private lessons and related information."
            }
        }
    }));

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

    // Preferences
    app.get('/api/instructor/:instructorId/preferences/', InstructorPreferencesController.retrieve);
    app.post('/api/instructor/:instructorId/preferences', InstructorPreferencesController.create);
    app.put('/api/instructor/:instructorId/preferences/', InstructorPreferencesController.update);
    app.delete('/api/instructor/:instructorId/preferences/', InstructorPreferencesController.destroy);
    app.all('/api/instructor/:instructorId/preferences/', (req, res) => {
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
