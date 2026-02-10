"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { LoadingButton } from "@/components/ui/loading-button";
import { syncUser } from "./actions";

export function SyncButton() {
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();
  const router = useRouter();

  const handleSync = () => {
    // We wrap the entire async flow in a promise toast for better UX
    const syncPromise = async () => {
      // 1. Trigger Server Action
      await syncUser();
      // 2. Force Client to fetch new JWT with 'uid' metadata
      await user?.reload();
      // 3. Navigate
      router.push("/");
    };

    startTransition(() => {
      toast.promise(syncPromise(), {
        loading: 'Setting up your profile...',
        success: 'Profile synchronized! Redirecting...',
        error: 'Failed to synchronize profile. Please try again.',
      });
    });
  };

  return (
    <LoadingButton
      onClick={handleSync}
      isLoading={isPending}
      loadingText="Processing..."
      className="w-full bg-slate-900 hover:bg-slate-800"
    >
      Continue
    </LoadingButton>
  );
}
