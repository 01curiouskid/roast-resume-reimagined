
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get the DeepSeek API key from environment variables
const apiKey = Deno.env.get('DEEPSEEK_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!apiKey) {
      console.error('DeepSeek API Key is missing');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { resumeText, isExtraSpicy } = await req.json();

    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: 'Resume text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating roast. Extra spicy: ${isExtraSpicy}. Resume length: ${resumeText.length} chars`);

    // Create a system prompt that instructs the model how to generate the roast
    const spicyLevel = isExtraSpicy ? 
      "Be extremely critical, snarky and ruthless, but still funny. Don't hold back at all." :
      "Be critical but somewhat playful. Point out issues but keep it somewhat lighthearted.";

    const systemPrompt = `You are ResumeRoaster, an AI specialized in providing humorous, critical feedback on resumes. 
    ${spicyLevel}
    Analyze the resume carefully and create a funny roast that:
    1. Is 7-10 sentences long
    2. References specific skills, projects, job titles, or experiences mentioned in the resume
    3. Points out common resume red flags, exaggerations, or clichés
    4. Includes at least one creative metaphor or comparison
    5. Ends with a sarcastic but somewhat constructive punchline
    6. Include 1-2 relevant emojis at the end
    
    Be specific and reference actual content from their resume, don't just make generic statements.`;

    // Call the DeepSeek API
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: resumeText }
        ],
        temperature: isExtraSpicy ? 0.85 : 0.7,
        max_tokens: 800,
      }),
    });

    // Check if the API call was successful
    if (!response.ok) {
      const errorData = await response.json();
      console.error('DeepSeek API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to generate roast', details: errorData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the generated roast from the response
    const data = await response.json();
    const generatedRoast = data.choices[0].message.content;

    // Return the roast
    return new Response(
      JSON.stringify({ roast: generatedRoast }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in deepseek-resume-roast function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
