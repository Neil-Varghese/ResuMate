import Resume from '../models/Resume.js';
import ai from '../configs/ai.js';

// Controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent || userContent.trim().length === 0) {
            return res.status(422).json({ message: 'Content is required for enhancement' });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert in resume writing. Enhance the professional summary to be 1-2 sentences, highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Return only the enhanced text."
                },
                { role: "user", content: userContent }
            ]
        });

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({ enhancedContent });

    } catch (error) {
        console.error('Enhance professional summary error:', error.message);
        return res.status(500).json({ message: 'Failed to enhance professional summary' });
    }
}



// Controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-description
export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent || userContent.trim().length === 0) {
            return res.status(422).json({ message: 'Content is required for enhancement' });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert in resume writing. Enhance the job description to 1-2 sentences, highlighting key responsibilities and achievements. Use action verbs and quantifiable results. Make it ATS-friendly. Return only the enhanced text."
                },
                { role: "user", content: userContent }
            ]
        });

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({ enhancedContent });

    } catch (error) {
        console.error('Enhance job description error:', error.message);
        return res.status(500).json({ message: 'Failed to enhance job description' });
    }
}



// Controller for uploading a resume to the database
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText || resumeText.trim().length === 0) {
            return res.status(422).json({ message: 'Resume content is required for upload' });
        }

        if (!title || title.trim().length === 0) {
            return res.status(422).json({ message: 'Resume title is required' });
        }

        const systemPrompt = "Extract structured data from the provided resume text. Return valid JSON only.";

        const userPrompt = `Extract data from this resume and return valid JSON:

${resumeText}

Return JSON with this structure:
{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [{"company": "", "position": "", "start_date": "", "end_date": "", "is_current": false, "description": ""}],
  "project": [{"name": "", "type": "", "description": ""}],
  "education": [{"institution": "", "degree": "", "field": "", "graduation_date": "", "gpa": ""}]
}`;

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" }
        });

        const extractedData = response.choices[0].message.content;
        const parsedData = JSON.parse(extractedData);

        const newResume = await Resume.create({
            user: userId,
            title: title.trim(),
            ...parsedData
        });

        return res.status(201).json({
            message: 'Resume created successfully from uploaded text',
            resume: newResume
        });

    } catch (error) {
        console.error('Upload resume error:', error.message);
        return res.status(500).json({ message: 'Failed to process resume upload' });
    }
}    