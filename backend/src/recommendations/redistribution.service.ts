import type {
  Recommendation,
  RedistributionSuggestion,
} from './recommendation.types.js'

const HIGH_PRESSURE_THRESHOLD = 60
const LOW_PRESSURE_THRESHOLD = 40
const MIN_PERSONAL_FIT = 60
const MIN_PRESSURE_IMPROVEMENT = 15

export function findRedistributionSuggestions(
  candidates: Recommendation[],
): RedistributionSuggestion[] {
  const suggestions: RedistributionSuggestion[] = []

  const highPressureDestinations =
    candidates.filter(
      (recommendation) =>
        recommendation.intelligence.score.pressure !== null &&
        recommendation.intelligence.score.pressure <=
          100 - HIGH_PRESSURE_THRESHOLD,
    )

  const lowerPressureAlternatives =
    candidates.filter(
      (recommendation) =>
        recommendation.intelligence.score.pressure !== null &&
        recommendation.intelligence.score.pressure >=
          100 - LOW_PRESSURE_THRESHOLD &&
        recommendation.intelligence.score.personal_fit >=
          MIN_PERSONAL_FIT,
    )

  for (const source of highPressureDestinations) {
    const sourcePressure =
      source.intelligence.score.pressure

    if (sourcePressure === null) {
      continue
    }

    const alternative =
      lowerPressureAlternatives
        .filter(
          (candidate) =>
            candidate.destination.id !==
              source.destination.id &&
            candidate.intelligence.score.personal_fit >=
              MIN_PERSONAL_FIT &&
            candidate.intelligence.score.pressure !== null &&
            candidate.intelligence.score.pressure -
              sourcePressure >=
              MIN_PRESSURE_IMPROVEMENT,
        )
        .sort(
          (a, b) =>
            b.intelligence.score.personal_fit -
            a.intelligence.score.personal_fit,
        )[0]

    if (!alternative) {
      continue
    }

    const alternativePressure =
      alternative.intelligence.score.pressure

    if (alternativePressure === null) {
      continue
    }

    suggestions.push({
      source_destination_id:
        source.destination.id,

      source_destination_name:
        source.destination.name,

      alternative_destination_id:
        alternative.destination.id,

      alternative_destination_name:
        alternative.destination.name,

      source_pressure_score:
        sourcePressure,

      alternative_pressure_score:
        alternativePressure,

      personal_fit_score:
        alternative.intelligence.score.personal_fit,

      reason:
        `${alternative.destination.name} offers a strong personal fit with significantly lower tourism pressure.`,
    })
  }

  return suggestions
}