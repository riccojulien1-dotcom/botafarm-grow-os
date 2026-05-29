"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export type ActionFeedbackState = {
  error?: string;
  success?: string;
};

type RefreshOnActionSuccessOptions = {
  /** When false, success is ignored (e.g. while not in edit mode). Defaults to true. */
  enabled?: boolean;
  onSuccess?: () => void;
};

export function useRefreshOnActionSuccess(
  actionState: ActionFeedbackState | undefined,
  options?: RefreshOnActionSuccessOptions,
) {
  const router = useRouter();
  const onSuccessRef = useRef(options?.onSuccess);
  const lastHandledStateRef = useRef<ActionFeedbackState | null>(null);
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
  });

  useEffect(() => {
    if (!enabled || !actionState?.success) {
      return;
    }

    if (actionState === lastHandledStateRef.current) {
      return;
    }

    lastHandledStateRef.current = actionState;
    onSuccessRef.current?.();
    router.refresh();
  }, [actionState, enabled, router]);
}
