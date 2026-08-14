import JSZip from 'jszip';
import { PlaygroundConfig } from '../types';

export async function downloadPlaygroundZip(config: PlaygroundConfig): Promise<void> {
  const zip = new JSZip();

  // 1. package.json
  const packageJson = {
    name: 'gemini-playground-export',
    version: '1.0.0',
    private: true,
    type: 'module',
    scripts: {
      start: 'tsx demo.ts',
      dev: 'tsx watch demo.ts',
    },
    dependencies: {
      '@google/genai': '^2.4.0',
      dotenv: '^17.2.3',
    },
    devDependencies: {
      tsx: '^4.21.0',
      typescript: '^5.8.2',
    },
  };
  zip.file('package.json', JSON.stringify(packageJson, null, 2));

  // 2. tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
    },
  };
  zip.file('tsconfig.json', JSON.stringify(tsConfig, null, 2));

  // 3. .env.example & .env
  const envContent = `# Gemini API Key từ Google AI Studio (https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here
`;
  zip.file('.env.example', envContent);
  zip.file('.env', envContent);

  // 4. demo.ts (Node.js / TypeScript)
  let tsCode = `import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'your_gemini_api_key_here') {
  console.error('❌ Lỗi: Vui lòng nhập GEMINI_API_KEY hợp lệ vào file .env');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function main() {
  console.log('🚀 Khởi chạy Gemini SDK với cấu hình xuất từ Playground...');
  console.log('📌 Model:', '${config.model}');
  console.log('📌 Task:', '${config.task}');
  console.log('--------------------------------------------------');
`;

  if (config.task === 'image') {
    tsCode += `
  const response = await ai.models.generateImages({
    model: '${config.model}',
    prompt: ${JSON.stringify(config.prompt)},
    config: {
      numberOfImages: 1,
      aspectRatio: '${config.aspectRatio || '1:1'}',
      outputMimeType: 'image/jpeg',
    },
  });

  const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
  if (base64Image) {
    console.log('✅ Đã tạo ảnh thành công! Độ dài chuỗi Base64:', base64Image.length, 'ký tự.');
  } else {
    console.log('⚠️ Không nhận được dữ liệu ảnh.');
  }
`;
  } else if (config.task === 'stream') {
    tsCode += `
  const responseStream = await ai.models.generateContentStream({
    model: '${config.model}',
    contents: ${JSON.stringify(config.prompt)},
    config: {
      ${config.systemInstruction ? `systemInstruction: ${JSON.stringify(config.systemInstruction)},` : ''}
      temperature: ${config.temperature},
      topP: ${config.topP},
    },
  });

  process.stdout.write('💬 Phản hồi (Stream): ');
  for await (const chunk of responseStream) {
    if (chunk.text) {
      process.stdout.write(chunk.text);
    }
  }
  console.log('\\n\\n✅ Hoàn tất nhận luồng dữ liệu!');
`;
  } else {
    tsCode += `
  const response = await ai.models.generateContent({
    model: '${config.model}',
    contents: ${JSON.stringify(config.prompt)},
    config: {
      ${config.systemInstruction ? `systemInstruction: ${JSON.stringify(config.systemInstruction)},` : ''}
      temperature: ${config.temperature},
      topP: ${config.topP},
      ${config.responseMimeType ? `responseMimeType: '${config.responseMimeType}',` : ''}
    },
  });

  console.log('💬 Kết quả phản hồi:');
  console.log(response.text);
`;
  }

  tsCode += `}

main().catch(console.error);
`;
  zip.file('demo.ts', tsCode);

  // 5. demo.py (Python SDK)
  let pyCode = `import os
from google import genai
from google.genai import types

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("❌ Lỗi: Cần thiết lập biến môi trường GEMINI_API_KEY")
    exit(1)

client = genai.Client(api_key=api_key)

print("🚀 Đang chạy demo Gemini Python SDK v2...")
print("📌 Model: ${config.model}")
print("--------------------------------------------------")
`;

  if (config.task === 'image') {
    pyCode += `
response = client.models.generate_images(
    model='${config.model}',
    prompt=${JSON.stringify(config.prompt)},
    config=types.GenerateImagesConfig(
        number_of_images=1,
        aspect_ratio='${config.aspectRatio || '1:1'}',
        output_mime_type='image/jpeg',
    )
)

print("✅ Đã tạo ảnh thành công!")
`;
  } else if (config.task === 'stream') {
    pyCode += `
response = client.models.generate_content_stream(
    model='${config.model}',
    contents=${JSON.stringify(config.prompt)},
    config=types.GenerateContentConfig(
        ${config.systemInstruction ? `system_instruction=${JSON.stringify(config.systemInstruction)},` : ''}
        temperature=${config.temperature},
        top_p=${config.topP},
    )
)

for chunk in response:
    print(chunk.text, end="", flush=True)

print("\\n\\n✅ Hoàn thành!")
`;
  } else {
    pyCode += `
response = client.models.generate_content(
    model='${config.model}',
    contents=${JSON.stringify(config.prompt)},
    config=types.GenerateContentConfig(
        ${config.systemInstruction ? `system_instruction=${JSON.stringify(config.systemInstruction)},` : ''}
        temperature=${config.temperature},
        top_p=${config.topP},
        ${config.responseMimeType ? `response_mime_type='${config.responseMimeType}',` : ''}
    )
)

print(response.text)
`;
  }
  zip.file('demo.py', pyCode);

  // 6. README.md
  const readme = `# 📦 Gemini Playground Export Demo Project

Dự án này được tự động tạo và xuất từ **Gemini SDK Studio Playground**.

## ⚙️ Cấu hình Playground Đã Xuất
- **Mô hình (Model)**: \`${config.model}\`
- **Loại Task**: \`${config.task}\`
- **Nội dung Prompt**: "${config.prompt}"
${config.systemInstruction ? `- **Chỉ dẫn Hệ thống (System Instruction)**: "${config.systemInstruction}"` : ''}
- **Temperature**: \`${config.temperature}\`
- **Top P**: \`${config.topP}\`

---

## 🛠️ Hướng Dẫn Khởi Chạy Node.js / TypeScript

1. Cài đặt các thư viện cần thiết:
\`\`\`bash
npm install
\`\`\`

2. Mở file \`.env\` và điền Gemini API Key của bạn:
\`\`\`env
GEMINI_API_KEY=AIzaSy...
\`\`\`

3. Chạy file demo TypeScript:
\`\`\`bash
npm start
\`\`\`

---

## 🐍 Hướng Dẫn Khởi Chạy Python

1. Cài đặt thư viện Google GenAI v2:
\`\`\`bash
pip install google-genai
\`\`\`

2. Khai báo API Key và chạy file \`demo.py\`:
\`\`\`bash
export GEMINI_API_KEY="AIzaSy..."
python demo.py
\`\`\`
`;
  zip.file('README.md', readme);

  // Generate ZIP file and trigger browser download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `gemini-playground-project-${Date.now()}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
