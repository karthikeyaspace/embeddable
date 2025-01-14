export interface ChatbotConfig {
  user_id?: string;
  chatbot_id?: string;
  logo_url: string;
  image_url: string;
  user_name: string;
  website_url: string;
  chatbot_type: "personal" | "business";
  home_message: string;
  description?: string;
  contact_link: string;
  default_questions: string[];
  greeting_message: string;
  error_response: string;
  ai_configuration?: {
    user_question: string; 
    ai_response: string;
  }[];
}
