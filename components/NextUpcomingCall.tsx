"use client";
import { useGetCalls } from "@/hooks/useGetCalls";
import React from "react";
const NextUpcomingCall = () => {
  const { upcomingCalls } = useGetCalls();

  const formatCallTime = (callTime: Date | undefined) => {
    if (!callTime) return "";

    const now = new Date();
    const callDate = new Date(callTime);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (callDate.toDateString() === now.toDateString()) {
      return `Today Meeting at ${callDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (callDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow Meeting at ${callDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return `Upcoming Meeting at ${callDate.toLocaleString("en-US", {
        weekday: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  };

  const getNextUpcomingCall = () => {
    const now = new Date();
    if (upcomingCalls.length === 0) return null;

    return (
      upcomingCalls
        .filter(
          (call) => call.state.startsAt && new Date(call.state.startsAt) > now,
        )
        .sort((a, b) => {
          if (a.state.startsAt && b.state.startsAt) {
            return (
              new Date(a.state.startsAt).getTime() -
              new Date(b.state.startsAt).getTime()
            );
          }
          return 0;
        })[0] || null
    );
  };

  const nextCall = getNextUpcomingCall();

  return (
    <div>
      <h2 className="glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal">
        {nextCall
          ? formatCallTime(nextCall.state.startsAt)
          : "No upcoming meetings"}
      </h2>
    </div>
  );
};
export default NextUpcomingCall;
