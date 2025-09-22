class OpenaiService
  require 'openai'

  def self.generate_quiz_from_uploaded_file(categories, file_text, uploaded_original_file_name, title, 
        topic, subject)
    new.generate_quiz_from_uploaded_file(categories, file_text, uploaded_original_file_name, title, topic, subject)
  end

  def generate_quiz_from_uploaded_file(categories,file_text, uploaded_original_file_name, title, topic, subject)
    system_prompt = <<~PROMPT
      You are an expert quiz generator. Generate quiz questions based on the provided text content. Return ONLY valid JSON in the exact format specified, with no additional text or explanations.
    PROMPT

    prompt = build_quiz_prompt(categories, file_text, uploaded_original_file_name, title, topic, subject)
    api_key = Rails.application.credentials.openai_api_key || ENV['OPENAI_API_KEY'] || ENV['OPENAI_ACCESS_TOKEN']
    
    unless api_key.present?
      Rails.logger.error "OpenAI API key not found"
      return nil
    end

    quiz_data = OpenAI::Client.new(access_token: api_key).chat(
      parameters: {
        model: "gpt-4o",
        messages: [
          { role: "system", content: system_prompt},
          { role: "user", content: prompt}
        ],
        temperature: 0.7, max_tokens: 2000,
        response_format: { type: "json_object" }
      }
    ).dig("choices", 0, "message", "content")

    if quiz_data.present?
      # Clean any potential markdown formatting
      cleaned_data = quiz_data.strip
                            .gsub(/^```json\s*/, '')
                            .gsub(/^```\s*/, '')
                            .gsub(/\s*```$/, '')
                            .strip
      
      print("Generated quiz JSON: #{cleaned_data}") if Rails.env.development?
      return JSON.parse(cleaned_data)
    end
  end



  private

  def json_quiz_example
    json_quiz_example = {
        "topic": "[Main topic/category from the content]",
        "subject": "[Specific subject area]",
        "title": "[Descriptive quiz title]",
        "description": "[Brief description of what this quiz covers]",
        "questions": [
          {
            "external_id": "[topic_subject_uniqueID_001]",
            "question_format": "multiple_choice",
            "question": "[Your question text here]",
            "answer": "[Correct answer]",
            "incorrect_answers": [
              "Wrong option 1",
              "Wrong option 2",
              "Wrong option 3"
            ],
            "code_snippet": "[Optional code snippet related to the question]",
            "hint": "[Optional helpful hint]",
            "explanation": "[Explanation of why this answer is correct]",
            "difficulty": "[easy|intermediate|advanced]",
            "estimated_time_seconds": [30, 120],
            "tags": ["tag1", "tag2", "tag3"],
            "path": "[topic/subject/category]"
          }
        ]
    }
    return json_quiz_example
  end


   def build_quiz_prompt(categories, file_text, uploaded_original_file_name, title, topic, subject)
    puts "Building quiz prompt...", title, topic, subject
    truncated_text = file_text.length > 8000 ? file_text[0..8000] + "..." : file_text

    # Build conditional instructions based on provided parameters
    title_instruction = title.present? ? "- Use '#{title}' as the quiz title" : "- Generate an appropriate quiz title based on content"
    topic_instruction = topic.present? ? "- Use '#{topic}' as the quiz topic" : "- If quiz is related to an existing topic (#{categories&.map { |c| c[:topic] }&.join(', ')}), use that topic (case insensitive)"
    subject_instruction = subject.present? ? "- Use '#{subject}' as the quiz subject" : "- Generate an appropriate subject based on content"
    
    "Based on the following text content from file '#{uploaded_original_file_name}', generate quiz questions in this EXACT JSON format: #{json_quiz_example.to_json}

    Requirements:
    - Generate 10-20 challenging questions that deeply cover the content, designed to promote true understanding and retention.
    - Include a mix of multiple choice and long response questions.
    - Ensure topic names are concise (2 words preferred, maximum 3 words).
    - Each multiple choice question must have exactly 3 plausible but incorrect distractors.
    - Each long response question must provide:
        1. A structured guideline for how to approach the answer
        2. A clear, accurate solution
    - Use meaningful `external_id` values like: subject_001, subject_002, etc.
    - Assign difficulty levels: mostly advanced, with a few intermediate questions for variety.
    - Include relevant tags describing the topic of each question.
    - Set realistic time estimates per question (30–120 seconds).
    - Provide clear explanations for **why the correct answer is correct**.
    - Ensure questions evaluate multiple cognitive skills: comprehension, application, analysis, and synthesis.
    - Include optional code snippets or examples when relevant; format them clearly for readability.
    - Make questions thought-provoking, avoiding surface-level recall.

    #{title_instruction}
    #{topic_instruction}
    #{subject_instruction}

    Text content to analyze:
    #{truncated_text}"
  end

end