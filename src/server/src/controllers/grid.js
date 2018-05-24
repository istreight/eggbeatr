const Models = require('../models');

const Grid = Models.Grid;

module.exports = {
    retrieve(req, res) {
        return Grid.findAll({
            where: {
                headerId: req.query.headerId
            }
        }).then((grid) => {
            res.status(200).send(grid);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    create(req, res) {
        return Grid.create({
            headerId: req.query.headerId,
            lessonTimes: req.body.lessonTimes
        }).then((grid) => {
            res.status(201).send(grid);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    update(req, res) {
        return Grid.findById(req.params.gridId).then((grid) => {
            if (!grid) {
                return res.status(404).send({
                    message: 'Grid Not Found.'
                });
            }

            return grid.update({
                headerId: req.query.headerId || grid.headerId,
                lessonTimes: req.body.lessonTimes || grid.lessonTimes
            }).then((grid) => {
                res.status(200).send(grid);
            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    destroy(req, res) {
        return Grid.findById(req.params.gridId).then((grid) => {
            if (!grid) {
                return res.status(404).send({
                    message: 'Grid Not Found.'
                });
            }

            return grid.destroy().then(() => {
                res.status(200).send({
                    message: 'Grid Deleted Successfully.'
                });
            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
};
