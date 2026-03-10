import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertDiario, type Diario } from "@shared/schema";

export function useDiarioList() {
  return useQuery({
    queryKey: [api.diario.list.path],
    queryFn: async () => {
      const res = await fetch(api.diario.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch diario entries");
      return api.diario.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateDiario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDiario) => {
      const res = await fetch(api.diario.create.path, {
        method: api.diario.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create entry");
      return api.diario.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.diario.list.path] });
    },
  });
}

export function useUpdateDiario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertDiario>) => {
      const url = buildUrl(api.diario.update.path, { id });
      const res = await fetch(url, {
        method: api.diario.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update entry");
      return api.diario.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.diario.list.path] });
    },
  });
}

export function useDeleteDiario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.diario.delete.path, { id });
      const res = await fetch(url, {
        method: api.diario.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete entry");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.diario.list.path] });
    },
  });
}
