const express = require('express');
const cors = require('cors');
const models = require('../models');
const { Op } = require("sequelize");

const lotpart = express.Router();

lotpart.use(cors());

lotpart.post('/', (req, res) => {
    let w = {where: {}, include: ['lotPartsLotSubParts', 'operator', 'typePart']};
    if (req.body.lotpartBarcode && req.body.typePartId) {
        w = {
            where: {
                [Op.and]: [
                    { 
                        lotpartBarcode: {
                            [Op.substring]: req.body.lotpartBarcode
                        }
                    },
                    { 
                        typePartId: req.body.typePartId
                    }
                ]
            }
        }
    }
    if (req.body.lotpartBarcode && !req.body.typePartId) {
        w.where= {
            lotpartBarcode: {
                [Op.substring]: req.body.lotpartBarcode
            }
        }
    }
    if (!req.body.lotpartBarcode && req.body.typePartId) {
        w.where = {
            typePartId: req.body.typePartId
        }
    }
    models.LotPart.findAll(w).then(result => {
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

lotpart.post('/add', (req, res) => {
    models.LotPart.create(req.body, {
        include: ['lotPartsLotSubParts']
    }).then(result => {
        res.json({
            message: result.dataValues,
        });
    }).catch(err => {
        res.status(400).json({
            message: { error: err },
        });
    });
});

module.exports = lotpart;
