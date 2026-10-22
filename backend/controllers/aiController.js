import { GoogleGenerativeAI } from '@google/generative-ai';
import Task from '../models/Task.js';

// Pehla model busy ho to agle try honge
const MODELS = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];

async function generateWithFallback(genAI, prompt) {
  let lastError;
  for (const name of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: name,
          generationConfig: { responseMimeType: 'application/json' },
        });
        return await model.generateContent(prompt);
      } catch (err) {
        lastError = err;
        if (err.status === 404) break; // is naam ka model nahi mila, agla try karo
        if (err.status !== 503 && err.status !== 429) throw err; // key/prompt ka masla, retry bekaar
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

// @desc    Generate 3-day study plan for a task using Gemini API
// @route   POST /api/tasks/:id/generate-plan
// @access  Private
export const generateStudyPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify task belongs to user
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to access this task' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Gemini API key is missing' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `
      You are an expert academic tutor. Create a structured 3-day study plan to learn/prepare the topic "${task.topic}" for the subject "${task.subject}".
      Provide your response as a JSON array of exactly 3 elements (representing Day 1, Day 2, and Day 3).
      Each element in the array must be an object with the following properties:
      - "day": Number (1, 2, or 3)
      - "title": String (short, engaging focus/theme for the day)
      - "tasks": Array of Strings (3-4 specific, actionable study tasks/steps for this day)

      Do not wrap the JSON in markdown code blocks. Return only raw JSON.
    `;

    const result = await generateWithFallback(genAI, prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const plan = JSON.parse(text.trim());
      task.aiPlan = plan;
      const updatedTask = await task.save();
      return res.json(updatedTask);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', text);
      // Fallback: If JSON parsing fails, we create a basic fallback structure so we don't crash
      const fallbackPlan = [
        { day: 1, title: 'Introduction & Basics', tasks: [`Read basic definitions and concepts of ${task.topic}`] },
        { day: 2, title: 'Deep Dive & Practice', tasks: [`Practice solving exercises or analyzing examples of ${task.topic}`] },
        { day: 3, title: 'Review & Assessment', tasks: [`Self-assess understanding of ${task.topic} and review weak areas`] }
      ];
      task.aiPlan = fallbackPlan;
      const updatedTask = await task.save();
      return res.json(updatedTask);
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error.status === 503 || error.status === 429) {
      return res.status(503).json({
        message: 'AI is busy right now, please try again in a minute.',
      });
    }
    return res.status(500).json({
      message: 'Failed to generate study plan from Gemini API.',
      error: error.message,
    });
  }
};