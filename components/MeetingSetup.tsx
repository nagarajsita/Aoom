import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

const MeetingSetup = ({
  setisSetupComplete,
}: {
  setisSetupComplete: (value: boolean) => void;
}) => {
  const [isMIcCamToggledOn, setisMIcCamToggledOn] = useState(false);
  const call = useCall();
  if (!call) {
    throw new Error("usecall must be used within StreamCall Component");
  }
  useEffect(() => {
    if (isMIcCamToggledOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMIcCamToggledOn, call?.camera, call?.microphone]);
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            className="size-3.5"
            type="checkbox"
            checked={isMIcCamToggledOn}
            onChange={(e) => setisMIcCamToggledOn(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          call.join();
          setisSetupComplete(true);
        }}
      >
        Join meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
