import StreamVideoProvider from "@/providers/StreamClientProvider";
import React, { ReactNode } from "react";

const rootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
};
export default rootLayout;
