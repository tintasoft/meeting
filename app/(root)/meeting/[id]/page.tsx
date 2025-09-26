"use client";

import { use } from "react";
import { useUser } from "@clerk/nextjs";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { Loader2 } from "lucide-react";

type Params = Promise<{ id: string }>;

export default function Meeting(props: { params: Params }) {
  const params = use(props.params);
  const { user, isLoaded } = useUser();

  if (!isLoaded || !params.id) {
    <div className="w-full h-screen flex justify-center items-center">
      <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
    </div>;
  }

  return (
    <div className="w-full h-screen">
      <JaaSMeeting
        appId="vpaas-magic-cookie-65612a87d05b4443a0ce23672a0beb8a"
        roomName={params.id}
        userInfo={{
          displayName: user?.fullName || "User",
          email: user?.primaryEmailAddress?.emailAddress || "",
        }}
        spinner={() => (
          <>
            <div className="w-full h-screen flex justify-center items-center">
              <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
            </div>
          </>
        )}
        getIFrameRef={(iframe) => {
          iframe.style.width = "100%";
          iframe.style.height = "100%";
        }}
      />
    </div>
  );
}
