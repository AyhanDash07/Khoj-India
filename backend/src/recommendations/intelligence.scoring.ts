import type {
  IntelligenceInput,
  IntelligenceResult,
  PersonalFitBreakdown,
  MatchResult,
  IntelligenceConfidence,
} from './intelligence.types.js'

const PERSONAL_WEIGHTS = {
  interests: 30,
  travel_style: 20,
  budget: 15,
  duration: 10,
  crowd: 10,
  region: 10,
  food: 5,
}

const OVERALL_WEIGHTS = {
  personal_fit: 50,
  impact: 20,
  safety: 10,
  pressure: 10,
  accessibility: 10,
}

function normalizeScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function calculateIntelligenceConfidence(
  input: IntelligenceInput,
  breakdown: PersonalFitBreakdown,
): IntelligenceConfidence {
  const dimensions = [
    {
      name: 'Interests',
      available: breakdown.interests !== null,
    },
    {
      name: 'Travel style',
      available: breakdown.travel_style !== null,
    },
    {
      name: 'Budget',
      available: breakdown.budget !== null,
    },
    {
      name: 'Trip duration',
      available: breakdown.duration !== null,
    },
    {
      name: 'Crowd balance',
      available: breakdown.crowd !== null,
    },
    {
      name: 'Region',
      available: breakdown.region !== null,
    },
    {
      name: 'Food',
      available: breakdown.food !== null,
    },
    {
      name: 'Positive impact',
      available: input.intelligence.impact.score !== null,
    },
    {
      name: 'Safety',
      available: input.intelligence.safety.level !== null,
    },
    {
      name: 'Accessibility',
      available:
        input.intelligence.accessibility.wheelchair_accessible !== null ||
        input.intelligence.accessibility.accessible_transport !== null ||
        input.intelligence.accessibility.accessible_accommodation !== null ||
        input.intelligence.accessibility.accessible_restrooms !== null,
    },
    {
      name: 'Visitor pressure',
      available: input.intelligence.pressure.score !== null,
    },
  ]

  const availableDimensions = dimensions.filter(
    (dimension) => dimension.available,
  ).length

  const totalDimensions = dimensions.length

  const missingDimensions = dimensions
    .filter((dimension) => !dimension.available)
    .map((dimension) => dimension.name)

  const score = normalizeScore(
    (availableDimensions / totalDimensions) * 100,
  )

  let level: IntelligenceConfidence['level']

  if (score >= 75) {
    level = 'high'
  } else if (score >= 50) {
    level = 'moderate'
  } else {
    level = 'limited'
  }

  return {
    score,
    level,
    available_dimensions: availableDimensions,
    total_dimensions: totalDimensions,
    missing_dimensions: missingDimensions,
  }
}

function calculateArrayMatch(
  preferences: string[],
  destinationValues: string[],
): number {
  if (preferences.length === 0) {
    return 50
  }

  if (destinationValues.length === 0) {
    return 50
  }

  const normalizedPreferences = preferences.map((value) =>
    value.toLowerCase().trim(),
  )

  const normalizedDestinationValues = destinationValues.map((value) =>
    value.toLowerCase().trim(),
  )

  const matches = normalizedPreferences.filter((preference) =>
    normalizedDestinationValues.some(
      (destinationValue) =>
        destinationValue.includes(preference) ||
        preference.includes(destinationValue),
    ),
  )

  return normalizeScore(
    (matches.length / normalizedPreferences.length) * 100,
  )
}

function calculateSemanticArrayMatch(
  preferences: string[],
  destinationValues: string[],
): MatchResult {
  if (preferences.length === 0) {
    return {
      score: null,
      status: 'unknown',
      reason: 'No traveller preference provided.',
    }
  }

  if (destinationValues.length === 0) {
    return {
      score: null,
      status: 'unknown',
      reason: 'No destination data available.',
    }
  }

  const aliases: Record<string, string[]> = {
    'slow & relaxed': ['slow travel'],
    'slow and relaxed': ['slow travel'],

    'cultural immersion': ['culture', 'heritage', 'slow travel'],
    'cultural experience': ['culture', 'heritage', 'slow travel'],
    'culture & heritage': ['culture', 'heritage'],
    'culture and heritage': ['culture', 'heritage'],

    'off the beaten path': ['hidden gem'],
    offbeat: ['hidden gem'],

    nature: ['nature'],
    culture: ['culture', 'heritage'],
    heritage: ['heritage', 'culture'],
    adventure: ['adventure'],
    photography: ['photography'],

    food: ['food'],
    'local food': ['food'],
    'fine dining': ['food'],

    family: ['family friendly'],
    solo: ['solo friendly'],
  }

  const normalizedDestinationValues = destinationValues.map(
    (value) => value.toLowerCase().trim(),
  )

  const matches = preferences.filter((preference) => {
    const normalizedPreference = preference.toLowerCase().trim()

    if (
      normalizedDestinationValues.some(
        (destinationValue) =>
          destinationValue.includes(normalizedPreference) ||
          normalizedPreference.includes(destinationValue),
      )
    ) {
      return true
    }

    const semanticMatches = aliases[normalizedPreference] ?? []

    return semanticMatches.some((alias) =>
      normalizedDestinationValues.some(
        (destinationValue) =>
          destinationValue.includes(alias) ||
          alias.includes(destinationValue),
      ),
    )
  })

  const score = normalizeScore(
    (matches.length / preferences.length) * 100,
  )

  if (score === 100) {
    return {
      score,
      status: 'matched',
      reason: 'Strong match with destination attributes.',
    }
  }

  if (score > 0) {
    return {
      score,
      status: 'partial',
      reason: 'Some destination attributes match the traveller preference.',
    }
  }

  return {
    score: 0,
    status: 'mismatched',
    reason: 'Destination attributes do not match the traveller preference.',
  }
}

function calculateRegionalMatch(
  preferredRegions: string[],
  destinationState: string | null,
): MatchResult {
  if (preferredRegions.length === 0) {
    return {
      score: null,
      status: 'unknown',
      reason: 'No regional preference provided.',
    }
  }

  if (!destinationState) {
    return {
      score: null,
      status: 'unknown',
      reason: 'Destination state data is unavailable.',
    }
  }

  const normalizedDestinationState = destinationState
    .toLowerCase()
    .trim()

  const matched = preferredRegions.some(
    (region) =>
      region.toLowerCase().trim() === normalizedDestinationState,
  )

  if (matched) {
    return {
      score: 100,
      status: 'matched',
      reason: 'Destination is in one of your preferred regions.',
    }
  }

  return {
    score: 0,
    status: 'mismatched',
    reason: `Destination is in ${destinationState}, outside your preferred regions.`,
  }
}

function calculateBudgetScore(
  travellerBudget: number | null,
  destinationBudget: number | null,
): number | null {
  if (travellerBudget === null || destinationBudget === null) {
    return null
  }

  if (travellerBudget <= 0) {
    return null
  }

  if (destinationBudget <= travellerBudget) {
    return 100
  }

  const difference =
    (destinationBudget - travellerBudget) / travellerBudget

  if (difference <= 0.1) {
    return 85
  }

  if (difference <= 0.25) {
    return 70
  }

  if (difference <= 0.5) {
    return 45
  }

  return 20
}

function calculateDurationScore(
  preferredDays: number | null,
  recommendedDays: number | null,
): number | null {
  if (preferredDays === null || recommendedDays === null) {
    return null
  }

  if (preferredDays <= 0 || recommendedDays <= 0) {
    return null
  }

  const difference = Math.abs(preferredDays - recommendedDays)

  if (difference === 0) {
    return 100
  }

  if (difference <= 1) {
    return 90
  }

  if (difference <= 2) {
    return 75
  }

  if (difference <= 4) {
    return 55
  }

  return 30
}

function calculateCrowdScore(
  preference: string | null,
  pressureLevel: string | null,
  pressureScore: number | null,
): number | null {
  if (!preference || pressureScore === null) {
    return null
  }

  const normalizedPreference = preference.toLowerCase()
  const normalizedPressure = pressureLevel?.toLowerCase() ?? ''

  if (
    normalizedPreference.includes('low') ||
    normalizedPreference.includes('quiet') ||
    normalizedPreference.includes('peace')
  ) {
    if (pressureScore <= 30) {
      return 100
    }

    if (pressureScore <= 50) {
      return 80
    }

    if (pressureScore <= 70) {
      return 50
    }

    return 25
  }

  if (
    normalizedPreference.includes('high') ||
    normalizedPreference.includes('lively') ||
    normalizedPreference.includes('crowd')
  ) {
    if (pressureScore >= 70) {
      return 100
    }

    if (pressureScore >= 50) {
      return 80
    }

    if (pressureScore >= 30) {
      return 60
    }

    return 40
  }

  if (
    normalizedPressure.includes('low') &&
    normalizedPreference.includes('moderate')
  ) {
    return 80
  }

  if (
    normalizedPressure.includes('moderate') &&
    normalizedPreference.includes('moderate')
  ) {
    return 100
  }

  if (
    normalizedPressure.includes('high') &&
    normalizedPreference.includes('moderate')
  ) {
    return 60
  }

  return 70
}

function calculateSafetyScore(
  safetyLevel: string | null,
): number | null {
  if (!safetyLevel) {
    return null
  }

  const level = safetyLevel.toLowerCase()

  if (
    level.includes('excellent') ||
    level.includes('very safe')
  ) {
    return 100
  }

  if (level.includes('safe') || level === 'high') {
    return 90
  }

  if (level.includes('moderate')) {
    return 70
  }

  if (
    level.includes('caution') ||
    level.includes('low')
  ) {
    return 45
  }

  if (
    level.includes('unsafe') ||
    level.includes('high risk') ||
    level.includes('danger')
  ) {
    return 20
  }

  return null
}

function calculateAccessibilityScore(
  needs: string[],
  accessibility: IntelligenceInput['intelligence']['accessibility'],
): number | null {
  if (needs.length === 0) {
    return 100
  }

  const availableFeatures = [
    accessibility.wheelchair_accessible,
    accessibility.accessible_transport,
    accessibility.accessible_accommodation,
    accessibility.accessible_restrooms,
  ]

  const requestedCount = needs.length

  const supportedCount = needs.filter((need) => {
    const normalized = need.toLowerCase()

    if (normalized.includes('wheelchair')) {
      return accessibility.wheelchair_accessible === true
    }

    if (normalized.includes('transport')) {
      return accessibility.accessible_transport === true
    }

    if (
      normalized.includes('accommodation') ||
      normalized.includes('hotel')
    ) {
      return accessibility.accessible_accommodation === true
    }

    if (
      normalized.includes('restroom') ||
      normalized.includes('toilet')
    ) {
      return accessibility.accessible_restrooms === true
    }

    return availableFeatures.some(
      (feature) => feature === true,
    )
  }).length

  return normalizeScore(
    (supportedCount / requestedCount) * 100,
  )
}

function calculateImpactScore(
  impactScore: number | null,
): number | null {
  if (impactScore === null) {
    return null
  }

  return normalizeScore(impactScore)
}

function calculatePressureScore(
  pressureScore: number | null,
): number | null {
  if (pressureScore === null) {
    return null
  }

  return normalizeScore(100 - pressureScore)
}

function calculatePersonalFit(
  breakdown: PersonalFitBreakdown,
): number {
  const personalFactors = [
    {
      score: breakdown.interests,
      weight: PERSONAL_WEIGHTS.interests,
    },
    {
      score: breakdown.travel_style,
      weight: PERSONAL_WEIGHTS.travel_style,
    },
    {
      score: breakdown.budget,
      weight: PERSONAL_WEIGHTS.budget,
    },
    {
      score: breakdown.duration,
      weight: PERSONAL_WEIGHTS.duration,
    },
    {
      score: breakdown.crowd,
      weight: PERSONAL_WEIGHTS.crowd,
    },
    {
      score: breakdown.region,
      weight: PERSONAL_WEIGHTS.region,
    },
    {
      score: breakdown.food,
      weight: PERSONAL_WEIGHTS.food,
    },
  ].filter(
    (
      factor,
    ): factor is {
      score: number
      weight: number
    } => factor.score !== null,
  )

  const totalPersonalWeight = personalFactors.reduce(
    (total, factor) => total + factor.weight,
    0,
  )

  if (totalPersonalWeight === 0) {
    return 0
  }

  const weightedScore = personalFactors.reduce(
    (total, factor) =>
      total + factor.score * factor.weight,
    0,
  )

  return normalizeScore(
    weightedScore / totalPersonalWeight,
  )
}

function buildReasons(
  breakdown: PersonalFitBreakdown,
  input: IntelligenceInput,
): string[] {
  const reasons: string[] = []

  if (
    breakdown.budget !== null &&
    breakdown.budget >= 80
  ) {
    reasons.push(
      'The estimated daily cost fits comfortably within your budget.',
    )
  }

  if (
    breakdown.crowd !== null &&
    breakdown.crowd >= 80
  ) {
    reasons.push(
      'The destination has a visitor-pressure profile that suits your crowd preference.',
    )
  }

  if (
    breakdown.interests !== null &&
    breakdown.interests >= 80
  ) {
    reasons.push(
      'The destination strongly matches your interests.',
    )
  }

  if (
    breakdown.travel_style !== null &&
    breakdown.travel_style >= 80
  ) {
    reasons.push(
      'The destination strongly matches your preferred travel style.',
    )
  }

  if (
    breakdown.region !== null &&
    breakdown.region >= 80
  ) {
    reasons.push(
      'The destination matches one of your preferred regions.',
    )
  }

  if (
    breakdown.food !== null &&
    breakdown.food >= 80
  ) {
    reasons.push(
      'The destination has food characteristics that align with your preferences.',
    )
  }

  if (
    input.intelligence.impact.score !== null &&
    input.intelligence.impact.score >= 75
  ) {
    reasons.push(
      'The destination shows strong positive local or environmental impact signals.',
    )
  }

  if (
    input.traveller.accessibility_needs.length > 0 &&
    input.intelligence.accessibility.wheelchair_accessible === true
  ) {
    reasons.push(
      'The destination has accessibility signals that align with your needs.',
    )
  }

  if (
    input.intelligence.safety.level &&
    calculateSafetyScore(input.intelligence.safety.level) !== null &&
    calculateSafetyScore(input.intelligence.safety.level)! >= 80
  ) {
    reasons.push(
      'Available safety signals indicate a comparatively comfortable destination profile.',
    )
  }

  return reasons.slice(0, 5)
}

function buildCautions(
  input: IntelligenceInput,
  breakdown: PersonalFitBreakdown,
  accessibilityScore: number | null,
): string[] {
  const cautions: string[] = []

  const pressureScore =
    input.intelligence.pressure.score

  if (pressureScore !== null && pressureScore >= 70) {
    cautions.push(
      'This destination currently has relatively high visitor pressure.',
    )
  }

  if (input.intelligence.safety.level) {
    const safety = calculateSafetyScore(
      input.intelligence.safety.level,
    )

    if (safety !== null && safety < 60) {
      cautions.push(
        'Review the available safety guidance before planning your visit.',
      )
    }
  }

  if (
    breakdown.budget !== null &&
    breakdown.budget < 50
  ) {
    cautions.push(
      'The estimated daily cost may exceed your preferred budget.',
    )
  }

  if (
    accessibilityScore !== null &&
    accessibilityScore < 60
  ) {
    cautions.push(
      'Some of your accessibility requirements may not be fully supported.',
    )
  }

  if (
    input.intelligence.accessibility.accessibility_notes === null &&
    input.traveller.accessibility_needs.length > 0
  ) {
    cautions.push(
      'Accessibility information is currently limited, so verify specific requirements before travelling.',
    )
  }

  if (
    breakdown.interests === 0
  ) {
    cautions.push(
      'This destination does not currently match your selected interests.',
    )
  }

  if (
    breakdown.travel_style === 0
  ) {
    cautions.push(
      'This destination does not currently match your preferred travel style.',
    )
  }

  if (
    breakdown.region === 0
  ) {
    cautions.push(
      'This destination is outside your selected preferred regions.',
    )
  }

  if (
    breakdown.food === 0
  ) {
    cautions.push(
      'The available destination food data does not match your selected food preferences.',
    )
  }

  return cautions.slice(0, 5)
}

export function calculateIntelligenceScore(
  input: IntelligenceInput,
): IntelligenceResult {
  const { traveller, destination, intelligence } = input

  // ---------------------------------------------------------
  // 1. PERSONAL PREFERENCE MATCHING
  // ---------------------------------------------------------

  const interests = calculateSemanticArrayMatch(
    traveller.interests,
    destination.tags.interests,
  )

  const travelStyle = calculateSemanticArrayMatch(
    traveller.travel_styles,
    destination.tags.travel_styles,
  )

  const budget = calculateBudgetScore(
    traveller.budget_per_day,
    null,
  )

  const duration = calculateDurationScore(
    traveller.preferred_trip_duration_days,
    null,
  )

  const crowd = calculateCrowdScore(
    traveller.crowd_preference,
    intelligence.pressure.level,
    intelligence.pressure.score,
  )

  const region = calculateRegionalMatch(
    traveller.preferred_regions,
    destination.state_name,
  )

  const food = calculateSemanticArrayMatch(
    traveller.food_preferences,
    destination.tags.food,
  )

  // ---------------------------------------------------------
  // 2. DEBUG — RAW SCORING INPUT
  // ---------------------------------------------------------

  console.log(
    '[KHOJ DEBUG] Scoring input:',
    JSON.stringify(
      {
        traveller,
        destinationTags: destination.tags,
        destinationState: destination.state_name,
        calculated: {
          interests,
          travelStyle,
          budget,
          duration,
          crowd,
          region,
          food,
        },
      },
      null,
      2,
    ),
  )

  // ---------------------------------------------------------
  // 3. PERSONAL FIT BREAKDOWN
  // ---------------------------------------------------------

  const breakdown: PersonalFitBreakdown = {
    interests: interests.score,
    travel_style: travelStyle.score,
    budget,
    duration,
    crowd,
    region: region.score,
    food: food.score,
  }

  const personalFit = calculatePersonalFit(breakdown)

  // ---------------------------------------------------------
  // 4. DESTINATION INTELLIGENCE DIMENSIONS
  // ---------------------------------------------------------

  const impact = calculateImpactScore(
    intelligence.impact.score,
  )

  const safety = calculateSafetyScore(
    intelligence.safety.level,
  )

  const pressure = calculatePressureScore(
    intelligence.pressure.score,
  )

  const accessibility = calculateAccessibilityScore(
    traveller.accessibility_needs,
    intelligence.accessibility,
  )

  // ---------------------------------------------------------
  // 5. INTELLIGENCE CONFIDENCE
  // ---------------------------------------------------------

  const confidence = calculateIntelligenceConfidence(
    input,
    breakdown,
  )

  // ---------------------------------------------------------
  // 6. OVERALL SCORE
  //
  // Only available dimensions contribute.
  // Missing data does NOT become an artificial 50.
  // ---------------------------------------------------------

  const overallFactors = [
    {
      score: personalFit,
      weight: OVERALL_WEIGHTS.personal_fit,
    },
    {
      score: impact,
      weight: OVERALL_WEIGHTS.impact,
    },
    {
      score: safety,
      weight: OVERALL_WEIGHTS.safety,
    },
    {
      score: pressure,
      weight: OVERALL_WEIGHTS.pressure,
    },
    {
      score: accessibility,
      weight: OVERALL_WEIGHTS.accessibility,
    },
  ].filter(
    (
      factor,
    ): factor is {
      score: number
      weight: number
    } => factor.score !== null,
  )

  const totalOverallWeight = overallFactors.reduce(
    (total, factor) => total + factor.weight,
    0,
  )

  const overall =
    totalOverallWeight === 0
      ? 0
      : normalizeScore(
          overallFactors.reduce(
            (total, factor) =>
              total + factor.score * factor.weight,
            0,
          ) / totalOverallWeight,
        )

  // ---------------------------------------------------------
  // 7. FINAL DEBUG
  // ---------------------------------------------------------

  console.log(
    '[KHOJ DEBUG] Final intelligence score:',
    JSON.stringify(
      {
        destination: destination.name,
        personalFit,
        breakdown,
        impact,
        safety,
        pressure,
        accessibility,
        overall,
        confidence,
      },
      null,
      2,
    ),
  )

  // ---------------------------------------------------------
  // 8. FINAL RESULT
  // ---------------------------------------------------------

  return {
    destination_id: destination.id,
    destination_name: destination.name,

    score: {
      personal_fit: personalFit,
      impact,
      safety,
      pressure,
      accessibility,
      overall,
      breakdown,
      confidence,
    },

    reasons: buildReasons(
      breakdown,
      input,
    ),

    cautions: buildCautions(
      input,
      breakdown,
      accessibility,
    ),
  }
}