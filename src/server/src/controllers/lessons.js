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

            return instructor.update({
                title: req.body.title || instructor.title,
                quantity: req.body.quantity || instructor.quantity
            }).then(() => {
                res.status(200).send(lesson);
            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
};
