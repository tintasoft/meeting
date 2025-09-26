"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VideoIcon, Calendar, Link, Loader2, Copy, LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const StartNewMeetingButton = () => {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [instantMeetingLoading, setInstantMeetingLoading] = useState(false);
  const [scheduledMeetingLoading, setScheduledMeetingLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleNewInstantMeeting = async () => {
    setInstantMeetingLoading(true);

    try {
      const response = await fetch("/api/meetings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          instant: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create meeting");
      }

      const data = await response.json();

      if (!data.id) {
        throw new Error("Failed to create meeting");
      }

      // Redirect to the meeting page
      location.href = "/meeting/" + data.id;
    } catch {
      toast.error("Failed to create meeting. Please try again.");
    } finally {
      setInstantMeetingLoading(false);
    }
  };

  const handleScheduleMeeting = async () => {
    setScheduledMeetingLoading(true);
    try {
      // Simulate API call for scheduling
      const response = await fetch("/api/meetings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          instant: false,
          scheduled: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule meeting");
      }

      const data = await response.json();
      setMeetingUrl(`${window.location.origin}/meeting/${data.id}`);

      toast.success("Meeting scheduled successfully!");
    } catch {
      toast.error("Failed to schedule meeting. Please try again.");
    } finally {
      setScheduledMeetingLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (meetingUrl) {
      try {
        await navigator.clipboard.writeText(meetingUrl);
        toast.success("Meeting link copied to clipboard!");
      } catch {
        toast.error("Could not copy to clipboard.");
      }
    }
  };

  const joinMeeting = () => {
    if (meetingUrl) {
      location.href = meetingUrl;
    }
  };

  const resetModal = () => {
    setMeetingUrl("");
    setInstantMeetingLoading(false);
    setScheduledMeetingLoading(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetModal();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <VideoIcon className="w-4 h-4 mr-2" />
          Start New Meeting
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <VideoIcon className="w-5 h-5" />
            Start New Meeting
          </DialogTitle>
          <DialogDescription>
            Choose how you&apos;d like to start your video meeting
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Instant Meeting Option */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900">
                <VideoIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">Instant Meeting</h3>
                <p className="text-sm text-gray-500">Start immediately</p>
              </div>
            </div>
            <Button
              onClick={handleNewInstantMeeting}
              disabled={instantMeetingLoading}
              size="sm"
            >
              {instantMeetingLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Start"
              )}
            </Button>
          </div>

          {/* Schedule Meeting Option */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full dark:bg-green-900">
                <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold">Schedule Meeting</h3>
                <p className="text-sm text-gray-500">Set for later</p>
              </div>
            </div>
            <Button
              onClick={handleScheduleMeeting}
              disabled={scheduledMeetingLoading}
              variant="outline"
              size="sm"
            >
              {scheduledMeetingLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Schedule"
              )}
            </Button>
          </div>

          {/* Generated Meeting Link */}
          {meetingUrl && (
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Meeting Link</span>
                <Button
                  onClick={copyToClipboard}
                  variant="ghost"
                  size="sm"
                  className="h-8"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white rounded border dark:bg-gray-800">
                <Link className="w-3 h-3 text-gray-400" />
                <code className="text-sm truncate flex-1">{meetingUrl}</code>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          {meetingUrl && (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={joinMeeting}
            >
              Join Meeting Now
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const JoinExistingMeetingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [meetingId, setMeetingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinMeeting = async () => {
    if (!meetingId.trim()) {
      toast.error("Please enter a meeting ID");
      return;
    }

    setIsLoading(true);

    let extractedMeetingId = meetingId.trim();

    // Remove http/https and domain parts to extract just the meeting ID
    const urlRegex = /^(https?:\/\/[^\/]+\/meeting\/)([a-zA-Z0-9-]+)$/;
    const match = meetingId.match(urlRegex);

    if (match) {
      extractedMeetingId = match[2]; // Extract the meeting ID part
    }

    // Also handle cases where the URL might have trailing slashes or parameters
    const alternativeRegex =
      /^(https?:\/\/[^\/]+\/meeting\/)([a-zA-Z0-9-]+)(\/?.*)$/;
    const altMatch = meetingId.match(alternativeRegex);

    if (altMatch) {
      extractedMeetingId = altMatch[2];
    }

    // Validate meeting ID format (basic validation)
    const validIdRegex = /^[a-zA-Z0-9-]+$/;
    if (!validIdRegex.test(extractedMeetingId)) {
      toast.error("Invalid meeting ID format");
      setIsLoading(false);
      return;
    }

    try {
      // // Optional: Validate if meeting exists
      // const response = await fetch(`/api/meetings/${extractedMeetingId}/validate`);

      // if (response.status === 404) {
      //   toast.error("Meeting not found. Please check the ID.");
      //   setIsLoading(false);
      //   return;
      // }

      // Redirect to meeting
      location.href = `/meeting/${extractedMeetingId}`;
    } catch {
      // If validation fails, still try to join (meeting might be instant)
      location.href = `/meeting/${extractedMeetingId}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <LogIn className="w-4 h-4 mr-2" />
          Join Meeting
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="w-5 h-5" />
            Join Existing Meeting
          </DialogTitle>
          <DialogDescription>
            Enter the meeting ID or link to join an existing meeting
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="meetingId" className="text-sm font-medium">
              Meeting ID or Link
            </label>
            <div className="flex gap-2">
              <input
                id="meetingId"
                type="text"
                placeholder="Enter meeting ID or full link"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleJoinMeeting();
                  }
                }}
              />
            </div>
            <p className="text-xs text-gray-500">
              You can find the meeting ID in your invitation link
            </p>
          </div>

          {/* Quick join examples */}
          <div className="p-3 bg-gray-50 rounded-lg dark:bg-gray-900">
            <h4 className="text-sm font-medium mb-2">Example meeting IDs:</h4>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div>• abc-defg-123</div>
              <div>• xyz-789-hij</div>
              <div>• Or paste the full meeting URL</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleJoinMeeting}
            disabled={isLoading || !meetingId.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Join Meeting
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { StartNewMeetingButton, JoinExistingMeetingButton };
