
import { supabase } from "@/integrations/supabase/client";

// Random funny titles for the landing page
export const funnyTitles = [
  "Another Day, Another Delusion",
  "Your Resume vs. Reality",
  "Corporate Dreams & Shattered Hopes",
  "Skills: Exaggeration & Buzzwords",
  "Employment History or Fan Fiction?",
  "Resume Roasting: Where Dreams Come to Die",
  "Your CV: A Comedy Special",
  "Qualification Cremation Service",
  "Professional Skill Exaggeration Detector",
  "LinkedIn Profile vs. Real Life",
  "Microsoft Word Skills: 10/10",
  "From Mediocre to Meme-worthy"
];

// Random loading messages
export const loadingMessages = [
  "Consulting HR for insults...",
  "Deciphering font choices...",
  "Judging your career decisions...",
  "Calculating years of exaggeration...",
  "Scanning for LinkedIn buzzwords...",
  "Analyzing BS to content ratio...",
  "Counting how many times you wrote 'passionate'...",
  "Detecting corporate jargon overload...",
  "Measuring experience inflation rate...",
  "Questioning your life choices...",
  "Reading between the lines...",
  "Translating resume-speak to reality...",
  "Calibrating sarcasm levels..."
];

// Generate a roast using the DeepSeek API via Supabase Edge Function
export const generateRoast = async (resumeText: string, isExtraSpicy: boolean): Promise<string> => {
  try {
    // First try using our DeepSeek API via Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('deepseek-resume-roast', {
      body: { resumeText, isExtraSpicy }
    });

    if (error) {
      console.error('Error calling DeepSeek API:', error);
      // Fall back to local roasts if API call fails
      return generateLocalRoast(isExtraSpicy);
    }

    return data.roast;
  } catch (error) {
    console.error('Error generating roast:', error);
    // Fall back to local roasts if anything fails
    return generateLocalRoast(isExtraSpicy);
  }
};

// Fallback function to generate roasts locally if API fails
const generateLocalRoast = (isExtraSpicy: boolean): Promise<string> => {
  const spicyRoasts = [
    "Your resume reads like a LinkedIn influencer's fever dream. 'Detail-oriented'? The only detail you're oriented towards is the office snack table. 'Cross-functional collaboration' sounds fancy, but we all know it means you once shared a Google doc. Maybe add more buzzwords - that'll definitely distract from the three months you spent as an 'aspiring entrepreneur' (unemployed). 📊🍩",
    "Congratulations on cramming every corporate buzzword into one document! Your 'synergized cross-functional team leadership' probably means you once ordered pizza for a meeting. I'm impressed by how you stretched 'I made a spreadsheet' into three paragraphs of 'data-driven decision making implementation.' Your 'extensive experience' section is longer than your actual work history. 🍕💼",
    "I see you're 'proficient in Microsoft Office.' Wow, you and every other human who's touched a computer since 1995. Revolutionary stuff! Your 'results-driven approach' must be why you listed your GPA from 8 years ago but conveniently omitted any measurable outcomes from your jobs. At least your consistent use of corporate jargon demonstrates commitment to something. 💻⏳",
    "Your career trajectory looks like a game of corporate Snakes and Ladders where you forgot the ladders. Six jobs in three years - did you collect them like Pokémon cards? The 'seeking new challenges' in your objective is a creative way to say 'please ignore my job-hopping.' I'm particularly impressed by how your responsibilities mysteriously multiply with each telling. Perhaps next time mention your 'attention to detail' after spell-checking. 🐍📉",
    "'Results-driven professional' is a creative way of saying you occasionally complete tasks you're literally paid to do. Bravo! Your skill section lists 'leadership' but your experience screams 'follows instructions when supervised.' The vague 'contributed to team success' appears no less than four times - were these contributions too embarrassing to detail? Your 'proficient in social media' must refer to all those hours on Facebook during work. 👏⭐",
    "Your resume has more padding than a Thanksgiving turkey. Maybe 'managed multi-million dollar projects' means you once bought supplies for the office? Your LinkedIn profile says 'influencer' but your experience says 'influenced by whoever was willing to hire me.' Three bullet points to describe how you answered phones is truly the creative writing we expect from someone who lists 'storytelling' as a skill. 🦃💸",
    "Three internships and you still list 'Microsoft Word' as a skill. Bold strategy! I see you've mastered the art of turning 'I helped with' into 'I spearheaded.' Your 'dynamic problem-solving abilities' must refer to figuring out the office coffee machine. I'm impressed by your ability to use 'leverage' as a verb in every single bullet point - that's commitment to jargon that even management consultants would admire. 📝🧠",
    "Your 'leadership experience' section suggests you once told someone to pass the stapler and they actually did it. Power moves only! The phrase 'team player' appears so many times I'm wondering if you're compensating for something. Your career objective states 'seeking challenging opportunities' but your job history screams 'seeking anything with health benefits.' At least your creative writing skills are evident in how you transformed answering emails into 'managing critical communications infrastructure.' 📌💪"
  ];

  const extraSpicyRoasts = [
    "This resume is so generic I thought my printer was running a test page. Did you ask ChatGPT to 'make me sound important but not too interesting'? Your career objective says 'passionate professional' but your experience screams 'will work for minimum validation.' I counted fourteen buzzwords in the first paragraph alone - did you get paid by the corporate cliché? The three-month employment gaps are creative, though not as creative as calling yourself an 'executive' at a company of two people (one being your cat). 🤖📄",
    "Ah yes, 'team player' - corporate code for 'will do other people's work without complaining.' Your salary negotiation skills must be equally impressive! The chronological chaos of your employment history suggests you're trying to hide something - perhaps that 'consulting work' (unemployment) between jobs? I particularly enjoyed how your responsibilities magically expanded in the retelling, like that summer internship where you apparently 'revolutionized operational workflows' by refilling the printer paper. 🏆💸",
    "Your employment gaps are more consistent than your actual employment. At least commitment issues are transferable skills! I see you've listed 'proficient in Excel' despite your apparent inability to align dates or create a coherent timeline. Your 'entrepreneurial venture' (selling stuff on Etsy for three months) takes up more space than your actual career. At least you're 'detail-oriented' enough to include every irrelevant workshop you've ever attended while omitting any actual accomplishments. 📆🚫",
    "Listing 'attention to detail' right above a typo is the kind of irony that keeps HR departments entertained during lunch breaks. I'm impressed by how you transformed 'used email' into 'managed critical digital communications.' Your resume is longer than your actual work experience, mostly thanks to those paragraph-long bullet points explaining how you once made a PowerPoint presentation. I'm especially touched by the inclusion of your high school achievements - because clearly nothing more impressive has happened since. 🔍😂",
    "'Excellent communication skills' is hilarious coming from someone whose cover letter sounds like it was written by a robot struggling with human emotions. Did you run out of actual skills after 'Microsoft Office' and just start listing personality traits? Your 'results-oriented approach' must be why there's not a single measurable result anywhere on this document. The vague references to 'improving efficiency' without any percentages or metrics suggest the improvement was entirely in your imagination. 🤖💬",
    "I've seen more convincing fiction in airport bookstores than your 'accomplishments' section. Did you just write down your dreams and call it experience? Your skill section lists 'strategic thinking' but your career moves suggest otherwise. I'm particularly impressed by how you've managed to have seven years of experience in an industry that's only existed for five. The phrase 'responsible for' appears so many times it's clearly compensating for a complete lack of actual responsibility. 📚✈️",
    "Your resume is like a sample text document that accidentally got submitted. 'Dynamic professional' - as opposed to what? A stationary amateur? The way you've stretched a one-month contract into 'extensive industry experience' shows true creative writing talent. I'm especially impressed by your consistent job-hopping every 8-12 months while simultaneously claiming 'loyal' as a personal attribute. Your references 'available upon request' is the only honest statement here – because no one would willingly vouch for these exaggerations. ⚡🥱",
    "Claiming you're a 'detail-oriented problem-solver' while submitting this formatting disaster is the level of confidence we should all aspire to. Your bullet points about 'managing' and 'leading' teams are fascinating, especially since your job titles suggest the only thing you managed was the office recycling bin. The strategic placement of jargon can't hide that your three-page resume contains approximately one page of actual experience. I'm particularly impressed by your ability to turn 'I attended a meeting' into 'collaborated on cross-departmental strategic initiatives'. 🏆👓"
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      const roasts = isExtraSpicy ? extraSpicyRoasts : spicyRoasts;
      const randomIndex = Math.floor(Math.random() * roasts.length);
      resolve(roasts[randomIndex]);
    }, 1500);
  });
};

// Get a random title
export const getRandomTitle = (): string => {
  const randomIndex = Math.floor(Math.random() * funnyTitles.length);
  return funnyTitles[randomIndex];
};

// Get a random loading message
export const getRandomLoadingMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * loadingMessages.length);
  return loadingMessages[randomIndex];
};

type RoastData = {
  roast: string;
  isExtraSpicy: boolean;
}

// Save roast data in Supabase and fallback to sessionStorage
export const saveRoastData = async (
  id: string, 
  roast: string, 
  isExtraSpicy: boolean
): Promise<void> => {
  try {
    // Create a custom type for the insert data
    type ResumeRoastInsert = {
      shareable_id: string;
      roast: string;
      is_extra_spicy: boolean;
    }
    
    // Save to Supabase with the correct type
    const { error } = await supabase
      .from('resume_roasts')
      .insert({
        shareable_id: id,
        roast,
        is_extra_spicy: isExtraSpicy
      } as ResumeRoastInsert);
    
    if (error) {
      console.error('Error saving roast to Supabase:', error);
      // Fallback to sessionStorage
      saveRoastToSessionStorage(id, roast, isExtraSpicy);
    }
  } catch (error) {
    console.error('Error during Supabase save:', error);
    // Fallback to sessionStorage
    saveRoastToSessionStorage(id, roast, isExtraSpicy);
  }
};

// Helper function to save to sessionStorage as fallback
const saveRoastToSessionStorage = (
  id: string, 
  roast: string, 
  isExtraSpicy: boolean
): void => {
  const roastData = {
    id,
    roast,
    isExtraSpicy,
    timestamp: Date.now(),
  };
  
  sessionStorage.setItem(`roast_${id}`, JSON.stringify(roastData));
  
  // Set expiry (48 hours)
  const expiry = Date.now() + 48 * 60 * 60 * 1000;
  sessionStorage.setItem(`roast_${id}_expiry`, expiry.toString());
};

// Get roast data from Supabase or sessionStorage
export const getRoastData = async (id: string): Promise<RoastData | null> => {
  try {
    // Define the type for the query result
    type ResumeRoastResult = {
      roast: string;
      is_extra_spicy: boolean;
    }
    
    // Try to get from Supabase first with the correct type
    const { data, error } = await supabase
      .from('resume_roasts')
      .select('roast, is_extra_spicy')
      .eq('shareable_id', id)
      .maybeSingle<ResumeRoastResult>();
    
    if (error || !data) {
      // If not found in Supabase, try sessionStorage
      return getRoastFromSessionStorage(id);
    }
    
    return {
      roast: data.roast,
      isExtraSpicy: data.is_extra_spicy
    };
  } catch (error) {
    console.error('Error fetching roast from Supabase:', error);
    // Fallback to sessionStorage
    return getRoastFromSessionStorage(id);
  }
};

// Helper function to get from sessionStorage as fallback
const getRoastFromSessionStorage = (id: string): RoastData | null => {
  const roastData = sessionStorage.getItem(`roast_${id}`);
  const expiry = sessionStorage.getItem(`roast_${id}_expiry`);
  
  if (!roastData || !expiry) {
    return null;
  }
  
  // Check if the roast has expired
  if (Date.now() > parseInt(expiry)) {
    sessionStorage.removeItem(`roast_${id}`);
    sessionStorage.removeItem(`roast_${id}_expiry`);
    return null;
  }
  
  const data = JSON.parse(roastData);
  return {
    roast: data.roast,
    isExtraSpicy: data.isExtraSpicy
  };
};
