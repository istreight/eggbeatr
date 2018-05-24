const Models = require('../models');

const Private = Models.Private;

module.exports = {
    list(req, res) {
        return Private.findAll({
            where: {
                headerId: req.query.headerId
            }
        }).then((_private) => {
            res.status(200).send(_private);
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
        }).then((_private) => {
            res.status(201).send(_private);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    retrieve(req, res) {
        return Private.findById(req.params.privateId).then((_private) => {
            if (!_private) {
                return res.status(404).send({
                    message: 'Private Not Found.'
                });
            }

            return res.status(200).send(_private);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    update(req, res) {
        return Private.findById(req.params.privateId).then((_private) => {
            if (!_private) {
                return res.status(404).send({
                    message: 'Private Not Found.'
                });
            }

            return _private.update({
                headerId: req.query.headerId || _private.headerId,
                instructorId: req.body.instructorId || _private.instructorId,
                duration: req.body.duration || _private.duration,
                time: req.body.time || _private.time
            }).then((_private) => {
                res.status(200).send(_private);
            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    destroy(req, res) {
        return Private.findById(req.params.privateId).then((_private) => {
            if (!_private) {
                return res.status(400).send({
                    message: 'Private Not Found.',
                });
            }

            return _private.destroy().then(() => {
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
