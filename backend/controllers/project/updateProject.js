const ProjectModel = require("../../models/projectModel");
const { formatResponse } = require("../../utils/helper");
const Joi = require('joi');

const updateProject = async (req, res) => {
    const paramsSchema = Joi.object({
        id: Joi.number().integer().required()
    });

    const bodySchema = Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        microcontroller: Joi.string()
    });

    const { error: paramsError, value: paramsValue } = paramsSchema.validate(req.params);
    if (paramsError) {
        const formattedError = paramsError.details.map(detail => detail.message.replace(/"/g, '')).join(', ');
        return res.status(400).json(formatResponse('error', 'Validation Error', formattedError));
    }
    
    const { error: bodyError, value: bodyValue } = bodySchema.validate(req.body);
    if (bodyError) {
        const formattedError = bodyError.details.map(detail => detail.message.replace(/"/g, '')).join(', ');
        return res.status(400).json(formatResponse('error', 'Validation Error', formattedError));
    }

    try {
        const project = await ProjectModel.updateProject(paramsValue.id, bodyValue);
        res.status(200).json(formatResponse('success', 'Project updated successfully', project));
    } catch (error) {
        res.status(500).json(formatResponse('error', 'Internal Server Error', error.message));
    }
}

module.exports = updateProject;