// @ts-nocheck
"use client";

import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { toast, useToast } from "./ui/use-toast";

const CallList = ({ type }: { type: "upcoming" | "ended" | "recordings" }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const router = useRouter();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const { toast } = useToast();
  const getCalls = () => {
    switch (type) {
      case "upcoming":
        return upcomingCalls;
      case "ended":
        return endedCalls;
      case "recordings":
        return recordings;
      default:
        return [];
    }
  };
  const getNoCallsMessage = () => {
    switch (type) {
      case "upcoming":
        return "No upcoming calls";
      case "ended":
        return "No previous calls";
      case "recordings":
        return "No recordings";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings.map((meeting) => meeting.queryRecordings()),
        );
        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);
        setRecordings(recordings);
        console.log(callData);
      } catch (error) {
        toast({ title: "Try again later" });
      }
    };
    if (type == "recordings") fetchRecordings();
  }, [type, callRecordings]);

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();
  if (isLoading) return <Loader />;
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            type={type}
            key={(meeting as Call).id}
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : type === "upcoming"
                  ? "/icons/upcoming.svg"
                  : "/icons/recordings.svg"
            }
            title={
              (meeting as Call).state?.custom?.description ||
              meeting.filename?.substring(0, 20) ||
              "Personal Meet"
            }
            date={
              new Date((meeting as Call).state?.startsAt).toDateString() ===
              new Date().toDateString()
                ? `Today, at ${(
                    meeting as Call
                  ).state?.startsAt.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : new Date(
                    (meeting as Call).state?.startsAt ||
                      (meeting as CallRecording).start_time,
                  ).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
            }
            isPreviousMeeting={type === "ended"}
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            handleClick={
              type === "recordings"
                ? () => {
                    router.push(`${meeting.url}`);
                  }
                : () => {
                    router.push(`meeting/${meeting.id}`);
                  }
            }
            link={
              type === "recordings"
                ? meeting.url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
            }
            buttonText={type == "recordings" ? "Play" : "Start"}
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};
export default CallList;
