import { GridState, CellValue, ConstraintType } from '../types';

const SYSTEM_PROMPT = `
You are an expert vision system designed to digitize "Tango" (Sun and Moon) logic puzzles from screenshots, specifically from the LinkedIn Tango game.
Your goal is to perfectly transcribe the 6x6 grid state, including symbols (Suns, Moons) and constraints (Equal, Opposite).

Visual Guide for LinkedIn Tango:
- **Sun**: A yellow/orange circle or sun icon.
- **Moon**: A blue/grey crescent or moon icon.
- **Empty**: A blank cell.
- **Constraints**: Small white or grey symbols located EXACTLY on the grid lines between cells.
  - '=': EQUAL constraint (the two neighboring cells MUST be the same).
  - 'x': OPPOSITE constraint (the two neighboring cells MUST be different).
  - No symbol: NONE.

Mapping Instructions (CRITICAL):
1. **Cells**: Array[6][6]. Index [0][0] is top-left.
2. **Horizontal Constraints (hConstraints)**: Array[6][5].
   - hConstraints[r][c] is the symbol on the vertical line BETWEEN cells[r][c] and cells[r][c+1].
3. **Vertical Constraints (vConstraints)**: Array[5][6].
   - vConstraints[r][c] is the symbol on the horizontal line BETWEEN cells[r][c] and cells[r+1][c].

Be extremely precise with alignment. A constraint shifted by one cell makes the puzzle unsolvable.

Return valid JSON only in this format:
{
  "cells": [["SUN", "MOON", "EMPTY", ...], ...],
  "hConstraints": [["EQUAL", "OPPOSITE", "NONE", ...], ...],
  "vConstraints": [["EQUAL", "OPPOSITE", "NONE", ...], ...]
}
`;

const AIML_BASE_URL = "https://api.aimlapi.com/v1/chat/completions";

export const parseGridFromImageAIML = async (
    apiKey: string,
    base64Image: string,
    mimeType: string,
    // model: string = "google/gemini-3-pro-preview",  // Gemini 3 Pro for best grid extraction accuracy
    model: string = "claude-sonnet-4-5",  // Claude Sonnet 4.5 for best spatial reasoning
    baseUrl?: string
): Promise<GridState> => {
    const modelName = process.env.AIML_MODEL || model;
    const endpoint = baseUrl || AIML_BASE_URL;

    const requestBody = {
        model: modelName,
        messages: [
            {
                role: "system",
                content: SYSTEM_PROMPT
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Analyze this Tango puzzle image. Output the JSON immediately after brief analysis. Do not over-explain - just count grid size (6x6), identify symbols and constraints, and output the JSON."
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:${mimeType};base64,${base64Image}`
                        }
                    }
                ]
            }
        ],
        max_tokens: 8192
    };

    try {
        console.log("[AIML] Making request to:", endpoint);
        console.log("[AIML] Model:", modelName);

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        const message = result.choices?.[0]?.message;
        let text = message?.content;

        if (!text && message?.reasoning) text = message.reasoning;
        if (!text && message?.reasoning_content) text = message.reasoning_content;

        if (!text) throw new Error("No response content from AIML model.");

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Could not find valid JSON in model response.");

        const rawData = JSON.parse(jsonMatch[0]);

        // Map strings to Enums
        const cells = (rawData.cells || []).slice(0, 6).map((row: string[]) =>
            (row || []).slice(0, 6).map(c => CellValue[c as keyof typeof CellValue] || CellValue.EMPTY)
        );
        while (cells.length < 6) cells.push(Array(6).fill(CellValue.EMPTY));
        cells.forEach(row => { while (row.length < 6) row.push(CellValue.EMPTY); });

        const hConstraints = (rawData.hConstraints || []).slice(0, 6).map((row: string[]) =>
            (row || []).slice(0, 5).map(c => ConstraintType[c as keyof typeof ConstraintType] || ConstraintType.NONE)
        );
        while (hConstraints.length < 6) hConstraints.push(Array(5).fill(ConstraintType.NONE));
        hConstraints.forEach(row => { while (row.length < 5) row.push(ConstraintType.NONE); });

        const vConstraints = (rawData.vConstraints || []).slice(0, 5).map((row: string[]) =>
            (row || []).slice(0, 6).map(c => ConstraintType[c as keyof typeof ConstraintType] || ConstraintType.NONE)
        );
        while (vConstraints.length < 5) vConstraints.push(Array(6).fill(ConstraintType.NONE));
        vConstraints.forEach(row => { while (row.length < 6) row.push(ConstraintType.NONE); });

        return { cells, hConstraints, vConstraints };
    } catch (error: any) {
        console.error("AIML API Error:", error);
        throw error;
    }
};
