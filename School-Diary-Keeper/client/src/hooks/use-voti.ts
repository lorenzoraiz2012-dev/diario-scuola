import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertVoto, type Voto } from "@shared/schema";

export function useVotiList() {
  return useQuery({
    queryKey: [api.voti.list.path],
    queryFn: async () => {
      const res = await fetch(api.voti.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch voti");
      return api.voti.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateVoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertVoto) => {
      const res = await fetch(api.voti.create.path, {
        method: api.voti.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create voto");
      return api.voti.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.voti.list.path] });
    },
  });
}

export function useDeleteVoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.voti.delete.path, { id });
      const res = await fetch(url, {
        method: api.voti.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete voto");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.voti.list.path] });
    },
  });
}
