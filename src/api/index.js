import axios from "axios";
import qs from "qs";
class Api {
  constructor() {
    this.gptInstance = axios.create({
      baseURL: import.meta.env.VITE_GPT_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    });
  }

  async createChatCompletion(messages, options = {}) {
    try {
      const response = await this.gptInstance.post("/chat/completions", {
        model: options.model || "gpt-4",
        messages,
        ...options,
      });

      return response.data.choices;
    } catch (error) {
      console.error("Error creating chat completion:", error);
    }
  }

}

const api = new Api();

export default api;
