"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAuthenticatedOwnerMatchCandidateApi,
  type OwnerMatchCandidate,
} from "../api/owner-match-candidate-api";

const queryKey = (declarationId: string) =>
  ["owner-match-candidates", declarationId] as const;

type CandidateCommand = {
  action: "dismiss" | "restore" | "save" | "unsave";
  candidate: OwnerMatchCandidate;
};

export function useOwnerMatchCandidates(declarationId: string) {
  const client = useQueryClient();
  const query = useQuery({
    queryFn: async () => {
      const api = await getAuthenticatedOwnerMatchCandidateApi();
      return api.list(declarationId, 1, 50);
    },
    queryKey: queryKey(declarationId),
  });
  const mutation = useMutation({
    mutationFn: async ({ action, candidate }: CandidateCommand) => {
      const api = await getAuthenticatedOwnerMatchCandidateApi();
      return api[action](candidate.id, createIdempotencyKey(action));
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: queryKey(declarationId) });
    },
  });

  return {
    candidates: query.data?.items ?? [],
    dismiss: (candidate: OwnerMatchCandidate) =>
      mutation.mutateAsync({ action: "dismiss", candidate }),
    error: query.error,
    isLoading: query.isLoading,
    isMutating: mutation.isPending,
    refetch: query.refetch,
    restore: (candidate: OwnerMatchCandidate) =>
      mutation.mutateAsync({ action: "restore", candidate }),
    toggleSaved: (candidate: OwnerMatchCandidate) =>
      mutation.mutateAsync({
        action: candidate.isSaved ? "unsave" : "save",
        candidate,
      }),
    total: query.data?.total ?? 0,
  };
}

function createIdempotencyKey(action: string): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${action}-${crypto.randomUUID()}`;
  }
  return `${action}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
