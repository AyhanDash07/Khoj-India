import { z } from 'zod'

export const destinationIdParamsSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
})