import json
from typing import Optional, Dict, Any
import google.generativeai as genai
from config import GEMINI_API_KEY, GEMINI_MODEL

class GeminiGenerator:
    """Handles Gemini LLM generation."""
    
    def __init__(self, api_key: str = GEMINI_API_KEY, model_name: str = GEMINI_MODEL):
        if not api_key:
            raise ValueError("GEMINI_API_KEY is required")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model_name)
    
    def generate(self, system_prompt: str, user_prompt: str) -> Optional[Dict[str, Any]]:
        """Generate response and parse JSON."""
        try:
            full_prompt = f"{system_prompt}\n\n{user_prompt}"
            response = self.model.generate_content(full_prompt)
            
            # Extract JSON from response
            text = response.text.strip()
            
            # Try to find JSON in markdown code blocks
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            return json.loads(text)
        
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}")
            return None
        except Exception as e:
            print(f"Generation error: {e}")
            return None
