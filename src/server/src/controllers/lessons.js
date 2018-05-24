const Models = require('../models');

const Lesson = Models.Lesson;

module.exports = {
    list(req, res) {
        return Lesson.findAll({
            where: {
                headerId: req.query.headerId
            }
        }).then((lesson) => {
            res.status(200).send(lesson);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    create(req, res) {
        return Lesson.create({
            headerId: req.query.headerId,
            quantity: req.body.quantity,
            title: req.body.title
        }).then((instructor) => {
            res.status(201).send(instructor);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    retrieve(req, res) {
        return Lesson.findById(req.params.lessonId).then((lesson) => {
            if (!lesson) {
                return res.status(404).send({
                    message: 'Lesson Not Found.'
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
                    message: 'Lesson Not Found.'
                });
            }

            var q = req.body.quantity || lesson.quantity;
            if (req.body.quantity === 0) {
                q = 0;
            }

            return lesson.update({
                quantity: q,
                title: req.body.title || lesson.title
            }).then((lesson) => {
                res.status(200).send(lesson);
            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    destroy(req, res) {
        return Lesson.findById(req.params.lessonId).then((lesson) => {
            if (!lesson) {
                return res.status(404).send({
                    message: 'Lesson Not Found.'
                });
            }

            return lesson.destroy().then(() => {
                res.status(200).send({
                    message: 'Lesson Deleted Successfully.'
                });
            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
};
