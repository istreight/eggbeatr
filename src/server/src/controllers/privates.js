const Models = require('../models');

const Private = Models.Private;

module.exports = {
    list(req, res) {
        return Private.findAll().then((_private) => {
            res.status(200).send(_private);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    create(req, res) {
        return Private.create({
            instructor: req.body.instructor,
            time: req.body.time,
            duration: req.body.duration,
            include: req.body.include
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
                    message: 'Private Not Found'
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
                    message: 'Private Not Found'
                });
            }

            return _private.update({
                instructor: req.body.instructor || _private.instructor,
                time: req.body.time || _private.time,
                duration: req.body.duration || _private.duration,
                include: req.body.include || _private.include
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
                    message: 'Private Not Found',
                });
            }

            return _private.destroy().then(() => {
                res.status(200).send({
                    message: 'Private deleted successfully.'
                });
            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
};
