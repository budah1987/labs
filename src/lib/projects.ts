export interface CaseStudyCard {
  headline: string;
  body: string;
  hoverImage?: string;    // placeholder color or future capture URL
  hoverCaption?: string;
}

export interface HoverListItem {
  title: string;
  body: string;
  mediaType: "video" | "image" | "component";
  mediaSrc?: string;       // URL for video/image, or empty for placeholder
  component?: string;      // component key when mediaType === "component"
}

export interface CaseStudySection {
  type: "text" | "text-image" | "full-image" | "two-column" | "quote" | "cta" | "interactive" | "card-grid" | "hover-list";
  header: string;
  subheader?: string;
  body: string;
  image?: string; // placeholder color or future URL
  imageCaption?: string;
  quote?: string;
  ctaLabel?: string;
  ctaHref?: string;
  component?: string;
  video?: string;      // path to .mp4/.webm clip
  lightbox?: boolean;  // show zoom icon, enable lightbox on click
  cards?: CaseStudyCard[];   // for card-grid sections
  columns?: number;          // grid columns (defaults to 3)
  items?: HoverListItem[];   // for hover-list sections
}

export interface CaseStudyContent {
  year: string;
  duration: string;
  role?: string;
  sections: CaseStudySection[];
}

export interface Project {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
  status: "live" | "wip" | "concept";
  thumbnailColor: string;
  preview?: string;
  heroVideo?: string;
  content?: CaseStudyContent;
}

export const projects: Project[] = [
  {
    id: "claude-bookmarks",
    number: "01",
    title: "Claude Bookmarks",
    description:
      "Redesigning how AI chat remembers what matters.",
    tags: ["AI", "Product Design", "Design Systems"],
    status: "wip",
    thumbnailColor: "#1a1a2a",
    heroVideo: "/videos/bookmarking.mp4",
    content: {
      year: "2026",
      duration: "2 Weeks",
      role: "Design Engineer",
      sections: [
        // 1 — Problem Statement
        {
          type: "text-image",
          header: "The more you use Claude, the harder it gets to find anything.",
          body: "Code reviews, writing drafts, architectural decisions, debugging sessions. The work lives in the conversations. But after 50 sessions, finding a specific response means remembering what you said, scrolling through threads, Cmd+F-ing your way back to something you half-remember. Memory becomes the search engine. That's the problem.",
          image: "/images/my-claude-dashboard.png",
          imageCaption:
            "Every conversation I've ever had with Claude. Good luck finding anything.",
          lightbox: true,
        },
        // 3 — Results (vertical hover list)
        {
          type: "hover-list",
          header: "Results",
          body: "",
          items: [
            {
              title: "4 Card Variants",
              body: "Every response type Claude generates has a corresponding bookmark format. Plain text, code blocks, multi-option responses, and written drafts. No generic save. Every card is content-aware.",
              mediaType: "component",
              component: "bookmark-card-gallery",
            },
            {
              title: "Full Token Parity",
              body: "Reverse-engineered Anthropic's design system from their community Figma kit. Every color, radius, font, and shadow mapped to CSS custom properties. The components look like Claude because they're built with Claude's system.",
              mediaType: "component",
              component: "claude-token-annotation",
            },
            {
              title: "Custom Design Pipeline",
              body: "Built a bidirectional connection between Claude Code and Figma. Generate, refine, implement. Design judgment applied at every step, not just at the end.",
              mediaType: "video",
              mediaSrc: "/videos/figma-connect.mp4",
            },
            {
              title: "1 Pivot, 2 Weeks",
              body: "Built and tested V1 in 6 days. Killed it after user testing revealed the wrong abstraction level. V2 shipped from a framework exercise, not a gut feeling.",
              mediaType: "component",
              component: "pivot-timeline",
            },
          ],
        },
        // 4 — Opportunity
        {
          type: "text",
          header: "Opportunity",
          body: "Casual users don't feel this. People using Claude as a search replacement have no retrieval problem. The pain belongs to daily users: developers, designers, writers, researchers. The more valuable your usage, the worse the problem gets. That's a retention issue disguised as a UX complaint.\n\nUsers weren't waiting for Anthropic to fix this. They built Chrome extensions, exported to Notion, prefixed conversation titles with emoji tags. 100,000 people installed a browser extension to add folders to Claude. That's not a feature request. That's demand.\n\nChatGPT, Gemini, Perplexity, Claude. None had solved retrieval at the response level. Search improvements helped at the conversation level but missed the real problem: the valuable thing wasn't the conversation. It was the specific output inside it.",
        },
        // 5 — Challenges (3 cards, no hover)
        {
          type: "card-grid",
          header: "Challenges",
          body: "",
          columns: 3,
          cards: [
            {
              headline: "Existing Structure Already Existed",
              body: "Claude has Projects. It has pinning. It has search. Any solution that felt like a redundant layer would be dismissed immediately. V1 proved this.",
            },
            {
              headline: "Organization Requires Zero Discipline",
              body: "Any solution that asked users to categorize or label their conversations added friction at the wrong moment: mid-thought, mid-session. The bar was zero upfront effort from the user.",
            },
            {
              headline: "Context Collapse",
              body: "A saved response without its question is often useless. The solution had to preserve the Q+A pair as the unit of value, not just the answer in isolation.",
            },
          ],
        },
        // 6 — Discovery
        {
          type: "text",
          header: "Discovery",
          body: "I started where the frustration was loudest. Reddit threads, GitHub issues, Chrome Web Store reviews. The complaint pattern was consistent across platforms and user types: people weren't losing conversations, they were losing specific moments inside them.\n\nThe insight that reframed everything: users weren't asking for better organization. They were asking for a way to hold onto something before it got buried.\n\nThat's a different problem. And it needed a different solution.",
        },
        // 7 — V1: Built Fast, Failed Correctly
        {
          type: "full-image",
          header: "V1: Built Fast, Failed Correctly",
          video: "/videos/bookmarks-v1.mp4",
          imageCaption: "It worked. Nobody wanted to use it.",
          body: "Four days. A topic-based dashboard with auto-categorization, Cmd+K search, pinned conversations, color-coded labels. Deployed on Vercel. A working prototype that looked right and felt polished.\n\nI tested it across a weekend with 8 people: my wife, close friends, designers, daily AI users, and people who use Claude as a Google replacement.\n\nThe feedback was fast and consistent.\n\n\"What are topics?\"\n\"How is this different from Projects?\"\n\"Do I need to manage this myself?\"\n\"I could just pin it.\"\n\nNobody questioned the execution. They questioned the premise. V1 asked users to organize their conversations mid-session, allocating chats into categories while still thinking. That's homework disguised as a feature.\n\nThe prototype looked good. The approach was wrong. Those are different problems, and confusing them is how designers waste months polishing the wrong thing.",
        },
        // 8 — The Turn (text)
        {
          type: "text",
          header: "The Turn",
          body: "I didn't iterate on V1. I went back to the problem.\n\nUsing Teresa Torres's Opportunity Solution Tree, the 5 Whys, and Occam's Razor, I mapped the actual failure mode. The 5 Whys surfaced it cleanly: users weren't struggling to organize conversations. They were struggling to retrieve a specific response from inside one.\n\nThe conversation was never the unit of value. The output was.\n\nPeople open Claude to get an answer. The conversation is just the path to it. Organizing paths doesn't help you find the destination.\n\nV1 was an exercise in learning the tool. V2 was putting it to work.",
        },
        // 9 — The Turn (artifact)
        {
          type: "interactive",
          header: "",
          body: "",
          component: "opportunity-tree",
          imageCaption:
            "Three frameworks. One direction. Click through to see how the thinking developed.",
        },
        // 10 — V2: Save the Answer
        {
          type: "full-image",
          header: "V2: Save the Answer. Not the Conversation.",
          subheader: "One click saves a Q+A pair",
          video: "/videos/bookmark-v2-multioption.mp4",
          imageCaption: "One click. The response is yours.",
          body: "The question stays for context. The answer is what you came back for.\n\nFive card variants handle every response type Claude generates. Each one maps to a real retrieval scenario. Getting back to a code fix is different from getting back to a drafted email. The card should reflect that.\n\nStandard Text — Prose responses. Clean, expandable, originating prompt preserved above.\n\nCode Block — Collapsed by default with line count, syntax highlighting, one-click copy. Expands inline.\n\nMulti-Option — When Claude gives you three approaches, select the ones that were relevant. The rest fade but stay visible.\n\nDraft / Message — Written deliverables with prominent copy button. Claude's framing note stays beneath.\n\nSingle Option from Multi — One approach saved from a longer exchange. Shows \"Option B of 3\" so context isn't lost.",
        },
        // 11 — The Craft
        {
          type: "text",
          header: "The Craft: Achieving Parity With Claude's Design System",
          body: "I reverse-engineered Anthropic's design tokens from their community Figma UI kit. Every color, radius, font weight, and shadow mapped to CSS custom properties. Full dark and light mode coverage.\n\nBut token extraction was the floor, not the ceiling.\n\nI built a custom bidirectional pipeline connecting Claude Code to Figma. Claude generated the initial bookmark card components using the token system. I pulled them into Figma for design refinement, then pushed the corrected versions back for implementation.\n\nClaude reproduced the tokens accurately. It couldn't make decisions about content hierarchy. The first pass flattened the prompt, options, and metadata to equal visual weight. No reading order. No information architecture. Just correct colors in the wrong relationship to each other.\n\nThe fix: restore the prompt as a distinct UI element, separate option labels from option titles as functionally different elements, and give the unselected state a deliberate faded treatment rather than an ambiguous one.\n\nThe components look like Claude because they're built with Claude's system, passed through design judgment the tool doesn't have.",
        },
        // 13 — Key Takeaways (3 cards, no hover)
        {
          type: "card-grid",
          header: "Key Takeaways",
          body: "",
          columns: 3,
          cards: [
            {
              headline: "AI amplifies your fundamentals. If you don't have them, it amplifies nothing.",
              body: "V1 was built fast because the tool made fast feel productive. The problem wasn't execution speed. It was skipping the thinking that should come before it. Frameworks aren't overhead. They're the reason V2 exists.",
            },
            {
              headline: "The failure mode of AI-assisted design is shipping the first output.",
              body: "Claude got the tokens right. It got the hierarchy wrong. Knowing the difference, and having the Figma fluency to correct it, is what separates a design engineer from someone who prompts.",
            },
            {
              headline: "The unit of value matters more than the container.",
              body: "Organizing conversations is solving for the wrong thing. The conversation is infrastructure. The response is the product. Design for what people actually come back for.",
            },
          ],
        },
        // 14 — What's Next
        {
          type: "text",
          header: "What's Next",
          body: "The core interaction is proven. What isn't tested is scale. 50+ bookmarks, sorting, filtering, search within saved responses. Edge cases where a response only makes sense with more surrounding context.\n\nThe most direct path to real users is a Chrome extension. If that's something you'd want to use or collaborate on, let's talk.",
        },
        // 15 — CTA
        {
          type: "cta",
          header: "",
          body: "Interested in using or collaborating on this?",
          ctaLabel: "Get in touch →",
          ctaHref: "https://amirhussain.xyz",
        },
      ],
    },
  },
  {
    id: "generative-ui",
    number: "02",
    title: "Generative UI",
    description:
      "Runtime interface generation from natural language prompts. Components materialize from conversation, adapting layout and style to context.",
    tags: ["AI", "UI", "LLM"],
    status: "concept",
    thumbnailColor: "#0a1a2a",
    content: {
      year: "2025",
      duration: "2 weeks",
      sections: [
        {
          type: "text",
          header: "Concept",
          body: "What if interfaces didn't need to be designed ahead of time? Generative UI explores runtime component creation from conversation. You describe what you need, and the system materializes a working interface — layout, styling, interactions, and data bindings included.",
        },
        {
          type: "full-image",
          header: "",
          body: "",
          image: "#0a2a4a",
          imageCaption: "Prompt-to-interface pipeline — structured component trees from natural language",
        },
        {
          type: "text",
          header: "Technical Architecture",
          body: "The system uses a fine-tuned model that outputs structured component trees rather than raw HTML. Each node in the tree maps to a React component with typed props. A constraint solver handles layout, ensuring components respect spacing rules, alignment grids, and responsive breakpoints without explicit instructions.",
        },
        {
          type: "text-image",
          header: "Prototype",
          subheader: "From prompt to interface in real time",
          body: "The working prototype accepts natural language input and renders a live preview within 2-3 seconds. Components are fully interactive — buttons trigger actions, forms validate input, lists paginate. The quality varies with prompt specificity, but the baseline is surprisingly usable for internal tools and rapid prototyping.",
          image: "#2a4a6a",
        },
      ],
    },
  },
  {
    id: "motion-lab",
    number: "03",
    title: "Motion Lab",
    description:
      "A playground for physics-based animations and gesture-driven interactions. Spring dynamics, inertia scrolling, and fluid transitions.",
    tags: ["Animation", "Framer Motion", "Gestures"],
    status: "wip",
    thumbnailColor: "#1a0a2a",
    content: {
      year: "2025",
      duration: "Ongoing",
      sections: [
        {
          type: "text",
          header: "Motivation",
          body: "Most web animations feel mechanical — linear easing, fixed durations, no response to user input. Motion Lab is a sandbox for exploring physics-based animation: spring dynamics that respond to velocity, inertia scrolling that decays naturally, and fluid transitions that adapt to gesture speed and direction.",
        },
        {
          type: "full-image",
          header: "",
          body: "",
          image: "#1a0a2a",
          imageCaption: "Spring dynamics playground — drag, release, observe",
        },
        {
          type: "text",
          header: "Experiments",
          body: "The lab contains a growing collection of interactive demos. Draggable cards with momentum and boundary bouncing. Scroll containers with rubberband physics. Page transitions that inherit the direction and speed of the triggering gesture. Each experiment isolates a single principle and pushes it to its expressive limit.",
        },
        {
          type: "text-image",
          header: "Spring System",
          subheader: "Configurable physics for every interaction",
          body: "The core of the lab is a custom spring system that parameterizes stiffness, damping, and mass. Every animation in the system derives from these three values, creating a consistent physical feel across all interactions. The configuration panel lets you tune springs in real time and see the effect on motion curves.",
          image: "#4a2a6a",
        },
      ],
    },
  },
  {
    id: "token-engine",
    number: "04",
    title: "Token Engine",
    description:
      "Automated design token pipeline that syncs Figma variables to code. Handles color, typography, spacing, and semantic aliases.",
    tags: ["Design Tokens", "Figma", "Automation"],
    status: "live",
    thumbnailColor: "#0a2a1a",
  },
  {
    id: "spatial-canvas",
    number: "05",
    title: "Spatial Canvas",
    description:
      "An infinite canvas interface for spatial computing. Nodes, edges, and freeform layout with multiplayer cursors.",
    tags: ["Canvas", "WebGL", "Collaboration"],
    status: "concept",
    thumbnailColor: "#2a0a0a",
  },
  {
    id: "voice-interface",
    number: "06",
    title: "Voice Interface",
    description:
      "Hands-free development environment controlled by voice commands. Integrates speech recognition with code generation and navigation.",
    tags: ["Voice", "Accessibility", "AI"],
    status: "concept",
    thumbnailColor: "#1a1a0a",
  },
  {
    id: "component-forge",
    number: "07",
    title: "Component Forge",
    description:
      "Visual component builder that outputs production-ready React code. Drag-and-drop composition with real-time code preview.",
    tags: ["React", "Visual Builder", "Code Gen"],
    status: "wip",
    thumbnailColor: "#0a0a2a",
  },
  {
    id: "dark-patterns",
    number: "08",
    title: "Dark Patterns",
    description:
      "Research project cataloging and analyzing deceptive UX patterns. Interactive examples with ethical alternatives.",
    tags: ["UX Research", "Ethics", "Education"],
    status: "live",
    thumbnailColor: "#1a0a1a",
  },
];
