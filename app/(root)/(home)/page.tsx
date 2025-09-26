import {
  JoinExistingMeetingButton,
  StartNewMeetingButton,
} from "@/components/meetings/button";

export default function Home() {
  return (
    <div className="w-full h-screen flex gap-2 justify-center items-center">
      <StartNewMeetingButton />
      <JoinExistingMeetingButton />
    </div>
  );
}
