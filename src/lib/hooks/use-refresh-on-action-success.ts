"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function useRefreshOnActionSuccess(
  successMessage: string | undefined,
  onSuccess?: () => void,
) {
  const router = useRouter();
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  });

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    onSuccessRef.current?.();
    router.refresh();
  }, [successMessage, router]);
}
