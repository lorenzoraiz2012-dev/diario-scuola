import { z } from "zod";
import { insertDiarioSchema, diario, insertVotoSchema, voti } from "./schema";

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  diario: {
    list: {
      method: "GET" as const,
      path: "/api/diario" as const,
      responses: {
        200: z.array(z.custom<typeof diario.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/diario" as const,
      input: insertDiarioSchema,
      responses: {
        201: z.custom<typeof diario.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: "PUT" as const,
      path: "/api/diario/:id" as const,
      input: insertDiarioSchema.partial(),
      responses: {
        200: z.custom<typeof diario.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/diario/:id" as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },
  voti: {
    list: {
      method: "GET" as const,
      path: "/api/voti" as const,
      responses: {
        200: z.array(z.custom<typeof voti.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/voti" as const,
      input: insertVotoSchema,
      responses: {
        201: z.custom<typeof voti.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/voti/:id" as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
