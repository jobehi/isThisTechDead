export const roastLevels = {
  0: [
    // 💚 Totally Alive
    "Still kicking harder than your New Year's resolutions.",
    'This tech has more life than your childhood dreams.',
    "Actively maintained by people who don't hate themselves yet.",
    "This one's not going anywhere—unlike your last three projects.",
    'Stable, reliable, and way out of your league.',
    'Still breathing. Still relevant. Still better than you.',
    'Might outlive the sun. Or at least PHP.',
    'This tech is fresher than your startup idea. Ouch.',
    'Being updated more often than your Tinder profile.',
    'Codebase is thriving. Unlike your sleep schedule.',
    'Alive and kicking. Unlike your career trajectory.',
    'This tech is thriving. Weird, I know.',
    'Solid as a rock. Unlike your last relationship.',
    "You won't be laughed at for using this. Today.",
    'Still showing signs of life. How original.',
    'Yep, people still pretend this is the future.',
    "Developers are still arguing about this on Twitter. So it's doing fine.",
    'Currently in hype mode. Investors are aroused.',
    'You can use this in production. And sleep at night.',
    'Healthier than your work-life balance.',
    'Will outlive Twitter rebrands and your optimism.',
    'Vibrant, annoying, and not going away. Like Web3 in 2021.',
    "It's alive! Unlike your last deployment.",
    'Still kicking. Might even get a conference keynote soon.',
    'Too popular to die. Like U2, but with more bugs.',
    // add more
  ],

  1: [
    // 💙 Stable But Boring
    'Stable as a rock. About as exciting as one too.',
    "Enterprise-ready, which is code for 'boringly reliable'.",
    'So stable it might as well be in a museum.',
    "Still works perfectly. That's the most interesting thing about it.",
    'Runs smoothly on thousands of servers. All maintained by people who look dead inside.',
    'Rock solid stability, soul-crushing mediocrity.',
    'The Toyota Corolla of technologies. Never breaks, never impresses.',
    "Hasn't crashed in years. Neither has its GitHub star count.",
    'Your boss loves it. That should tell you everything.',
    "The official technology of 'it pays the bills'.",
    'You could build the next 100 years of legacy systems with this. Is that a good thing?',
    'Stability guaranteed. Innovation optional.',
    'Mature, stable, and as exciting as accounting software.',
    'Zero drama, zero surprises, zero reasons to update your LinkedIn.',
    'Reliable enough to build your career on. Dull enough to question that choice.',
    'The tech equivalent of sensible shoes.',
    "It does exactly what it's supposed to. Nothing more, nothing less. Forever.",
    'Will be running unchanged in production when the sun explodes.',
    "Like a well-maintained highway. Essential, reliable, and no one's excited about it.",
    'So stable it makes COBOL look cutting-edge.',
    'Predictable, constant, and unlikely to appear on any conference t-shirts.',
    'Will outlive us all. Somehow that feels like a threat.',
    "Perfect for systems that must never, ever change. Like your manager's mindset.",
    'A technological plateau of pure, undiluted adequacy.',
    "Best described in performance reviews as 'meets expectations'.",
  ],

  2: [
    // 🟠 Actively Rotting
    'It compiles, but it also cries.',
    'Officially on life support. Devs communicate via ouija board.',
    "You can use it, sure. Just don't expect anyone to help you.",
    'About as cool as Vine. And we know what happened there.',
    'Dev team has vanished. Might be ghosts.',
    'Github repo has more dust than stars.',
    'Updates come slower than the next Half-Life.',
    'Worse than a group project where no one replies.',
    'Used by exactly three companies and one confused intern.',
    'StackOverflow is full of questions. No answers.',
    'Smells like tech debt.',
    'If you touch this, wear gloves.',
    'Not officially dead. But spiritually? Deceased.',
    'It lives in legacy code and regrets.',
    'Can be summoned with ancient incantations.',
    'Slowly decomposing. Smells like XML.',
    'Probably written in a language no one wants to maintain.',
    'Getting fewer commits than your personal blog.',
    "The repo's alive, but spiritually? No.",
    'Might be revived by a course on Udemy for $12.99.',
    'Only maintained by unpaid ghosts.',
    'This is a rite of passage. For suffering.',
    'The docs exist. On GeoCities.',
    'Still has users. Mostly archaeologists.',
    "Run, don't walk, away from this.",
    // ...90 more rot roasts
  ],

  3: [
    // 🔴 Mostly Dead
    'One step away from an obituary.',
    'Last commit was during the Renaissance.',
    'Dead enough to haunt your CI/CD pipeline.',
    "If this tech was a pet, you'd be explaining death to a child.",
    'The official documentation is a 404 page.',
    'Devs pretend to maintain it. Like you pretend to be okay.',
    "Still technically 'open source.' Emotionally? Closed off.",
    'Corporate abandonedware. Pour one out.',
    'Being revived only for ironic conference talks.',
    'Getting a job in this is like becoming a VHS repairman.',
    "We don't talk about this. Seriously.",
    'This tech is a cautionary tale.',
    'Only mentioned in hushed tones at tech conferences.',
    'Still running. Like your childhood trauma.',
    'Used only by that one team nobody talks to.',
    'This one aged like milk. In the sun.',
    "Someone tried to revive it once. They're gone now.",
    'More stale than your portfolio site.',
    "It's mostly just stars now. Like your side projects.",
    "Still in production... on one guy's server in Romania.",
    "Maintainer hasn't committed since the Obama era.",
    'Actively decaying, like NFTs.',
    "It's technically open-source. Just not open-sane.",
    'Beloved by people who hate themselves.',
    'The only update was a comment typo fix in 2019.',
    // ...90 more almost-dead roasts
  ],

  4: [
    // ⚫ Fully Dead
    'Dead. Buried. The end.',
    'Used exclusively in academic papers no one reads.',
    'This tech has rigor mortis.',
    'Your career dies a little every time you mention this.',
    'Only found in museum exhibits and your legacy code.',
    'Mentioning this tech in 2025 is a cry for help.',
    'Even ChatGPT hesitates to talk about it.',
    'Its last release note was a suicide note.',
    'Dead like disco. But less charming.',
    'If you use this, you are the bug.',
    'Here lies a framework once loved, now just mourned.',
    'This tech died as it lived: overly hyped and under-documented.',
    "You're not brave. You're reckless.",
    'Use this and get a LinkedIn badge for masochism.',
    'Officially discontinued. Like your dignity.',
    'Even Stack Overflow gave up.',
    'This tech is part of the archaeological dig now.',
    'Legends say its creator still roams the earth, whispering promises of updates.',
    "You'll find more activity in a fax machine.",
    "This tech has entered 'legacy' territory. Condolences.",
    'Still used... in enterprise apps nobody wants to touch.',
    'Dead, but HR still asks for it.',
    "You can't kill what's already obsolete.",
    'One PR a year and a dream.',
    'Abandon hope, all who compile here.',

    // ...90 more dead roasts
  ],
};

export function getSarcasticCommentary(score: number | undefined | null): string {
  // Default to level 0 if score is undefined, null or not a number
  if (score === undefined || score === null || isNaN(score)) {
    return roastLevels[0][Math.floor(Math.random() * roastLevels[0].length)];
  }

  // Ensure score is between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score));

  // Calculate roast level, ensuring it's between 0 and 4
  const roastLevel = Math.min(4, Math.max(0, Math.floor(normalizedScore / 25))) as
    | 0
    | 1
    | 2
    | 3
    | 4;

  // Ensure the selected roast level exists, default to level 0 if not
  const roastsForLevel = roastLevels[roastLevel] || roastLevels[0];

  // Get a random roast from the appropriate level
  const roast = roastsForLevel[Math.floor(Math.random() * roastsForLevel.length)];

  return roast;
}
