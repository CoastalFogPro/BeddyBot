export const BLOCKED_TERMS = [
    // 1. Sexual & Adult Content
    "sex", "sexual", "sexy", "intercourse", "porn", "porno", "pornography",
    "blowjob", "handjob", "orgasm", "climax", "penetration", "erection",
    "vagina", "penis", "dick", "cock", "pussy", "tits", "boobs", "nipples",
    "anal", "analsex", "cum", "semen", "sperm",
    "fetish", "kink", "kinky", "bdsm", "bondage", "domination", "submissive",
    "sadism", "masochism", "roleplay", "feet pics", "foot fetish",

    // 2. Sexual Orientation & Gender (Blocked for child-content safety availability default)
    "gay", "lesbian", "bisexual", "pansexual", "homosexual",
    "transgender", "trans", "nonbinary", "genderfluid", "queer",

    // 3. Anthropomorphic / Furry
    "furry", "furries", "fursona", "anthro", "yiff",

    // 4. Drugs, Alcohol & Substance Use
    "drugs", "drug use", "cocaine", "crack", "heroin", "meth", "methamphetamine",
    "lsd", "acid", "ecstasy", "molly", "shrooms", "mushrooms", "fentanyl",
    "alcohol", "booze", "beer", "wine", "liquor", "vodka", "whiskey", "tequila",
    "drunk", "wasted", "tipsy",
    "cigarette", "cigarettes", "vape", "vaping", "nicotine",
    "weed", "marijuana", "pot", "joint", "blunt",

    // 5. Violence & Harm
    "murder", "kill", "killing", "suicide", "self-harm", "self harm",
    "blood", "gore", "torture", "rape", "assault", "abuse",
    "stabbing", "shooting", "dead body", "corpse",

    // 6. Profanity & Crude Language
    "fuck", "f*ck", "fck", "shit", "bullshit", "bitch", "asshole",
    "bastard", "damn", "goddamn", "piss",

    // 7. Hate Speech & Slurs
    "nigger", "faggot", "kike", "spic", "chink", "tranny", "dyke", "retard", // Explicit block of common slurs per "Zero Tolerance" request

    // 8. Dark / Occult / Horror
    "demon", "demons", "satan", "satanic", "devil worship",
    "possession", "ritual sacrifice", "summoning",

    // 9. Adult Relationships & Dating
    "dating", "hookup", "boyfriend", "girlfriend",
    "kissing", "divorce",

    // 10. Crime & Illegal Activity
    "theft", "stealing", "robbery", "fraud", "hacking", "blackmail", "kidnapping"
];

// Helper check
export function containsBlockedTerm(text: string): { found: boolean, term?: string } {
    const normalized = text.toLowerCase();

    // Check for exact word matches or phrases
    for (const term of BLOCKED_TERMS) {
        // Simple includes check is robust for phrases ("drug use") and partial matches often desirable here
        // For short words like "pot" or "trans", we might get false positives in "potato" or "transport", 
        // so let's refine to word boundaries for short terms if needed.
        // For strictly blocking the list provided, a broad includes is safer but stricter. 
        // Let's use word boundary regex for short words, simple includes for phrases.

        if (term.includes(' ')) {
            if (normalized.includes(term)) return { found: true, term };
        } else {
            // regex for whole word to avoid "scunthorpe" problem
            // e.g. "ass" in "grass" (though 'ass' isn't in list above, 'piss' is)
            const regex = new RegExp(`\\b${term}\\b`, 'i');
            if (regex.test(normalized)) return { found: true, term };
        }
    }
    return { found: false };
}
