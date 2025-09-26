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
      {user && (
        <>
          <JaaSMeeting
            appId="vpaas-magic-cookie-65612a87d05b4443a0ce23672a0beb8a"
            roomName={params.id}
            userInfo={{
              displayName: user!.fullName!,
              email: user!.primaryEmailAddress!.emailAddress,
            }}
            onReadyToClose={() => {
              location.href = "/";
            }}
            configOverwrite={{
              disableLocalVideoFlip: true,
              backgroundAlpha: 0.5,
            }}
            interfaceConfigOverwrite={{
              VIDEO_LAYOUT_FIT: "nocrop",
              MOBILE_APP_PROMO: false,
              TILE_VIEW_MAX_COLUMNS: 4,
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
        </>
      )}

      {!user && (
        <div className="w-full h-screen flex justify-center items-center">
          <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
        </div>
      )}
    </div>
  );
}
