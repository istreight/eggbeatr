const Models = require('../models');

const Grid = Models.Grid;

module.exports = {
    retrieve(req, res) {
        return Grid.find({
            where: {
                id: 1
            }
        }).then((grid) => {
            res.status(200).send(grid);
        }).catch((error) => {
            res.status(400).send(error);
        });
    },
    update(req, res) {
        return Grid.find({
            where: {
                id: 1
            }
        }).then((grid) => {
            if (!grid) {
                return res.status(404).send({
                    message: 'Grid Not Found'
                });
            }

            return grid.update({
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
        return Grid.find({
            where: {
                id: 1
            }
        }).then((grid) => {
            if (!grid) {
                return res.status(404).send({
                    message: 'Grid Not Found'
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
