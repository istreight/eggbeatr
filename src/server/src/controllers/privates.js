const Models = require('../models');

const Private = Models.Private;

module.exports = {
    list(req, res) {
        return Private.findAll({
            where: {
                headerId: req.query.headerId
            }
        }).then((privateLesson) => {
            res.status(200).send(privateLesson);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    create(req, res) {
        return Private.create({
            headerId: req.query.headerId,
            instructorId: req.body.instructorId,
            duration: req.body.duration,
            time: req.body.time
        }).then((privateLesson) => {
            res.status(201).send(privateLesson);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    retrieve(req, res) {
        return Private.findByPk(req.params.privatesId).then((privateLesson) => {
            if (!privateLesson) {
                return res.status(404).send({
                    message: 'Private Not Found.'
                });
            }

            return res.status(200).send(privateLesson);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    update(req, res) {
        return Private.findByPk(req.params.privatesId).then((privateLesson) => {
            if (!privateLesson) {
                return res.status(404).send({
                    message: 'Private Not Found.'
                });
            }

            return privateLesson.update({
                headerId: req.query.headerId || privateLesson.headerId,
                instructorId: req.body.instructorId || privateLesson.instructorId,
                duration: req.body.duration || privateLesson.duration,
                time: req.body.time || privateLesson.time
            }).then((privateLesson) => {
                res.status(200).send(privateLesson);
            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    destroy(req, res) {
        return Private.findByPk(req.params.privatesId).then((privateLesson) => {
            if (!privateLesson) {
                return res.status(400).send({
                    message: 'Private Not Found.',
                });
            }

            return privateLesson.destroy().then(() => {
                res.status(200).send({
                    message: 'Private Deleted Successfully.'
                });
            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
};
