import db from '../services/valvulasServices.js'
import express from 'express'
import { body, validationResult } from 'express-validator'

const router = express.Router()
const keyApi = 'valueKey'

router.post('/', [
    body('idValvula').notEmpty().isNumeric().withMessage('IdValvula inválido'),
    body('segundos').notEmpty().isNumeric().withMessage('segundos inválido'),
    body('key').notEmpty().withMessage('Key vazia')
], async (req, res) =>{

    const errosValidation = validationResult(req)

    if(!errosValidation.isEmpty()){
        return res.status(400).json({erros: errosValidation.array()})
    }

    const {idValvula, segundos, key} = req.body

    if(key != keyApi) res.status(401).end()
    
    try {
        await db.inserValvula(idValvula, segundos)

        res.status(201).json({
            msg: 'Cadastrado com sucesso'
        })
    } catch (err) {
        res.status(500).json({
            err
        })
    }
})

router.get('/allData',[
    body('key').notEmpty().withMessage('Key vazia')
], async (req, res) =>{

    const errosValidation = validationResult(req)

    if(!errosValidation.isEmpty()){
        return res.status(400).json({erros: errosValidation.array()})
    }

    const {key} = req.body

    if(key != keyApi) res.status(401).end()

    try {
        const results = await db.getAllDataValvula()

        if(results.length == 0){
            res.status(204).end() // code 204 para sem conteudo
        }
        else{
            res.status(200).json(results)
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/allDataCount',[
    body('key').notEmpty().withMessage('key vazia')
], async (req, res)=>{

    const errosValidation = validationResult(req)

    if(!errosValidation.isEmpty()){
        return res.status(400).json({erros: errosValidation.array()})
    }

    const {key} = req.body

    if(key != keyApi) res.status(401).end()

    try {
        const results = await db.getAllDataValvulaCount()
        res.status(200).json(results[0])
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/allDataId',[
    body('key').notEmpty().withMessage('key vazia'),
    body('idSensor').notEmpty().isNumeric().withMessage('id inválido')
], async (req, res)=>{

    const errosValidation = validationResult(req)

    if(!errosValidation.isEmpty()){
        return res.status(400).json({erros: errosValidation.array()})
    }

    const {key, idSensor} = req.body

    if(key != keyApi) res.status(401).end()

    try {
        const results = await db.getAllDataValvulaByID(idSensor)

        if(results.length == 0){
            res.status(204).end() // code 204 para sem conteudo
        }
        else{
            res.status(200).json(results)
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/lastData',[
    body('key').notEmpty().withMessage('key vazia'),
    body('last').notEmpty().withMessage('Last invalido')
], async (req, res)=>{

    const errosValidation = validationResult(req)

    if(!errosValidation.isEmpty()){
        return res.status(400).json({erros: errosValidation.array()})
    }

    const {key, last} = req.body

    if(key != keyApi) res.status(401).end()

    try {
        const results = await db.getLastDataValvula(last)

        if(results.length == 0){
            res.status(204).end() // code 204 para sem conteudo
        }
        else{
            res.status(200).json(results)
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

export default router