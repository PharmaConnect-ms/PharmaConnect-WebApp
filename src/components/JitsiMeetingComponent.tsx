import { JaaSMeeting } from "@jitsi/react-sdk";

interface JitsiMeetingProps {
  roomName: string;
  token: string;
  onMeetingEnd: () => void;
}

const JitsiMeetingComponent = ({ roomName, token, onMeetingEnd }: JitsiMeetingProps) => {
  return (
    <div className="w-full">
      <JaaSMeeting
        appId="vpaas-magic-cookie-3b77f06727bf40449f82968dd34470c9"
        roomName={roomName}
        jwt={token}
        getIFrameRef={(node) => (node.style.height = '800px')}
        configOverwrite={{
          disableThirdPartyRequests: true,
          disableLocalVideoFlip: true,
          backgroundAlpha: 0.5,
        }}
        interfaceConfigOverwrite={{
          VIDEO_LAYOUT_FIT: 'nocrop',
          MOBILE_APP_PROMO: false,
          TILE_VIEW_MAX_COLUMNS: 4,
        }}
        onApiReady={(externalApi) => {
          console.log("Jitsi API is ready", externalApi);
        }}
        onReadyToClose={onMeetingEnd}
      />
    </div>
  );
};

export default JitsiMeetingComponent;
