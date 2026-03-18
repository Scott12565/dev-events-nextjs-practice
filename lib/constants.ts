export type Event = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: Event[] = [
  {
    title: "React Summit 2026",
    image: "/images/event1.png",
    slug: "react-summit-2026",
    location: "Amsterdam, NL",
    date: "May 20–22, 2026",
    time: "9:00 AM – 6:00 PM",
  },
  {
    title: "JSConf EU 2026",
    image: "/images/event2.png",
    slug: "jsconf-eu-2026",
    location: "Kraków, Poland",
    date: "June 3–5, 2026",
    time: "9:30 AM – 5:30 PM",
  },
  {
    title: "Next.js Conf 2026",
    image: "/images/event3.png",
    slug: "nextjs-conf-2026",
    location: "Online",
    date: "July 14–15, 2026",
    time: "10:00 AM – 4:00 PM (UTC)",
  },
  {
    title: "Open Source Summit 2026",
    image: "/images/event4.png",
    slug: "open-source-summit-2026",
    location: "Austin, TX",
    date: "August 11–13, 2026",
    time: "9:00 AM – 5:00 PM",
  },
  {
    title: "Hackathon: Build for Good",
    image: "/images/event5.png",
    slug: "hackathon-build-for-good-2026",
    location: "New York, NY",
    date: "September 18–19, 2026",
    time: "6:00 PM – 10:00 PM",
  },
  {
    title: "Tech Meetup: Cloud Native",
    image: "/images/event6.png",
    slug: "cloud-native-meetup-2026",
    location: "Berlin, Germany",
    date: "October 8, 2026",
    time: "6:30 PM – 9:00 PM",
  },
];
