const Models = require('../models');

const Lesson = Models.Lesson;

module.exports = {
    list(req, res) {
        return Lesson.findAll().then((lesson) => {
            res.status(200).send(lesson);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    retrieve(req, res) {
        return Lesson.findById(req.params.lessonId).then((lesson) => {
            if (!lesson) {
                return res.status(404).send({
                    message: 'Lesson Not Found'
                });
            }

            return res.status(200).send(lesson);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    update(req, res) {
        return Lesson.findById(req.params.lessonId).then((lesson) => {
            if (!lesson) {
                return res.status(404).send({
                    message: 'Lesson Not Found'
                });
            }

            return lesson.update({
                quantity: req.body.quantity || lesson.quantity
            }).then((lesson) => {
                res.status(200).send(lesson);
            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
};
