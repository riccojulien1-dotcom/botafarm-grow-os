"use client";

import { useRouter } from "next/navigation";
import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import type { DailyLogActionState } from "@/lib/journal/daily-log-action-state";
import {
  extractPhotoFilesFromForm,
  removePhotosFromFormData,
  uploadDailyLogPhotosFromBrowser,
} from "@/lib/journal/log-photos-client";
import { useTranslatePhotoUploadError } from "@/lib/journal/use-translate-photo-upload-error";
import { createClient } from "@/lib/supabase/client";

type UseDailyLogFormWithPhotosOptions = {
  onSuccess?: () => void;
};

export function useDailyLogFormWithPhotos(
  action: (state: DailyLogActionState, formData: FormData) => Promise<DailyLogActionState>,
  initialState: DailyLogActionState = {},
  options?: UseDailyLogFormWithPhotosOptions,
) {
  const router = useRouter();
  const translatePhotoError = useTranslatePhotoUploadError();
  const [state, formAction, actionPending] = useActionState(action, initialState);
  const [photoPending, setPhotoPending] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const pendingFilesRef = useRef<File[]>([]);
  const pendingLogIdRef = useRef<string | null>(null);
  const handledSuccessRef = useRef<DailyLogActionState | null>(null);
  const onSuccessRef = useRef(options?.onSuccess);

  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
  });

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setPhotoError(null);

      const form = event.currentTarget;
      const files = extractPhotoFilesFromForm(form);
      const formData = new FormData(form);
      removePhotosFromFormData(formData);

      pendingFilesRef.current = files;
      pendingLogIdRef.current = String(formData.get("log_id") ?? "").trim() || null;
      formAction(formData);
    },
    [formAction],
  );

  useEffect(() => {
    if (!state.success || state === handledSuccessRef.current) {
      return;
    }

    handledSuccessRef.current = state;
    const files = pendingFilesRef.current;
    const logId = state.logId ?? pendingLogIdRef.current;
    pendingFilesRef.current = [];
    pendingLogIdRef.current = null;

    if (!files.length || !logId) {
      onSuccessRef.current?.();
      router.refresh();
      return;
    }

    (async () => {
      setPhotoPending(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setPhotoPending(false);
        setPhotoError("You must be signed in to upload photos.");
        return;
      }

      const uploadError = await uploadDailyLogPhotosFromBrowser(user.id, logId, files);
      setPhotoPending(false);

      if (uploadError) {
        setPhotoError(translatePhotoError(uploadError));
        return;
      }

      onSuccessRef.current?.();
      router.refresh();
    })();
  }, [router, state]);

  return {
    state,
    photoError,
    pending: actionPending || photoPending,
    handleSubmit,
  };
}
