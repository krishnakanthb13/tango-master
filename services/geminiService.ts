import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { GridState, CellValue, ConstraintType } from '../types';

// Initialize Gemini
// Note: In a real app, use a proxy or secure backend. For this demo, we use env var.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
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
`;

const PROMPT = `
Analyze the provided image of a 6x6 Tango grid.

Step-by-step digitizing process:
1. Locate the 6x6 grid. Identifying all 36 cells.
2. For each cell, identify if it's "SUN", "MOON", or "EMPTY".
3. Check every vertical divider line between columns for "=" or "x" symbols (hConstraints).
4. Check every horizontal divider line between rows for "=" or "x" symbols (vConstraints).
5. Double-check that hConstraints[r][c] is actually between cells[r][c] and cells[r][c+1].

Return a JSON object with the following structure:
1. 'cells': A 6x6 array of strings ("SUN", "MOON", "EMPTY").
2. 'hConstraints': A 6x5 array of strings ("EQUAL", "OPPOSITE", "NONE").
3. 'vConstraints': A 5x6 array of strings ("EQUAL", "OPPOSITE", "NONE").
`;

export const parseGridFromImage = async (base64Image: string): Promise<GridState> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          { text: PROMPT }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cells: {
              type: Type.ARRAY,
              items: {
                type: Type.ARRAY,
                items: { type: Type.STRING, enum: ['SUN', 'MOON', 'EMPTY'] }
              }
            },
            hConstraints: {
              type: Type.ARRAY,
              items: {
                type: Type.ARRAY,
                items: { type: Type.STRING, enum: ['EQUAL', 'OPPOSITE', 'NONE'] }
              }
            },
            vConstraints: {
              type: Type.ARRAY,
              items: {
                type: Type.ARRAY,
                items: { type: Type.STRING, enum: ['EQUAL', 'OPPOSITE', 'NONE'] }
              }
            }
          }
        },
        thinkingConfig: {
          includeThoughts: true,
          thinkingLevel: ThinkingLevel.HIGH
        }
      }
    });

    if (!response.text) throw new Error("No response from Gemini");

    const rawData = JSON.parse(response.text);

    // Map raw strings to Enums to ensure type safety
    // Also perform basic validation on dimensions to prevent crashes
    const cells = (rawData.cells || []).slice(0, 6).map((row: string[]) =>
      (row || []).slice(0, 6).map(c => CellValue[c as keyof typeof CellValue] || CellValue.EMPTY)
    );

    // Ensure 6x6 structure for cells if incomplete
    while (cells.length < 6) cells.push(Array(6).fill(CellValue.EMPTY));
    cells.forEach(row => { while (row.length < 6) row.push(CellValue.EMPTY); });

    const hConstraints = (rawData.hConstraints || []).slice(0, 6).map((row: string[]) =>
      (row || []).slice(0, 5).map(c => ConstraintType[c as keyof typeof ConstraintType] || ConstraintType.NONE)
    );
    // Ensure 6x5
    while (hConstraints.length < 6) hConstraints.push(Array(5).fill(ConstraintType.NONE));
    hConstraints.forEach(row => { while (row.length < 5) row.push(ConstraintType.NONE); });

    const vConstraints = (rawData.vConstraints || []).slice(0, 5).map((row: string[]) =>
      (row || []).slice(0, 6).map(c => ConstraintType[c as keyof typeof ConstraintType] || ConstraintType.NONE)
    );
    // Ensure 5x6
    while (vConstraints.length < 5) vConstraints.push(Array(6).fill(ConstraintType.NONE));
    vConstraints.forEach(row => { while (row.length < 6) row.push(ConstraintType.NONE); });

    return { cells, hConstraints, vConstraints };

  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};