import { PlaygroundConfig } from '../types';

export function generatePythonCode(config: PlaygroundConfig): string {
  const { model, prompt, systemInstruction, temperature, topP, responseMimeType, thinkingLevel, task } = config;

  if (task === 'image') {
    return `import os
from google import genai
from google.genai import types

# Initialize client (uses process.env.GEMINI_API_KEY or os.environ["GEMINI_API_KEY"])
client = genai.Client()

response = client.models.generate_content(
    model="${model}",
    contents="${prompt.replace(/"/g, '\\"')}",
    config=types.GenerateContentConfig(
        image_config=types.ImageConfig(
            aspect_ratio="${config.aspectRatio || '1:1'}",
        )
    )
)

for part in response.candidates[0].content.parts:
    if part.inline_data:
        # Image base64 bytes
        image_bytes = part.inline_data.data
        print(f"Generated image ({len(image_bytes)} bytes)")
    elif part.text:
        print(part.text)
`;
  }

  if (task === 'stream') {
    return `import os
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content_stream(
    model="${model}",
    contents="${prompt.replace(/"/g, '\\"')}",
    config=types.GenerateContentConfig(
        ${systemInstruction ? `system_instruction="${systemInstruction.replace(/"/g, '\\"')}",\n        ` : ''}temperature=${temperature},
        top_p=${topP},
    )
)

for chunk in response:
    print(chunk.text, end="")
`;
  }

  if (task === 'structured') {
    return `import os
from google import genai
from google.genai import types
from pydantic import BaseModel

# Example Pydantic schema
class OutputSchema(BaseModel):
    title: str
    items: list[str]
    confidence: float

client = genai.Client()

response = client.models.generate_content(
    model="${model}",
    contents="${prompt.replace(/"/g, '\\"')}",
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=OutputSchema,
        ${systemInstruction ? `system_instruction="${systemInstruction.replace(/"/g, '\\"')}",\n        ` : ''}temperature=${temperature},
    )
)

print(response.text)
`;
  }

  return `import os
from google import genai
from google.genai import types

# 1. Initialize the client
# The SDK automatically detects GEMINI_API_KEY from environment
client = genai.Client()

# 2. Call generate_content
response = client.models.generate_content(
    model="${model}",
    contents="${prompt.replace(/"/g, '\\"')}",
    config=types.GenerateContentConfig(
        ${systemInstruction ? `system_instruction="${systemInstruction.replace(/"/g, '\\"')}",\n        ` : ''}temperature=${temperature},
        top_p=${topP},
        ${responseMimeType === 'application/json' ? 'response_mime_type="application/json",\n        ' : ''}${thinkingLevel ? `thinking_config=types.ThinkingConfig(thinking_level="${thinkingLevel}"),\n        ` : ''}
    )
)

print(response.text)
`;
}

export function generateTypeScriptCode(config: PlaygroundConfig): string {
  const { model, prompt, systemInstruction, temperature, topP, responseMimeType, thinkingLevel, task } = config;

  if (task === 'image') {
    return `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const response = await ai.models.generateContent({
    model: "${model}",
    contents: "${prompt.replace(/"/g, '\\"')}",
    config: {
      imageConfig: {
        aspectRatio: "${config.aspectRatio || '1:1'}",
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64Image = part.inlineData.data;
      console.log(\`Image data length: \${base64Image.length}\`);
    } else if (part.text) {
      console.log(part.text);
    }
  }
}

main();
`;
  }

  if (task === 'stream') {
    return `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const response = await ai.models.generateContentStream({
    model: "${model}",
    contents: "${prompt.replace(/"/g, '\\"')}",
    config: {
      ${systemInstruction ? `systemInstruction: "${systemInstruction.replace(/"/g, '\\"')}",\n      ` : ''}temperature: ${temperature},
      topP: ${topP},
    },
  });

  for await (const chunk of response) {
    process.stdout.write(chunk.text || "");
  }
}

main();
`;
  }

  if (task === 'structured') {
    return `import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const response = await ai.models.generateContent({
    model: "${model}",
    contents: "${prompt.replace(/"/g, '\\"')}",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          confidence: { type: Type.NUMBER }
        },
        required: ["title", "items"]
      },
      ${systemInstruction ? `systemInstruction: "${systemInstruction.replace(/"/g, '\\"')}",\n      ` : ''}temperature: ${temperature},
    },
  });

  console.log(response.text);
}

main();
`;
  }

  return `import { GoogleGenAI } from "@google/genai";

// Always initialize on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

async function main() {
  const response = await ai.models.generateContent({
    model: "${model}",
    contents: "${prompt.replace(/"/g, '\\"')}",
    config: {
      ${systemInstruction ? `systemInstruction: "${systemInstruction.replace(/"/g, '\\"')}",\n      ` : ''}temperature: ${temperature},
      topP: ${topP},
      ${responseMimeType === 'application/json' ? 'responseMimeType: "application/json",\n      ' : ''}${thinkingLevel ? `thinkingConfig: { thinkingLevel: "${thinkingLevel}" },\n      ` : ''}
    },
  });

  // Direct property access
  console.log(response.text);
}

main();
`;
}
