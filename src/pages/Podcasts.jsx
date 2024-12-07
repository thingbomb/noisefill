import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

export default function Podcasts() {
  const [podcastData, setPodcastData] = useState(
    JSON.parse(localStorage.getItem("podcastData") || "[]")
  );

  function AddPodcastDialog() {
    const [feedUrl, setFeedUrl] = useState("");

    function addPodcast() {
      let copiedFeedUrl = feedUrl;
      setFeedUrl("");
      fetch("https://corsproxy.io/?" + copiedFeedUrl)
        .then((response) => response.text())
        .then((data) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "text/xml");
          if (xmlDoc.querySelector("title")) {
            const podcasts = JSON.parse(
              localStorage.getItem("podcastData") || "[]"
            );
            const podcastData = {
              title: xmlDoc.querySelector("title").textContent,
              feedUrl: feedUrl,
            };
            podcasts.push(podcastData);
            localStorage.setItem("podcastData", JSON.stringify(podcasts));
            setPodcastData(podcasts);
          } else {
            alert("Invalid podcast URL");
          }
        })
        .catch((error) => {
          console.error("Error fetching podcast data:", error);
        });
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Add podcast</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add podcast</DialogTitle>
            <DialogDescription>
              Add a podcast by its RSS feed URL
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Feed URL
              </Label>
              <Input
                id="feedUrl"
                value={feedUrl}
                onChange={(e) => {
                  setFeedUrl(e.target.value.replaceAll(" ", ""));
                }}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={addPodcast}>
              Add podcast
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Your library</h1>
      <ul>
        {podcastData.map((podcast, index) => (
          <li key={index}>
            <a href={"/podcasts/view?feedUrl=" + podcast.feedUrl}>
              {podcast.title}
            </a>
          </li>
        ))}
      </ul>
      <br />
      <AddPodcastDialog />
    </div>
  );
}
