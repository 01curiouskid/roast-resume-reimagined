
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
    "Your resume reads like a LinkedIn influencer's fever dream. 'Detail-oriented'? The only detail you're oriented towards is the office snack table. 📊🍩",
    "Congratulations on cramming every corporate buzzword into one document! Your 'synergized cross-functional team leadership' probably means you once ordered pizza for a meeting. 🍕💼",
    "I see you're 'proficient in Microsoft Office.' Wow, you and every other human who's touched a computer since 1995. Revolutionary stuff! 💻⏳",
    "Your career trajectory looks like a game of corporate Snakes and Ladders where you forgot the ladders. 🐍📉",
    "'Results-driven professional' is a creative way of saying you occasionally complete tasks you're literally paid to do. Bravo! 👏⭐",
    "Your resume has more padding than a Thanksgiving turkey. Maybe 'managed multi-million dollar projects' means you once bought supplies for the office? 🦃💸",
    "Three internships and you still list 'Microsoft Word' as a skill. Bold strategy! 📝🧠",
    "Your 'leadership experience' section suggests you once told someone to pass the stapler and they actually did it. Power moves only! 📌💪"
  ];

  const extraSpicyRoasts = [
    "This resume is so generic I thought my printer was running a test page. Did you ask ChatGPT to 'make me sound important but not too interesting'? 🤖📄",
    "Ah yes, 'team player' - corporate code for 'will do other people's work without complaining.' Your salary negotiation skills must be equally impressive! 🏆💸",
    "Your employment gaps are more consistent than your actual employment. At least commitment issues are transferable skills! 📆🚫",
    "Listing 'attention to detail' right above a typo is the kind of irony that keeps HR departments entertained during lunch breaks. 🔍😂",
    "'Excellent communication skills' is hilarious coming from someone whose cover letter sounds like it was written by a robot struggling with human emotions. 🤖💬",
    "I've seen more convincing fiction in airport bookstores than your 'accomplishments' section. Did you just write down your dreams and call it experience? 📚✈️",
    "Your resume is like a sample text document that accidentally got submitted. 'Dynamic professional' - as opposed to what? A stationary amateur? ⚡🥱",
    "Claiming you're a 'detail-oriented problem-solver' while submitting this formatting disaster is the level of confidence we should all aspire to. 🏆👓"
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

// Save roast data in Supabase and fallback to sessionStorage
export const saveRoastData = async (
  id: string, 
  roast: string, 
  isExtraSpicy: boolean
): Promise<void> => {
  try {
    // Save to Supabase
    const { error } = await supabase
      .from('resume_roasts')
      .insert({
        shareable_id: id,
        roast,
        is_extra_spicy: isExtraSpicy
      });
    
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
export const getRoastData = async (id: string): Promise<{ roast: string; isExtraSpicy: boolean } | null> => {
  try {
    // Try to get from Supabase first
    const { data, error } = await supabase
      .from('resume_roasts')
      .select('roast, is_extra_spicy')
      .eq('shareable_id', id)
      .single();
    
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
const getRoastFromSessionStorage = (id: string): { roast: string; isExtraSpicy: boolean } | null => {
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
