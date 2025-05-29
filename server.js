const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const liquorList = [
  { name: "달모어 15년", type: "위스키", price: "235,000원", feature: "15년 숙성" },
  { name: "에덴 보드카", type: "보드카", price: "46,500원" },
  { name: "옐로우테일 까베네쇼비뇽", type: "레드 와인", price: "17,000원" }
];

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  const liquorInfo = liquorList.map(l => `- ${l.name} (${l.type}) / ${l.feature || ''} / ${l.price}`).join('\n');
  const prompt = `질문: ${question}\n점포 보유 주류:\n${liquorInfo}\n답변:`;

  try {
    const gptRes = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });
    res.json({ answer: gptRes.data.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: "GPT 오류 발생" });
  }
});

app.listen(3001, () => console.log("GPT 서버 실행 중 (포트 3001)"));
