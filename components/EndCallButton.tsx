"use client";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const EndCallButton = () => {
  const call = useCall();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;
  const router = useRouter();

  useEffect(() => {
    const handleCallEnded = () => {
      router.push("/");
    };

    call?.on("call.ended", handleCallEnded);

    return () => {
      call?.off("call.ended", handleCallEnded);
    };
  }, [call, router]);

  if (!isMeetingOwner) return null;

  return (
    <Button
      onClick={async () => {
        await call.sendCustomEvent({
          type: "call.ended",
          data: { message: "The call has ended" },
        });
        await call.endCall();
        router.push("/"); 
      }}
      className="bg-red-500"
    >
      End call for all
    </Button>
  );
};

export default EndCallButton;
