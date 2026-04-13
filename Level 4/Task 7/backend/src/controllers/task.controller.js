const analyzerService = require('../services/analyzer.service');

const analyzeTask = (req, res) => {
    try {
        const { task } = req.body;

        // Ensure task is a string, even if empty or missing
        const taskDescription = typeof task === 'string' ? task : "";

        // The service is guaranteed to return a valid object
        const analysisResults = analyzerService.analyze(taskDescription);

        res.status(200).json({
            success: true,
            ...analysisResults
        });
    } catch (error) {
        console.error("Critical Backend Error:", error);
        // Absolute fallback to ensure JSON is returned and server doesn't crash
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            title: "Analysis Failure",
            introduction: "An unexpected error occurred during processing.",
            analysis: "The system was unable to complete the analysis.",
            flow: ["Error encountered"],
            actionSteps: ["Check backend logs"],
            pros: [],
            cons: [],
            finalSuggestion: "Please try again later."
        });
    }
};

module.exports = { analyzeTask };
