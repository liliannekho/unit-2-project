const Item = require('../models/items')
const Todo = require('../models/items')
const User = require('../models/user')

exports.create = async function (req,res){
    try{
        req.body.user = req.user._id
        const item = await Item.create(req.body)
        req.user.items?
        req.user.items.addToSet({ _id: item._id}):
        req.user.items = ({_id: item._id})
        await req.user.save()
        res.json(item)
    } catch(error) {
        res.status(400).json({ message: error.message})
    }
}

exports.show = async function (req, res) {
    try{
        const item = await Item.findOne({ _id: req.params.id })
        res.json(item)
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
}

exports.indexComplete = async function (req, res) {
    try{
        const items = await Item.find({ completed: true, user: req.user._id })
        res.json(items)
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
}

exports.indexNotComplete = async function (req, res) {
    try{
        const items = await Item.find({ completed: false, user: req.user._id})
        res.json(items)
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
}

exports.update = async function (req,res){
    try{
        const item = await Item.findOneAndUpdate({ _id: req.params.id}, req.body, { new: true})
        res.json(item)
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
}

exports.delete = async function (req,res){
    try{
        const item = await Item.findOneAndDelete({ _id: req.params.id})
        res.sendStatus(204)
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
}