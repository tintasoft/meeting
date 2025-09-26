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
import { VideoIcon, Calendar, Link, Loader2, Copy } from "lucide-react";
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

      location.href = "/meeting/" + data.id;
    } catch {
      toast("Error", {
        description: "Failed to create meeting. Please try again.",
      });
    } finally {
      setInstantMeetingLoading(false);
    }
  };

  const handleScheduleMeeting = async () => {
    setScheduledMeetingLoading(true);
    // Add scheduling logic here
    setTimeout(() => {
      setScheduledMeetingLoading(false);
      setMeetingUrl("kskskks");
      toast("Meeting scheduled!", {
        description: "Your meeting has been scheduled for later.",
      });
    }, 1000);
  };

  const copyToClipboard = async () => {
    if (meetingUrl) {
      try {
        await navigator.clipboard.writeText(meetingUrl);
        toast("Copied!", {
          description: "Meeting link copied to clipboard.",
        });
      } catch {
        toast("Copy failed", {
          description: "Could not copy to clipboard.",
        });
      }
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
              <div className="p-2 bg-blue-100 rounded-full">
                <VideoIcon className="w-4 h-4 text-blue-600" />
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
              <div className="p-2 bg-green-100 rounded-full">
                <Calendar className="w-4 h-4 text-green-600" />
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
            <div className="p-4 bg-gray-50 rounded-lg">
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
              <div className="flex items-center gap-2 p-2 bg-white rounded border">
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
            <Button className="bg-blue-600 hover:bg-blue-700">
              Join Meeting Now
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { StartNewMeetingButton };
