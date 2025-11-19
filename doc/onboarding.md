This guide maps the complete user experience from discovering and downloading Breathe through completing onboarding and experiencing their first core features.

1. Discovery & Download (Play Store)
Play Store Listing Elements

App Icon: Simple, calming eye graphic with subtle cyan glow
Title: "Breathe - Digital Wellbeing Companion"
Tagline: "Stop doomscrolling. Build focus. Breathe."

Screenshots Sequence (5 screenshots)

Companion Character: Large eye in calm state with text "Meet your wellbeing companion"
Snooze Feature: Timeline showing snoozed Instagram with "See you tonight at 8 PM"
Focus Session: Active timer with "25:00" and focused companion eye
Doomscroll Intervention: Overlay showing "You've been scrolling for 15 minutes. Take a breath."
Weekly Insights: Beautiful mood chart with "Your best focus week yet"

App Description Key Points

All data stays on your device - complete privacy
No judgement, just gentle guidance
Science-backed interventions
Works alongside your life, not against it

Call-to-Action
"Download free and take your first mindful breath"

2. First App Launch
Splash Screen (2-3 seconds)

Visual: Breathe logo with animated breathing effect
Background: Deep blue-black (#0A0E1A)
Animation: Logo gently scales 1.0 → 1.05 → 1.0 (breathing motion)
No loading text - keep it clean and zen

Load Actions Behind Splash

Initialize AsyncStorage
Set up Zustand store
Load default settings
Prepare companion character
Check system permissions status


3. Onboarding Flow
Screen 1: Welcome & Introduction
Layout:

Large animated companion eye (calm state, slow breathing)
Heading: "Welcome to Breathe"
Body text: "I'm your digital wellbeing companion. I'll help you build healthier phone habits - one breath at a time."
Subtext: "This takes just 2 minutes"

Interaction:

Primary button: "Let's Begin" (cyan, full-width)
Skip link at bottom: "Skip for now" (subtle, small text)

Animation:

Companion fades in with gentle breath
Text appears with 200ms stagger
Button slides up from bottom


Screen 2: Understanding You
Layout:

Companion eye in center (slightly smaller)
Heading: "What brings you here?"
Subheading: "Select all that apply (or skip)"

Options (Multi-select cards):

🌀 "I doomscroll too much"
⏰ "I can't stay focused"
📱 "I'm always checking my phone"
🌙 "Late night scrolling affects my sleep"
💭 "I want to be more intentional"
✨ "Just exploring"

Interaction:

Cards are tappable with subtle haptic feedback
Selected state: cyan border + filled background
Cards have icons (emojis) + text
Companion pupils follow tap location subtly

Navigation:

Primary: "Continue" (enabled always)
Back arrow top-left

Data Storage:

Save selections to user settings
Used to personalize future insights


Screen 3: Core Feature - Snoozing
Layout:

Companion showing calm state
Large icon: 📅 (or calendar graphic)
Heading: "Snooze Distractions"
Body: "Instagram at 2 PM? Snooze it until 8 PM tonight. I'll keep it safe and bring it back when you're ready."

Example Card (Visual demonstration):
┌─────────────────────────────┐
│ 📷 Instagram                │
│ Returns: Today at 8:00 PM   │
│ "Want evening relaxation    │
│  not afternoon distraction" │
└─────────────────────────────┘
Interaction:

Animated example showing app being snoozed
Example card slides in from right
Countdown timer ticks subtly
Primary: "Got it" (cyan button)
Secondary: "Show me how" (outline button - triggers quick demo)


Screen 4: Core Feature - Focus Sessions
Layout:

Companion in focused state (cyan, centered pupils)
Large icon: 🎯 (or target graphic)
Heading: "Focus Sessions"
Body: "25 minutes of distraction-free work. I'll block tempting apps and stay with you the whole time."

Visual Demo:

Circular timer preview showing 25:00
Small companion eye inside timer
Blocked apps shown as chips below

Benefits List:

✓ Block distracting apps automatically
✓ Track your focus streaks
✓ See how much you accomplish

Interaction:

Primary: "Sounds good"
Back arrow


Screen 5: Core Feature - Doomscroll Detection
Layout:

Companion in warning state (orange glow, alert pupils)
Icon: 🌀
Heading: "Gentle Interventions"
Body: "Scrolling for 12+ minutes? I'll gently check in and invite you to take a breath. No judgement, just awareness."

Example Intervention (Dimmed preview):
┌─────────────────────────────┐
│    [Companion - Warning]    │
│                             │
│  You've been scrolling      │
│  Instagram for 15 minutes   │
│                             │
│      [Breathing circle]     │
│                             │
│  Take 3 breaths with me     │
│                             │
│  [Take a 30min break]      │
│  [5 more minutes]          │
└─────────────────────────────┘
Key Point:

"You're always in control - choose to pause or continue"

Interaction:

Primary: "I like this"
Link: "Can I customize this?" (opens settings preview)


Screen 6: Permissions Explanation
Layout:

Companion in calm state
Heading: "Two Quick Permissions"
Subheading: "To make Breathe work its magic"

Permission Cards (2 cards):
Card 1: Notifications

Icon: 🔔
Title: "Notifications"
Purpose: "Remind you when snoozed items return"
Privacy: "No tracking, just timely nudges"
Status: [Request Permission Button]

Card 2: Exact Alarms

Icon: ⏰
Title: "Exact Timing"
Purpose: "Precisely schedule focus sessions"
Privacy: "Required for Android 12+"
Status: [Request Permission Button]

Bottom Note:

Small text: "🔒 All data stays on your device. No cloud, no tracking."

Interaction:

Each card has "Allow" button
Tap triggers system permission dialog
Can skip both and enable later
Primary: "Continue" (enabled regardless)


Screen 7: Companion Introduction
Layout:

Large companion eye (75% screen height)
Breathing animation active and prominent
Heading: "Meet Your Companion"
Body: "I'll change based on how you're doing. My mood reflects your digital wellbeing."

Mood Examples (Horizontal scroll):
[Calm] 😌    [Focused] 🎯    [Tired] 😴    [Proud] ✨
Green        Cyan          Yellow       Purple
Tap each mood to see:

Color change
Pupil position shift
Glow effect
Brief description

Key Message:

"I'm here to guide, not judge. We're in this together."

Interaction:

Primary: "Nice to meet you"
Companion responds with subtle animation (slight bounce)


Screen 8: Optional - Faith-Based Mode
Layout:

Companion calm
Heading: "Faith & Wellbeing"
Body: "Want biblical encouragement alongside digital wisdom?"

Examples:

"Be still and know..." - When starting focus
"Guard your heart..." - During interventions
"Do not be anxious..." - In weekly insights

Toggle:

Large switch: "Enable Faith-Based Encouragement"
Default: OFF
No pressure messaging

Interaction:

Primary: "Continue"
Toggle saves to settings
No judgement either way


Screen 9: Onboarding Complete
Layout:

Companion in proud state (purple, sparkles)
Heading: "You're All Set! 🎉"
Body: "Ready to build healthier phone habits? Let's start with something small."

First Action Options (3 cards):
Option 1: Quick Focus

Icon: 🎯
Title: "Start 5-Minute Focus"
Description: "Try a quick session"
Button: "Focus Now"

Option 2: Snooze Something

Icon: 📅
Title: "Snooze Your First App"
Description: "Practice intentional waiting"
Button: "Snooze Now"

Option 3: Just Browse

Icon: 👀
Title: "Look Around First"
Description: "Explore at your own pace"
Button: "Enter App"

Interaction:

Each card fully tappable
Tapping takes to that feature
"Enter App" goes to home screen.