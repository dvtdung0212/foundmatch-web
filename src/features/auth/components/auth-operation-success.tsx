"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AuthOperationSuccessProps {
  actionLabel: string;
  description: string;
  destination: string;
  title: string;
}

const REDIRECT_SECONDS = 3;

export function AuthOperationSuccess({
  actionLabel,
  description,
  destination,
  title,
}: AuthOperationSuccessProps) {
  const { replace } = useRouter();
  const [secondsRemaining, setSecondsRemaining] = useState(REDIRECT_SECONDS);
  const navigated = useRef(false);

  const navigate = useCallback(() => {
    if (navigated.current) return;
    navigated.current = true;
    replace(destination);
  }, [destination, replace]);

  useEffect(() => {
    const countdown = window.setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1));
    }, 1_000);
    const redirect = window.setTimeout(navigate, REDIRECT_SECONDS * 1_000);

    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="space-y-6 text-center" role="status">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-foundBg text-brand-found">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-brand-heading">{title}</h1>
        <p className="text-sm leading-6 text-brand-muted">{description}</p>
        <p aria-live="polite" className="text-xs font-semibold text-brand-plum">
          Tự động chuyển sau {secondsRemaining} giây.
        </p>
      </div>
      <Button fullWidth onClick={navigate} size="lg" type="button">
        {actionLabel}
      </Button>
    </div>
  );
}
