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
      return { error: "API key not configured" }
    end

    # Estimate token usage to prevent overflow
    estimated_input_tokens = estimate_tokens(system_prompt + prompt)
    max_response_tokens = 12000
    
    if estimated_input_tokens > 120000 # GPT-4o-mini context limit minus response buffer
      Rails.logger.warn "Input tokens (#{estimated_input_tokens}) may exceed context window"
      return { error: "Content too large for processing" }
    end

    client = OpenAI::Client.new(
      access_token: api_key,
      request_timeout: 120 # 2 minutes timeout instead of default 30 seconds
    )
    
    quiz_data = make_api_request_with_retry(client, system_prompt, prompt, max_response_tokens)
    
    if quiz_data.is_a?(Hash) && quiz_data[:error]
      return quiz_data # Return error hash
    end

    if quiz_data.present?
      begin
        # Clean any potential markdown formatting
        cleaned_data = quiz_data.strip
                              .gsub(/^```json\s*/, '')
                              .gsub(/^```\s*/, '')
                              .gsub(/\s*```$/, '')
                              .strip
        
        puts "Generated quiz JSON: #{cleaned_data}" if Rails.env.development?
        return JSON.parse(cleaned_data)
      rescue JSON::ParserError => e
        Rails.logger.error "JSON parsing failed: #{e.message}"
        Rails.logger.error "Raw response: #{quiz_data}"
        return { error: "Invalid JSON response from AI service" }
      end
    else
      Rails.logger.error "Empty response from OpenAI"
      return { error: "No response received from AI service" }
    end
  end



  private

  def make_api_request_with_retry(client, system_prompt, prompt, max_tokens, max_retries = 3)
    retries = 0
    
    begin
      response = client.chat(
        parameters: {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: system_prompt},
            { role: "user", content: prompt}
          ],
          temperature: 0.4, # Lowered for more consistent JSON output
          max_tokens: max_tokens,
          response_format: { type: "json_object" }
        }
      )
      
      return response.dig("choices", 0, "message", "content")
      
    rescue => e
      retries += 1
      Rails.logger.warn "OpenAI API attempt #{retries} failed: #{e.message}"
      
      if retries < max_retries
        sleep_time = 2 ** retries # Exponential backoff: 2, 4, 8 seconds
        Rails.logger.info "Retrying in #{sleep_time} seconds..."
        sleep(sleep_time)
        retry
      else
        Rails.logger.error "OpenAI API failed after #{max_retries} attempts: #{e.message}"
        return { error: "API service temporarily unavailable" }
      end
    end
  end

  def estimate_tokens(text)
    # Rough estimation: ~4 characters per token for English text
    (text.length / 4.0).ceil
  end

  def intelligent_text_chunking(text, max_chars = 6000)
    return text if text.length <= max_chars
    
    # Try to find a good break point (paragraph, sentence, or word boundary)
    break_point = max_chars
    
    # Look for paragraph break within last 1000 characters
    paragraph_break = text.rindex("\n\n", max_chars)
    if paragraph_break && paragraph_break > (max_chars - 1000)
      break_point = paragraph_break
    else
      # Look for sentence break within last 500 characters  
      sentence_break = text.rindex(/[.!?]\s/, max_chars)
      if sentence_break && sentence_break > (max_chars - 500)
        break_point = sentence_break + 1
      else
        # Look for word boundary within last 100 characters
        word_break = text.rindex(' ', max_chars)
        if word_break && word_break > (max_chars - 100)
          break_point = word_break
        end
      end
    end
    
    truncated = text[0..break_point].strip
    Rails.logger.info "Text intelligently truncated from #{text.length} to #{truncated.length} characters"
    truncated + (break_point < text.length ? "..." : "")
  end

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

  def enhanced_prompt
    "Educational Objectives & Cognitive Framework:

    - Design questions using Bloom's Taxonomy distribution:
      * Remember/Understand (20%): Essential foundational concepts
      * Apply/Analyze (50%): Real-world application, problem-solving, and concept breakdown
      * Evaluate/Create (30%): Critical thinking, judgment, synthesis, and innovation
    - Focus on deep learning principles: active retrieval, spaced concepts, and transfer learning
    - Address common misconceptions with pedagogically sound distractors
    - Create authentic assessments that mirror real-world application of concepts

    Advanced Question Design Standards:
    - Scenario-based questions requiring application to novel situations
    - Multi-step reasoning problems that build cognitive complexity
    - Include 'What would happen if...' hypothetical scenarios
    - Add metacognitive elements: 'Why might someone incorrectly choose [option]?'
    - Create questions connecting different sections of the material
    - Include analogical reasoning and cross-domain transfer
    - Design distractors based on typical student reasoning errors, not random alternatives

    Question Quality & Authenticity:
    - Prioritize 'why' and 'how' over 'what' - avoid surface-level recall
    - Include current, real-world examples and industry-relevant scenarios
    - Ask learners to explain processes, justify decisions, and generate examples
    - Create questions requiring synthesis of multiple concepts from the text
    - Include comparative analysis: 'Compare and contrast X and Y in terms of...'
    - Add evaluative thinking: 'Assess the effectiveness/validity of this approach...'
    - Design questions that challenge assumptions and promote critical thinking

    Rich Educational Feedback:
    - Provide detailed explanations that teach new insights, not just confirm correctness
    - Explain why each incorrect answer represents a common misconception or reasoning error
    - Include references to specific concepts or sections from the source material
    - Add 'further reflection' elements: 'How does this connect to broader principles?'
    - Create explanations that help learners understand the underlying reasoning process

    Cognitive Challenge Progression:
    - Vary cognitive load throughout the quiz from foundational to complex applications
    - Include questions requiring working backwards from results or outcomes
    - Create problems where learners must eliminate multiple variables or considerations
    - Design questions that require learners to predict consequences or outcomes
    - Add reflective questions about learning process and concept connections

    Technical Requirements:
    - Generate 10-20 challenging thought-provoking questions that deeply cover the content, designed to promote true understanding and retention
    - Include a mix of multiple choice and long response questions
    - Ensure topic names are concise (2 words preferred, maximum 3 words)
    - Each multiple choice question must have exactly 3 plausible but incorrect distractors
    - Each long response question must provide:
        1. A structured guideline for how to approach the answer
        2. A clear, accurate solution
    - Use meaningful external_id values like: subject_001, subject_002, etc.
    - Assign difficulty levels: mostly advanced, with a few intermediate questions for variety
    - Include relevant tags describing the topic of each question
    - Set realistic time estimates per question (30–120 seconds)
    - Provide clear explanations for **why the correct answer is correct**
    - Ensure questions evaluate multiple cognitive skills: comprehension, application, analysis, and synthesis
    - Include optional code snippets or examples when relevant; format them clearly for readability"
  end


  # def build_quiz_prompt(categories, file_text, uploaded_original_file_name, title, topic, subject)
  #   puts "Building quiz prompt...", title, topic, subject
  #   truncated_text = file_text.length > 8000 ? file_text[0..8000] + "..." : file_text

  #   # Build conditional instructions based on provided parameters
  #   title_instruction = title.present? ? "- Use '#{title}' as the quiz title" : "- Generate an appropriate quiz title based on content"
  #   topic_instruction = topic.present? ? "- Use '#{topic}' as the quiz topic" : "- If quiz is related to an existing topic (#{categories&.map { |c| c[:topic] }&.join(', ')}), use that topic (case insensitive)"
  #   subject_instruction = subject.present? ? "- Use '#{subject}' as the quiz subject" : "- Generate an appropriate subject based on content"
    
  #   "Based on the following text content from file '#{uploaded_original_file_name}', generate quiz questions in this EXACT JSON format: #{json_quiz_example.to_json}

  #   Requirements:
  #   #{enhanced_prompt}
  #   #{title_instruction}
  #   #{topic_instruction}
  #   #{subject_instruction}

  #   Text content to analyze: #{truncated_text}"
  # end


  #  def build_quiz_prompt(categories, file_text, uploaded_original_file_name, title, topic, subject)
   def build_quiz_prompt(categories, file_text, uploaded_original_file_name, title, topic, subject)
    puts "Building enhanced quiz prompt..." if Rails.env.development?
    
    # Use intelligent text chunking instead of hard truncation
    processed_text = intelligent_text_chunking(file_text, 6000)
    
    puts "Text processed: #{file_text.length} -> #{processed_text.length} characters" if Rails.env.development?

    # Build conditional instructions based on provided parameters
    title_instruction = title.present? ? "- Use '#{title}' as the quiz title" : "- Generate an appropriate quiz title based on content"
    topic_instruction = topic.present? ? "- Use '#{topic}' as the quiz topic" : "- If quiz is related to an existing topic (#{categories&.map { |c| c[:topic] }&.join(', ')}), use that topic (case insensitive)"
    subject_instruction = subject.present? ? "- Use '#{subject}' as the quiz subject" : "- Generate an appropriate subject based on content"
    
    "Based on the following text content from file '#{uploaded_original_file_name}', generate quiz questions in this EXACT JSON format: #{json_quiz_example.to_json}

    #{enhanced_prompt}

    #{title_instruction}
    #{topic_instruction}
    #{subject_instruction}

    Text content to analyze: #{processed_text}"
  end

end