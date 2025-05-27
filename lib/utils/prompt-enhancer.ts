// lib/utils/prompt-enhancer.ts

/**
 * Enhances user prompts to generate better images with AI models
 * This utility improves basic prompts by adding more details and structure
 */

export type StyleType = 
  | 'photorealistic' 
  | 'artistic' 
  | 'fantasy' 
  | 'abstract' 
  | 'vintage' 
  | 'minimalist' 
  | 'noir' 
  | 'cyberpunk' 
  | 'anime'
  | 'sketch'
  | 'watercolor'
  | 'oil_painting'
  | 'digital_art'
  | 'cartoon';

export type EnhancementLevel = 'minimal' | 'moderate' | 'maximum';

export interface EnhancementOptions {
  style: StyleType;
  enhancementLevel: EnhancementLevel;
  preserveOriginal: boolean;
  resolution?: string;
  aspectRatio?: string;
  mood?: string;
  lighting?: string;
  perspective?: string;
  colorScheme?: string;
  excludeElements?: string[];
  customEnhancers?: string[];
}

export interface EnhancementResult {
  enhancedPrompt: string;
  originalPrompt: string;
  missingElements: string[];
  addedElements: string[];
  confidence: number; // 0-1 rating of enhancement quality
  suggestedImprovements?: string[];
}

export interface PromptAnalysis {
  hasSubject: boolean;
  hasBackground: boolean;
  hasLighting: boolean;
  hasMood: boolean;
  hasColors: boolean;
  hasComposition: boolean;
  hasStyle: boolean;
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedLength: number;
}

const styleDescriptors: Record<StyleType, string[]> = {
  photorealistic: [
    'ultra detailed photograph', 
    'photorealistic', 
    'high resolution', 
    '8k', 
    'detailed lighting', 
    'professional photography',
    'hyperrealistic',
    'hdr',
    'crystal clear',
    'lifelike detail'
  ],
  artistic: [
    'artistic style', 
    'vibrant colors', 
    'stylized', 
    'creative composition', 
    'digital art', 
    'illustration',
    'expressive brushwork',
    'artistic composition',
    'masterful technique',
    'inspired artwork'
  ],
  fantasy: [
    'magical', 
    'fantasy scene', 
    'ethereal light', 
    'dreamlike quality', 
    'mystical atmosphere', 
    'surreal',
    'enchanted',
    'magical realism',
    'otherworldly',
    'fantastical elements'
  ],
  abstract: [
    'abstract composition',
    'non-representational',
    'dynamic shapes',
    'bold colors',
    'geometric patterns',
    'asymmetrical balance',
    'modern art style',
    'expressive forms',
    'conceptual design',
    'avant-garde'
  ],
  vintage: [
    'vintage style',
    'retro aesthetic',
    'nostalgic colors',
    'film grain',
    'classic composition',
    'aged texture',
    'historical feel',
    'period-accurate details',
    'timeless quality',
    'antique charm'
  ],
  minimalist: [
    'minimalist design',
    'clean lines',
    'simple elements',
    'negative space',
    'limited color palette',
    'understated',
    'elegant simplicity',
    'essential forms only',
    'refined restraint',
    'pure composition'
  ],
  noir: [
    'film noir style',
    'dramatic shadows',
    'high contrast',
    'moody atmosphere',
    'black and white',
    'mysterious ambiance',
    'dramatic lighting',
    'cinematic composition',
    'chiaroscuro',
    'stark contrasts'
  ],
  cyberpunk: [
    'futuristic cyberpunk',
    'neon lights',
    'urban technology',
    'dystopian elements',
    'high-tech low-life',
    'digital interface',
    'sci-fi cityscape',
    'cybernetic aesthetics',
    'holographic displays',
    'chrome and steel'
  ],
  anime: [
    'anime style',
    'distinctive character design',
    'vibrant scene',
    'cel shading',
    'expressive features',
    'manga-inspired',
    'dynamic poses',
    'iconic anime aesthetic',
    'stylized proportions',
    'vivid colors'
  ],
  sketch: [
    'pencil sketch',
    'hand-drawn style',
    'artistic lines',
    'sketch-like quality',
    'graphite texture',
    'loose strokes',
    'conceptual drawing',
    'traditional sketching',
    'artistic rendering',
    'line art'
  ],
  watercolor: [
    'watercolor painting',
    'soft washes',
    'fluid brushstrokes',
    'transparent layers',
    'organic bleeds',
    'artistic spontaneity',
    'delicate textures',
    'flowing colors',
    'painterly quality',
    'wet-on-wet technique'
  ],
  oil_painting: [
    'oil painting style',
    'rich textures',
    'bold brushstrokes',
    'classical technique',
    'impasto effects',
    'masterful blending',
    'traditional artistry',
    'museum quality',
    'painterly excellence',
    'artistic depth'
  ],
  digital_art: [
    'digital artwork',
    'modern creation',
    'pixel-perfect details',
    'digital mastery',
    'contemporary style',
    'computer-generated',
    'digital painting',
    'modern artistic vision',
    'technological artistry',
    'digital excellence'
  ],
  cartoon: [
    'cartoon style',
    'stylized characters',
    'bright colors',
    'exaggerated features',
    'playful design',
    'animated look',
    'whimsical style',
    'character-focused',
    'friendly aesthetic',
    'charming illustration'
  ]
};

const qualityEnhancers = [
  'highly detailed',
  'sharp focus',
  'intricate',
  'professional quality',
  'masterful composition',
  'perfect balance',
  'expert craftsmanship',
  'stunning',
  'breathtaking detail',
  'flawless execution',
  'exceptional quality',
  'award-winning'
];

const lightingEnhancers = [
  'dramatic lighting',
  'soft illumination',
  'golden hour light',
  'volumetric lighting',
  'rim lighting',
  'ambient occlusion',
  'global illumination',
  'beautiful shadows',
  'cinematic lighting',
  'studio lighting',
  'natural lighting',
  'atmospheric lighting'
];

const moodEnhancers = [
  'atmospheric',
  'evocative mood',
  'emotional tone',
  'expressive feeling',
  'captivating ambiance',
  'compelling atmosphere',
  'immersive environment',
  'distinctive mood',
  'powerful emotion',
  'haunting beauty',
  'serene atmosphere',
  'dynamic energy'
];

const compositionEnhancers = [
  'perfect composition',
  'rule of thirds',
  'balanced framing',
  'dynamic perspective',
  'leading lines',
  'symmetrical balance',
  'visual hierarchy',
  'focal point clarity',
  'artistic arrangement',
  'compelling layout'
];

const colorEnhancers = [
  'rich color palette',
  'vibrant hues',
  'harmonious colors',
  'color balance',
  'saturated tones',
  'complementary colors',
  'warm palette',
  'cool tones',
  'monochromatic scheme',
  'bold color choices'
];

/**
 * Analyzes a prompt to understand its current structure and completeness
 */
export function analyzePrompt(prompt: string): PromptAnalysis {
  const lowerPrompt = prompt.toLowerCase();
  
  const hasSubject = /\b(person|man|woman|child|animal|object|building|landscape|portrait|figure)\b/.test(lowerPrompt);
  const hasBackground = /\b(background|scene|setting|environment|landscape|location|backdrop|context)\b/.test(lowerPrompt);
  const hasLighting = /\b(lighting|light|illuminated|shadows|dark|bright|sunlight|moonlight|glow|shine)\b/.test(lowerPrompt);
  const hasMood = /\b(mood|atmosphere|feeling|tone|ambiance|emotion|vibe|energy)\b/.test(lowerPrompt);
  const hasColors = /\b(colou?r|hue|saturation|vibrant|muted|monochrome|palette|red|blue|green|yellow|purple|orange|pink|black|white|gray)\b/.test(lowerPrompt);
  const hasComposition = /\b(angle|perspective|view|shot|close-up|distance|aerial|composition|framing|layout)\b/.test(lowerPrompt);
  const hasStyle = /\b(style|artistic|photorealistic|abstract|vintage|modern|classical|contemporary)\b/.test(lowerPrompt);
  
  const wordCount = prompt.split(/\s+/).length;
  let complexity: 'simple' | 'moderate' | 'complex';
  
  if (wordCount < 5) {
    complexity = 'simple';
  } else if (wordCount < 15) {
    complexity = 'moderate';
  } else {
    complexity = 'complex';
  }
  
  return {
    hasSubject,
    hasBackground,
    hasLighting,
    hasMood,
    hasColors,
    hasComposition,
    hasStyle,
    complexity,
    estimatedLength: prompt.length
  };
}

/**
 * Detects if a prompt is missing key elements and adds suggestions
 */
function detectMissingElements(prompt: string): string[] {
  const analysis = analyzePrompt(prompt);
  const missingElements: string[] = [];
  
  if (!analysis.hasBackground) {
    missingElements.push('setting or background');
  }
  
  if (!analysis.hasLighting) {
    missingElements.push('lighting conditions');
  }
  
  if (!analysis.hasComposition) {
    missingElements.push('perspective or angle');
  }
  
  if (!analysis.hasMood) {
    missingElements.push('mood or atmosphere');
  }
  
  if (!analysis.hasColors) {
    missingElements.push('color palette');
  }
  
  if (analysis.complexity === 'simple') {
    missingElements.push('detail level');
  }
  
  return missingElements;
}

/**
 * Calculates enhancement confidence based on various factors
 */
function calculateEnhancementConfidence(
  originalPrompt: string,
  enhancedPrompt: string,
  missingElements: string[],
  addedElements: string[]
): number {
  let confidence = 0.5; // Base confidence
  
  // Factor in original prompt quality
  const analysis = analyzePrompt(originalPrompt);
  if (analysis.complexity === 'complex') confidence += 0.2;
  if (analysis.complexity === 'moderate') confidence += 0.1;
  
  // Factor in missing elements addressed
  const addressedElements = missingElements.length - (missingElements.length - addedElements.length);
  confidence += (addressedElements / Math.max(missingElements.length, 1)) * 0.2;
  
  // Factor in enhancement length vs original
  const lengthRatio = enhancedPrompt.length / Math.max(originalPrompt.length, 1);
  if (lengthRatio > 1.5 && lengthRatio < 3) confidence += 0.1;
  
  return Math.min(Math.max(confidence, 0), 1);
}

/**
 * Generates improvement suggestions
 */
function generateImprovementSuggestions(
  prompt: string,
  style: StyleType,
  missingElements: string[]
): string[] {
  const suggestions: string[] = [];
  
  if (missingElements.includes('setting or background')) {
    suggestions.push('Consider adding a specific location or background setting');
  }
  
  if (missingElements.includes('lighting conditions')) {
    suggestions.push('Specify lighting conditions (e.g., "golden hour", "dramatic shadows")');
  }
  
  if (missingElements.includes('mood or atmosphere')) {
    suggestions.push('Add emotional tone or atmospheric description');
  }
  
  if (missingElements.includes('color palette')) {
    suggestions.push('Include color preferences or palette description');
  }
  
  if (style === 'photorealistic' && !prompt.toLowerCase().includes('resolution')) {
    suggestions.push('Consider specifying image quality/resolution for photorealistic style');
  }
  
  return suggestions;
}

/**
 * Enhanced version of the prompt enhancement function
 */
export function enhancePrompt(
  originalPrompt: string, 
  options: EnhancementOptions
): EnhancementResult {
  // Clean and validate input
  const cleanPrompt = originalPrompt.trim();
  if (!cleanPrompt) {
    return {
      enhancedPrompt: originalPrompt,
      originalPrompt,
      missingElements: [],
      addedElements: [],
      confidence: 0,
      suggestedImprovements: ['Please provide a prompt to enhance']
    };
  }
  
  // Analyze the original prompt
  const missingElements = detectMissingElements(cleanPrompt);
  
  // Enhanced prompt components
  const enhancedComponents: string[] = [];
  const addedElements: string[] = [];
  
  // Add original prompt if preserving
  if (options.preserveOriginal) {
    enhancedComponents.push(cleanPrompt);
  }
  
  // Get style descriptors
  const styleDescriptorList = styleDescriptors[options.style] || styleDescriptors.photorealistic;
  let selectedStyleDescriptors: string[] = [];
  
  // Select descriptors based on enhancement level
  const descriptorCount = {
    minimal: 2,
    moderate: 4,
    maximum: 6
  }[options.enhancementLevel];
  
  selectedStyleDescriptors = styleDescriptorList.slice(0, descriptorCount);
  
  // Filter out excluded elements
  if (options.excludeElements?.length) {
    selectedStyleDescriptors = selectedStyleDescriptors.filter(desc => 
      !options.excludeElements!.some(exclude => 
        desc.toLowerCase().includes(exclude.toLowerCase())
      )
    );
  }
  
  // Add style descriptors
  if (selectedStyleDescriptors.length > 0) {
    enhancedComponents.push(selectedStyleDescriptors.join(', '));
    addedElements.push('style descriptors');
  }
  
  // Add quality enhancers based on level
  if (options.enhancementLevel !== 'minimal') {
    const qualityCount = options.enhancementLevel === 'moderate' ? 2 : 4;
    const selectedQuality = qualityEnhancers.slice(0, qualityCount);
    enhancedComponents.push(selectedQuality.join(', '));
    addedElements.push('quality enhancers');
  }
  
  // Add specific enhancements based on missing elements
  if (missingElements.includes('lighting conditions') && !options.lighting) {
    const lightingCount = { minimal: 1, moderate: 2, maximum: 3 }[options.enhancementLevel];
    const selectedLighting = lightingEnhancers.slice(0, lightingCount);
    enhancedComponents.push(selectedLighting.join(', '));
    addedElements.push('lighting');
  }
  
  if (missingElements.includes('mood or atmosphere') && !options.mood) {
    const moodCount = { minimal: 1, moderate: 2, maximum: 3 }[options.enhancementLevel];
    const selectedMood = moodEnhancers.slice(0, moodCount);
    enhancedComponents.push(selectedMood.join(', '));
    addedElements.push('mood');
  }
  
  if (missingElements.includes('color palette') && !options.colorScheme) {
    const colorCount = { minimal: 1, moderate: 2, maximum: 3 }[options.enhancementLevel];
    const selectedColors = colorEnhancers.slice(0, colorCount);
    enhancedComponents.push(selectedColors.join(', '));
    addedElements.push('colors');
  }
  
  // Add custom options
  if (options.mood) {
    enhancedComponents.push(options.mood);
    addedElements.push('custom mood');
  }
  
  if (options.lighting) {
    enhancedComponents.push(options.lighting);
    addedElements.push('custom lighting');
  }
  
  if (options.perspective) {
    enhancedComponents.push(options.perspective);
    addedElements.push('perspective');
  }
  
  if (options.colorScheme) {
    enhancedComponents.push(options.colorScheme);
    addedElements.push('color scheme');
  }
  
  // Add technical specifications
  if (options.resolution) {
    enhancedComponents.push(`${options.resolution} resolution`);
    addedElements.push('resolution');
  }
  
  if (options.aspectRatio) {
    enhancedComponents.push(`${options.aspectRatio} aspect ratio`);
    addedElements.push('aspect ratio');
  }
  
  // Add custom enhancers
  if (options.customEnhancers?.length) {
    enhancedComponents.push(...options.customEnhancers);
    addedElements.push('custom enhancers');
  }
  
  // Combine all components
  const enhancedPrompt = enhancedComponents.join(', ');
  
  // Calculate confidence and generate suggestions
  const confidence = calculateEnhancementConfidence(
    originalPrompt,
    enhancedPrompt,
    missingElements,
    addedElements
  );
  
  const suggestedImprovements = generateImprovementSuggestions(
    originalPrompt,
    options.style,
    missingElements
  );
  
  return {
    enhancedPrompt,
    originalPrompt,
    missingElements,
    addedElements,
    confidence,
    suggestedImprovements
  };
}

/**
 * Maps enhancement strength (0.0-1.0) to enhancement level
 */
export function getEnhancementLevel(strength: number): EnhancementLevel {
  if (strength < 0.33) {
    return 'minimal';
  } else if (strength < 0.67) {
    return 'moderate';
  } else {
    return 'maximum';
  }
}

/**
 * Simplified enhancement function with smart defaults
 */
export function generateEnhancedPrompt(
  userPrompt: string,
  style: StyleType = 'photorealistic',
  enhancementStrength: number = 0.5,
  resolution?: string,
  aspectRatio?: string
): EnhancementResult {
  const enhancementLevel = getEnhancementLevel(enhancementStrength);
  
  return enhancePrompt(userPrompt, {
    style,
    enhancementLevel,
    preserveOriginal: true,
    resolution,
    aspectRatio
  });
}

/**
 * Batch enhancement for multiple prompts
 */
export function enhanceMultiplePrompts(
  prompts: string[],
  style: StyleType,
  enhancementLevel: EnhancementLevel = 'moderate'
): EnhancementResult[] {
  return prompts.map(prompt => 
    enhancePrompt(prompt, {
      style,
      enhancementLevel,
      preserveOriginal: true
    })
  );
}

/**
 * Get available styles with descriptions
 */
export function getAvailableStyles(): { style: StyleType; description: string }[] {
  return [
    { style: 'photorealistic', description: 'Realistic photography style with high detail' },
    { style: 'artistic', description: 'Creative artistic interpretation with vibrant colors' },
    { style: 'fantasy', description: 'Magical and ethereal fantasy scenes' },
    { style: 'abstract', description: 'Non-representational modern art style' },
    { style: 'vintage', description: 'Retro and nostalgic aesthetic' },
    { style: 'minimalist', description: 'Clean, simple design with negative space' },
    { style: 'noir', description: 'Dramatic black and white with high contrast' },
    { style: 'cyberpunk', description: 'Futuristic urban technology aesthetic' },
    { style: 'anime', description: 'Japanese animation style with cel shading' },
    { style: 'sketch', description: 'Hand-drawn pencil sketch appearance' },
    { style: 'watercolor', description: 'Soft watercolor painting technique' },
    { style: 'oil_painting', description: 'Traditional oil painting with rich textures' },
    { style: 'digital_art', description: 'Modern digital artwork creation' },
    { style: 'cartoon', description: 'Stylized cartoon illustration' }
  ];
}

/**
 * Generate random enhancement suggestions
 */
export function getRandomEnhancementSuggestions(count: number = 3): string[] {
  const allEnhancers = [
    ...qualityEnhancers,
    ...lightingEnhancers,
    ...moodEnhancers,
    ...compositionEnhancers,
    ...colorEnhancers
  ];
  
  const shuffled = allEnhancers.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
