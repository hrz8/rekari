const express = require('express');
const cors = require('cors');
const models = require('../models');
const TypePart = require('../models/typepart')(models.sequelize, models.Sequelize.DataTypes);
const { Op } = require("sequelize");

const typepart = express.Router();

typepart.use(cors());

typepart.post('/', (req, res) => {
    let w;
    if (req.body.name && req.body.section) {
        w = {
            where: {
                [Op.and]: [
                    { 
                        name: {
                            [Op.substring]: req.body.name
                        }
                    },
                    { 
                        section: req.body.section
                    }
                ]
            }
        }
    }

    if (req.body.name && !req.body.section) {
        w = {
            where: {
                name: {
                    [Op.substring]: req.body.name
                }
            }
        }
    }

    if (!req.body.name && req.body.section) {
        w = {
            where: {
                section: req.body.section
            }
        }
    }

    const q = (req.body.name || req.body.section) ?
        TypePart.findAll(w) : 
        TypePart.findAll();
    q.then(result => {
        if (result) {
            res.json({
                message: result
            });
        }
    }).catch(err => {
        res.status(400).json({
            message: { error: err },
        });
    });
});

typepart.post('/add', (req, res) => {
    TypePart.create(req.body).then(result => {
        res.json({
            message: result.dataValues,
        });
    }).catch(err => {
        res.status(400).json({
            message: { error: err },
        });
    });
});

typepart.post('/detail', (req, res) => {
    TypePart.findOne({
        where: { id: req.body.id }
    }).then(result => {
        if (result) {
            res.json({
                message: result.dataValues,
            });
        }
        else {
            res.status(400).json({
                message: { error: 'typepart does not exist' },
            });
        }
    }).catch(err => {
        res.status(400).json({
            message: { error: err },
        });
    });
});

typepart.post('/delete', (req, res) => {
    TypePart.findOne({
        where: { id: req.body.id }
    }).then(result => {
        if (result) {
            TypePart.destroy({
                where: { id: result.dataValues.id }
            }).then(r => {
                res.json({
                    message: result.dataValues,
                });
            }).catch(err => {
                res.status(400).json({
                    message: { error: err },
                });
            });
        }
        else {
            res.status(400).json({
                message: { error: 'typepart does not exist' },
            });
        }
    }).catch(err => {
        res.status(400).json({
            message: { error: err },
        });
    });
});

typepart.post('/edit', (req, res) => {
    TypePart.findOne({
        where: { id: req.body.id }
    }).then(result => {
        if (result) {
            const  { id, ...reqWithoutId } = req.body;
            TypePart.update(reqWithoutId, {
                where: {
                    id: id
                }
            }).then(updated => {
                if (updated) {
                    res.json({
                        message: req.body,
                    });
                }
                else {
                    res.status(400).json({
                        message: { error: 'database error' },
                    });
                }
            }).catch(err => {
                res.status(400).json({
                    message: { error: err },
                });
            });
        }
        else {
            res.status(400).json({
                message: { error: 'typepart does not exist' },
            });
        }
    }).catch(err => {
        res.status(400).json({
            message: { error: err },
        });
    });
});

module.exports = typepart;