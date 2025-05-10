'use client';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  explanation: string;
  category?: string;
}

/**
 * Quiz provider for serving security questions
 */
export class EchoQuizService {
  private static questions: QuizQuestion[] = [
    {
      id: 1,
      question: "What is a strong password practice?",
      options: [
        "Using the same password for all accounts",
        "Using a combination of letters, numbers, and special characters",
        "Using your birth date",
        "Using common words"
      ],
      correctAnswer: 1,
      difficulty: 'beginner',
      explanation: "Strong passwords use a mix of character types and should be unique for each account.",
      category: "password"
    },
    {
      id: 2,
      question: "How can you identify a potential phishing email?",
      options: [
        "The sender's email address looks legitimate",
        "It creates urgency to act immediately",
        "It has a professional layout",
        "It's from a known company"
      ],
      correctAnswer: 1,
      difficulty: 'beginner',
      explanation: "Phishing emails often create urgency to bypass your rational thinking.",
      category: "email"
    },
    {
      id: 3,
      question: "What is two-factor authentication?",
      options: [
        "Using two different passwords",
        "Using a password and a security question",
        "Using something you know and something you have",
        "Using two different email addresses"
      ],
      correctAnswer: 2,
      difficulty: 'intermediate',
      explanation: "2FA combines something you know (password) with something you have (like a phone).",
      category: "account"
    },
    {
      id: 4,
      question: "Which network type is most secure for public use?",
      options: [
        "Open WiFi",
        "WEP encrypted WiFi",
        "WPA2 encrypted WiFi",
        "VPN over public WiFi"
      ],
      correctAnswer: 3,
      difficulty: 'intermediate',
      explanation: "Using a VPN over any public network adds an extra layer of encryption.",
      category: "network"
    },
    {
      id: 5,
      question: "What is a firewall designed to do?",
      options: [
        "Scan for viruses",
        "Speed up internet connection",
        "Filter network traffic",
        "Encrypt your data"
      ],
      correctAnswer: 2,
      difficulty: 'beginner',
      explanation: "Firewalls monitor and filter incoming and outgoing network traffic.",
      category: "network"
    }
  ];

  /**
   * Get a random security question
   * @param difficulty Optional filter by difficulty level
   * @returns A question object
   */
  static getRandomQuestion(difficulty?: 'beginner' | 'intermediate' | 'advanced', category?: string): QuizQuestion {
    let filteredQuestions = this.questions;
    
    if (difficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
    }
    
    if (category) {
      filteredQuestions = filteredQuestions.filter(q => q.category === category);
    }
    
    if (filteredQuestions.length === 0) {
      return this.questions[0]; // Fallback if no matching questions
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    return filteredQuestions[randomIndex];
  }
  
  /**
   * Get all questions
   * @returns Array of all question objects
   */
  static getAllQuestions(): QuizQuestion[] {
    return [...this.questions];
  }
  
  /**
   * Get a specific question by ID
   * @param id The unique question ID
   * @returns Question object or undefined if not found
   */
  static getQuestionById(id: number): QuizQuestion | undefined {
    return this.questions.find(q => q.id === id);
  }
  
  /**
   * Get questions by category
   * @param category The category name
   * @returns Array of matching question objects
   */
  static getQuestionsByCategory(category: string): QuizQuestion[] {
    return this.questions.filter(q => q.category === category);
  }

}
