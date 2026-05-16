
```javascript
const Anthropic = require("@anthropic-ai/sdk");
const readline = require("readline");

const client = new Anthropic();

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

// Core text analysis functions
function countWords(text) {
  const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
  return words.length;
}

function countCharacters(text) {
  return text.length;
}

function countCharactersWithoutSpaces(text) {
  return text.replace(/\s/g, "").length;
}

function countSentences(text) {
  const sentences = text.match(/[.!?]+/g) || [];
  return sentences.length;
}

function countParagraphs(text) {
  const paragraphs = text
    .split(/\n\n+/)
    .filter((para) => para.trim().length > 0);
  return paragraphs.length;
}

function getWordFrequency(text) {
  const words = text
    .toLowerCase()
    .match(/\b[a-záéíóúñ]+\b/g) || [];
  const frequency = {};

  for (const word of words) {
    frequency[word] = (frequency[word] || 0) + 1;
  }

  return frequency;
}

function getTopWords(frequency, limit = 10) {
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

function getAverageWordLength(text) {
  const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
  if (words.length === 0) return 0;

  const totalLength = words.reduce((sum, word) => sum + word.length, 0);
  return (totalLength / words.length).toFixed(2);
}

function getReadingTime(text) {
  const wordCount = countWords(text);
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
}

// Main analysis function
async function analyzeText(text) {
  console.log("\n📊 ANÁLISIS DE TEXTO\n");
  console.log("=".repeat(50));

  // Basic statistics
  const wordCount = countWords(text);
  const charCount = countCharacters(text);
  const charWithoutSpaces = countCharactersWithoutSpaces(text);
  const sentenceCount = countSentences(text);
  const paragraphCount = countParagraphs(text);
  const avgWordLength = getAverageWordLength(text);
  const readingTime = getReadingTime(text);

  console.log("\n📈 ESTADÍSTICAS BÁSICAS:");
  console.log(`   • Palabras: ${wordCount}`);
  console.log(`   • Caracteres: ${charCount}`);
  console.log(`   • Caracteres (sin espacios): ${charWithoutSpaces}`);
  console.log(`   • Oraciones: ${sentenceCount}`);
  console.log(`   • Párrafos: ${paragraphCount}`);
  console.log(`   • Promedio caracteres/palabra: ${avgWordLength}`);
  console.log(`   • Tiempo de lectura estimado: ${readingTime} minuto(s)`);

  // Word frequency
  const frequency = getWordFrequency(text);
  const topWords = getTopWords(frequency, 10);

  console.log("\n🔤 PALABRAS MÁS FRECUENTES:");
  topWords.forEach((item, index) => {
    console.log(`   ${index + 1}. "${item.word}" - ${item.count} veces`);
  });

  // Use Claude to provide additional insights
  console.log("\n💡 ANÁLISIS INTELIGENTE CON IA:");
  console.log("Generando análisis con Claude...\n");

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Analiza el siguiente texto y proporciona 3-4 insights breves sobre su contenido, tono y características principales. El texto tiene ${wordCount} palabras, ${sentenceCount} oraciones y las palabras más frecuentes son: ${topWords.slice(0, 5).map((w) => w.word).join(", ")}.\n\nTexto:\n"${text.substring(0, 500)}${text.length > 500 ? "..." : ""}"`,
        },
      ],
    });

    if (message.content[0].type === "text") {
      console.log(message.content[0].text);
    }
  } catch (error) {
    console.log("Error al llamar a Claude:", error.message);
  }

  console.log("\n" + "=".repeat(50));
}

// Main execution
async function main() {
  console.log("🎯 ANALIZADOR DE TEXTO CON IA");
  console.log("================================\n");

  try {
    // Get text from user
    const text = await question(
      "Ingresa el texto a analizar (o presiona Enter para usar texto de demostración):\n> "
    );

    let textToAnalyze = text;

    if (!text.trim()) {
      // Default demo text in Spanish
      textToAnalyze = `La inteligencia artificial ha revolucionado la forma