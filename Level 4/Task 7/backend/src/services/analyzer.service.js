/**
 * Advanced Smart Task Analyzer (High-Structure)
 * 100% Local, Rule-Based, Zero-AI Dependency.
 */

const analyzer = (task) => {
    const input = task.toLowerCase();

    // ─── KNOWLEDGE BASE ──────────────────────────────────────────────────

    // 1. Marketing / Landing Page
    if (input.includes('landing page') || input.includes('website')) {
        return {
            title: "Marketing Landing Page Development",
            introduction: "A landing page is a standalone web page, created specifically for a marketing or advertising campaign. It's where a visitor 'lands' after they click on a link in an email, or ads from Google, YouTube, Facebook, or elsewhere on the web.",
            analysis: "Landing pages are essential for converting traffic into leads or sales. Unlike homepages, they are focused on a single call to action (CTA), making them highly effective for specific marketing goals and audience segments.",
            flow: [
                "Research audience & define conversion goals",
                "Create low-fidelity wireframes and copy",
                "Design high-fidelity UI with clear visual hierarchy",
                "Develop responsive frontend using optimized code",
                "Test performance, tracking, and deploy"
            ],
            actionSteps: [
                "Define a single, compelling Call to Action (CTA)",
                "Write persuasive, benefit-oriented headlines",
                "Ensure mobile responsiveness and fast load times"
            ],
            pros: [
                "High conversion potential compared to generic pages",
                "Provides targeted data for marketing analysis"
            ],
            cons: [
                "Requires careful design and copy alignment",
                "Needs constant A/B testing for optimal results"
            ],
            finalSuggestion: "Focus on user experience and clear, singular messaging to maximize ROI."
        };
    }

    // 2. Study / Exam
    if (input.includes('exam') || input.includes('study') || input.includes('test')) {
        return {
            title: "Academic Preparation & Exam Strategy",
            introduction: "Exam preparation involves systematic review and application of learned concepts to demonstrate mastery under timed conditions.",
            analysis: "Success in exams depends on a balance between deep understanding and time-management skills. Cramming is often less effective than spaced repetition and active recall techniques.",
            flow: [
                "Audit syllabus and identify weak areas",
                "Organize study materials and create summaries",
                "Implement active recall and spaced repetition",
                "Solve previous year mock examinations",
                "Review mistakes and clarify doubts"
            ],
            actionSteps: [
                "Break the syllabus into daily manageable sections",
                "Establish a distraction-free study environment",
                "Use the Pomodoro technique for sustained focus"
            ],
            pros: [
                "Builds long-term retention and subject mastery",
                "Reduces anxiety through thorough preparation"
            ],
            cons: [
                "Time-intensive and requires high discipline",
                "Can be mentally exhausting if not balanced"
            ],
            finalSuggestion: "Prioritize consistent review over long 'marathon' study sessions."
        };
    }

    // 3. Meeting
    if (input.includes('meeting') || input.includes('call') || input.includes('sync')) {
        return {
            title: "Professional Sync & Meeting Management",
            introduction: "A strategic meeting is a tool for alignment, decision-making, and collaboration between team members or stakeholders.",
            analysis: "Inefficient meetings are a major productivity drain. Effective meetings have a clear purpose, required participants only, and actionable outcomes.",
            flow: [
                "Clarify meeting purpose and objectives",
                "Draft and distribute the meeting agenda",
                "Conduct discussion and facilitate decisions",
                "Record key takeaways and action items",
                "Distribute meeting minutes and follow up"
            ],
            actionSteps: [
                "Set clear start and end times to respect schedules",
                "Assign a moderator to keep the discussion focused",
                "Define owners for every action item identified"
            ],
            pros: [
                "Ensures team alignment and clears blockers",
                "Facilitates rapid collaborative decision making"
            ],
            cons: [
                "Costly in terms of total man-hours spent",
                "Can become unproductive without strong facilitation"
            ],
            finalSuggestion: "If the goal can be achieved via email, skip the meeting."
        };
    }

    // 4. Coding / Project
    if (input.includes('code') || input.includes('build') || input.includes('develop') || input.includes('project')) {
        return {
            title: "Technical Project & Software Development",
            introduction: "Technical projects involve the systematic design, implementation, and testing of hardware or software solutions to solve specific problems.",
            analysis: "Modern development favors iterative progress and clear documentation. Technical debt and scope creep are the primary risks to project success.",
            flow: [
                "Analyze requirements and define constraints",
                "Architect solution and select technology stack",
                "Implement features using modular coding practices",
                "Perform thorough testing and peer reviews",
                "Deploy to production and monitor system health"
            ],
            actionSteps: [
                "Write modular, self-documenting code",
                "Maintain a clean version control history (Git)",
                "Automate testing for core business logic"
            ],
            pros: [
                "Creates scalable and reusable solutions",
                "Solves complex problems through automation"
            ],
            cons: [
                "High risk of unforeseen technical complexity",
                "Requires continuous maintenance and updates"
            ],
            finalSuggestion: "Keep it simple and focus on delivering core value first (MVP)."
        };
    }

    // ─── DEFAULT FALLBACK ──────────────────────────────────────────────────
    return {
        title: "Standard Task Management Framework",
        introduction: "General task management involves organizing, prioritizing, and executing discrete pieces of work to achieve a larger goal.",
        analysis: "Breaking any task into smaller parts is the most effective way to overcome procrastination and ensure steady progress toward completion.",
        flow: [
            "Contextualize the task within larger goals",
            "Identify the first immediate action step",
            "Execute the task with focused attention",
            "Review output and verify against success criteria",
            "Mark as complete and prepare for next steps"
        ],
        actionSteps: [
            "Write the task down to clear mental space",
            "Estimate time and set a hard deadline",
            "Minimize distractions during the execution phase"
        ],
        pros: [
            "Simple and adaptable to any work context",
            "Reduces cognitive load and improves clarity"
        ],
        cons: [
            "Generic approach may miss specific nuances",
            "Requires self-motivation to initiate execution"
        ],
        finalSuggestion: "Start with the smallest possible step to build momentum."
    };
};

module.exports = { analyze: analyzer };
