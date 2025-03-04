const SensorModel = require("../../../models/sensorModel");
const ProjectModel = require("../../../models/projectModel");
const { formatResponse } = require("../../../utils/helper");
const Joi = require('joi');

const sendSensorDataByName = async (req, res) => {
    const paramsSchema = Joi.object({
        projectName: Joi.string().required(),
        sensorName: Joi.string().required(),
    });

    const bodySchema = Joi.object({
        id: Joi.number().required(),
        value: Joi.number().required(),
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
        // Check if project exists
        const projectExists = await ProjectModel.findProjectByName(paramsValue.projectName);
        if (!projectExists) {
            return res.status(404).json(formatResponse('error', 'Project not found'));
        }

        // Check if Sensor exists
        const sensor = await SensorModel.findSensorByName(paramsValue.sensorName);
        if (!sensor) {
            return res.status(404).json(formatResponse('error', 'Sensor not found'));
        }

        // Check if input type sensor
        if (sensor.type === 'INPUT') {
            if(bodyValue.value !== 0 && bodyValue.value !== 1){
                return res.status(400).json(formatResponse('error', 'Validation Error', 'Value must be 0 or 1 for input type sensor'));
            }
            const sensorData = await SensorModel.createSensorData({
                value: bodyValue.value,
                sensorId: sensor.id
            });
            // Emit sensor data via WebSocket
            req.io.emit('sensorData', sensorData);
            res.status(201).json(formatResponse('success', 'Input data change sent successfully', sensorData));
        } else{
            const sensorData = await SensorModel.createSensorData({
                value: bodyValue.value,
                sensorId: sensor.id
            });
    
            // Emit sensor data via WebSocket
            req.io.emit('sensorData', sensorData);
            res.status(201).json(formatResponse('success', 'Output Sensor data sent successfully', sensorData));
        }
    } catch (error) {
        res.status(500).json(formatResponse('error', 'Internal Server Error', error.message));
    }
};

module.exports = sendSensorDataByName;