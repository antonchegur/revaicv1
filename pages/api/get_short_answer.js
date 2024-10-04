// pages/api/get_short_answer.js
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

const instructions_to_model = `
You are a Revenue AI Copilot, your name is Revaic. Revaic is an AI-powered copilot designed to revolutionize your B2B sales process. By leveraging advanced data analysis and intelligent chatbot interactions, Revaic helps you uncover actionable insights and drive significant revenue growth. Your features are:

- **Advanced Data Analysis**
    
    Leverage AI to analyze vast amounts of data for actionable insights.
    
- **AI Chatbot**
    
    Get data-driven answers to your questions like: Why we lose deals? Tell me top-3 worst sales reps? How many contracts we will sign in this month?
    
- **B2B Sales Expertise**
    
    Specialized in boosting B2B sales and driving revenue growth.
    

Make sure, that every of your answer is data-driven and very short. You response is limited by 2 sentences only. And also add table data if needed. Do not answer in abstract way, answer like an expert in B2B Sales.

You have access to CRM data of B2B SaaS - Parqour. Let’s consider that CRM data is complete and CRM is fully filled. Here is information about Parqour.

Parqour is a software platform that simplifies parking operations and improves the customer experience. It offers real-time data, automated plate recognition, and contactless payments. Parqour offers a comprehensive end-to-end management platform to increase revenue, reduce operational cost and enhance transparency. Say goodbye to piecing together different vendors and integrations. No need to spend huge capital on bulky hardware. Control all operations from one platform. Contactless parking and online payment methods makes the parking experience easier for your customers too. The end result: higher utilization and lower operating costs.

- 99,6% license plate recognition rate
- Online QR payment & 3rd party APIs
    
    (integrated with Parkmobile, SpotHero, Honk, PayByPhone)
    
    (real-time occupancy, revenue, utilization, parking trends)
    
    (free flow access for approved drivers)
    
- 24/7 remote control system
- Hardware with zero upfront costs
- Zoning and violation detection

I need you to simulate Revaic with CRM data of Parqour.
`;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { prompt } = req.body; // Expecting a 'prompt' in the request body
        console.log('Question from client:', req.body);
    
        // Validate 'prompt' input
        if (!prompt || typeof prompt !== 'string') {
            res.status(400).json({ error: "Invalid input: 'prompt' must be a non-null string." });
            console.error("Invalid 'prompt' provided:", prompt);
            return;
        }
    
        // Ensure 'instructions_to_model' is defined and valid
        if (!instructions_to_model || typeof instructions_to_model !== 'string') {
            res.status(500).json({ error: "Server error: 'instructions_to_model' is not properly defined." });
            console.error("Invalid 'instructions_to_model' provided:", instructions_to_model);
            return;
        }
    
        try {
            const response = await client.chat.completions.create({
                model: 'gpt-4', // Corrected the model name
                messages: [
                    { role: 'system', content: instructions_to_model },
                    { role: 'user', content: prompt },
                ],
            });
    
            console.log('Response from OpenAI API:', response);
    
            // Check if the response contains the expected data
            if (
                response &&
                response.choices &&
                response.choices.length > 0 &&
                response.choices[0].message &&
                response.choices[0].message.content
            ) {
                res.status(200).json({ completion: response.choices[0].message.content });
            } else {
                res.status(500).json({ error: 'Invalid response structure from OpenAI API.' });
                console.error('Invalid response structure:', response);
            }
        } catch (error) {
            // Improved error handling
            if (error.response) {
                // API returned an error response
                res.status(error.response.status).json(error.response.data);
                console.error('API Error:', error.response.status, error.response.data);
            } else {
                // Other errors (e.g., network issues)
                res.status(500).json({ error: error.message });
                console.error('Error creating chat completion:', error.message);
            }
        }
    } else {
        res.status(405).json({ message: 'Only POST requests are allowed.' });
        console.warn('Received a non-POST request.');
    }    
}
