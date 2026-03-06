import { Injectable, Logger } from '@nestjs/common';

interface GradingResult {
    score: number;   // 0-100
    feedback: string;
}

@Injectable()
export class AiGradingService {
    private readonly logger = new Logger(AiGradingService.name);
    private readonly apiToken = process.env.HF_API_TOKEN;

    async gradeEssay(question: string, answer: string): Promise<GradingResult> {
        if (!answer || answer.trim().length === 0) {
            return { score: 0, feedback: 'No answer provided.' };
        }

        if (!this.apiToken) {
            this.logger.warn('HF_API_TOKEN not set, using fallback grading');
            return this.fallbackGrade(answer);
        }

        try {
            const prompt = this.buildGradingPrompt(question, answer);
            const response = await fetch(
                'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputs: prompt,
                        parameters: {
                            max_new_tokens: 300,
                            temperature: 0.3,
                            return_full_text: false,
                        },
                    }),
                },
            );

            if (!response.ok) {
                this.logger.error(`HF API error: ${response.status}`);
                return this.fallbackGrade(answer);
            }

            const data = await response.json();
            return this.parseGradingResponse(data, answer);
        } catch (error) {
            this.logger.error('AI grading failed', error);
            return this.fallbackGrade(answer);
        }
    }

    private buildGradingPrompt(question: string, answer: string): string {
        return `<s>[INST] You are an expert academic grader. Grade the following essay answer on a scale of 0 to 100.

Consider these criteria:
- Accuracy and correctness of content (40%)
- Clarity and organization of writing (25%)
- Depth of understanding shown (25%)
- Spelling and grammar (10%)

Question: ${question}

Student's Answer: ${answer}

Respond ONLY in this exact JSON format, nothing else:
{"score": <number 0-100>, "feedback": "<specific constructive feedback>"} [/INST]`;
    }

    private parseGradingResponse(data: any, answer: string): GradingResult {
        try {
            const text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
            if (!text) return this.fallbackGrade(answer);

            // Try to extract JSON from the response
            const jsonMatch = text.match(/\{[\s\S]*?"score"[\s\S]*?"feedback"[\s\S]*?\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    score: Math.min(100, Math.max(0, Number(parsed.score) || 0)),
                    feedback: parsed.feedback || 'Grading complete.',
                };
            }

            // Try to extract score number from text
            const scoreMatch = text.match(/(\d{1,3})/);
            if (scoreMatch) {
                return {
                    score: Math.min(100, Math.max(0, parseInt(scoreMatch[1]))),
                    feedback: text.replace(/[{}]/g, '').trim().slice(0, 500),
                };
            }

            return this.fallbackGrade(answer);
        } catch {
            return this.fallbackGrade(answer);
        }
    }

    private fallbackGrade(answer: string): GradingResult {
        // Simple heuristic-based grading as fallback
        const wordCount = answer.trim().split(/\s+/).length;
        const sentenceCount = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const hasStructure = sentenceCount >= 3;
        const isLong = wordCount >= 50;
        const isMedium = wordCount >= 20;

        let score = 30; // base score for any attempt
        if (isMedium) score += 20;
        if (isLong) score += 15;
        if (hasStructure) score += 15;
        if (wordCount >= 100) score += 10;

        score = Math.min(85, score); // cap fallback at 85

        const feedback = `Auto-graded based on response analysis. ${wordCount < 20 ? 'Consider providing a more detailed response.' :
                wordCount < 50 ? 'Good attempt, but try to elaborate more on your points.' :
                    'Solid response length. AI grading was unavailable; a manual review may adjust the score.'
            } (Word count: ${wordCount})`;

        return { score, feedback };
    }
}
