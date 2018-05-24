const Models = require('../models');

const Header = Models.Header;

module.exports = {
    list(req, res) {
        return Header.findAll().then((header) => {
            res.status(200).send(header);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    create(req, res) {
        return Header.create({
            setTitle: req.body.setTitle
        }).then((header) => {
            res.status(201).send(header);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    retrieve(req, res) {
        return Header.findById(req.params.headerId).then((header) => {
            if (!header) {
                return res.status(404).send({
                    message: 'Header Not Found.'
                });
            }

            return res.status(200).send(header);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    destroy(req, res) {
        return Header.findById(req.params.headerId).then((header) => {
            if (!header) {
                return res.status(404).send({
                    message: 'Header Not Found.'
                });
            }

            return header.destroy().then(() => {
                res.status(200).send({
                    message: 'Header Deleted Successfully.'
                });
            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
};
