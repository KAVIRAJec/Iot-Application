const SensorModel = require("../../../models/sensorModel");
const ProjectModel = require("../../../models/projectModel");
const { formatResponse } = require("../../../utils/helper");
const Joi = require('joi');
const sendEmail = require('../../../utils/email');

const lastEmailSentTime = {}; // In-memory storage to track the last email sent time

const formatEmailContent = (sensorName, sensorValue, minThreshold, maxThreshold) => {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #d9534f;">🚨 Sensor Alert: Immediate Attention Required! 🚨</h2>
            <p>Dear User,</p>
            <p>The <strong>${sensorName}</strong> has reported a value of <strong>${sensorValue}</strong>, which is out of the acceptable threshold range <strong>${minThreshold} - ${maxThreshold}</strong>.</p>
            <h3 style="color: #f0ad4e;">⚠️ Potential Impact:</h3>
            <ul>
                <li>System performance may be affected.</li>
                <li>Possible safety or operational risks.</li>
                <li>Immediate attention is recommended to prevent further issues.</li>
            </ul>
            <h3 style="color: #5bc0de;">🛠 Recommended Actions:</h3>
            <ul>
                <li>Check sensor functionality and calibration.</li>
                <li>Inspect the surrounding environment for anomalies.</li>
                <li>Take corrective measures as per operational guidelines.</li>
            </ul>
            <p>If you need further assistance, please contact the support team immediately.</p>
            <p>Best regards,</p>
            <p>Your Support Team</p>
        </div>
    `;
};

const sendSensorData = async (req, res) => {
    const paramsSchema = Joi.object({
        projectId: Joi.number().integer().required(),
        sensorId: Joi.number().integer().required()
    });

    const bodySchema = Joi.object({
        id: Joi.number().integer().required(),
        value: Joi.number().required()
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
        const projectExists = await ProjectModel.findProjectById(parseInt(paramsValue.projectId, 10));
        if (!projectExists) {
            return res.status(404).json(formatResponse('error', 'Project not found'));
        }

        // Retrieve user email from project ID
        const userEmail = await ProjectModel.findUserEmailByProjectId(paramsValue.projectId);
        if (!userEmail) {
            return res.status(404).json(formatResponse('error', 'User email not found'));
        }

        // Check if Sensor exists
        const sensor = await SensorModel.findSensorById(paramsValue.sensorId);
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
                sensorId: paramsValue.sensorId
            });
            // Emit sensor data via WebSocket
            req.io.emit('sensorData', sensorData);
            res.status(201).json(formatResponse('success', 'Input data change sent successfully', sensorData));
        } 
        else {
            const sensorData = await SensorModel.createSensorData({
                value: bodyValue.value,
                sensorId: paramsValue.sensorId
            });

            // Check thresholds and send email
            if (sensorData.value < sensor.minThreshold || sensorData.value > sensor.maxThreshold) {
                const emailBody = formatEmailContent(sensor.name, sensorData.value, sensor.minThreshold, sensor.maxThreshold);
                const currentTime = Date.now();
                const lastSentTime = lastEmailSentTime[sensor.id] || 0;

                if (currentTime - lastSentTime >= 15 * 60 * 1000) {
                    // Send email immediately if 15 minutes have passed since the last email
                    await sendEmail(userEmail, 'Sensor Alert', emailBody);
                    lastEmailSentTime[sensor.id] = currentTime;
                } else {
                    // Schedule email to be sent after 15 minutes
                    setTimeout(async () => {
                        await sendEmail(userEmail, 'Sensor Alert', emailBody);
                        lastEmailSentTime[sensor.id] = Date.now();
                    }, 15 * 60 * 1000 - (currentTime - lastSentTime));
                }
            }

            // Emit sensor data via WebSocket
            req.io.emit('sensorData', sensorData);
            res.status(201).json(formatResponse('success', 'Output Sensor data sent successfully', sensorData));
        }        
    } catch (error) {
        res.status(500).json(formatResponse('error', 'Internal Server Error', error.message));
    }
}

module.exports = sendSensorData;