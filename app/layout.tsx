import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.anuppradhan.in"),
  icons: {
    icon: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
  title: {
    default:
      "Anup Pradhan | Software Developer & Machine Learning Enthusiast",
    template: "%s | Anup Pradhan",
  },
  description:
    "Software Developer from Bhubaneswar, India specializing in backend development, RESTful APIs, and full-stack applications using MongoDB, Express.js, React, Next.js, Node.js, and TypeScript. Currently learning Machine Learning with TensorFlow and scikit-learn.",
  keywords: [
    "Software Developer",
    "Software Developer Bhubaneswar",
    "Software Developer India",
    "TypeScript Developer",
    "Node.js Developer",
    "React Developer",
    "Machine Learning Developer",
    "Web Developer Portfolio",
    "Next.js Developer",
    "Backend Developer",
    "MongoDB Developer",
    "Express.js Developer",
    "REST API Developer",
    "Python Developer",
    "TensorFlow Developer",
    "Developer Portfolio",
    "Freelance Developer",
  ],
  authors: [{ name: "Anup Pradhan", url: "https://www.anuppradhan.in" }],
  creator: "Anup Pradhan",
  formatDetection: {
    email: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.anuppradhan.in",
    siteName: "Anup Pradhan - Developer Portfolio",
    title: "Anup Pradhan | Software Developer",
    description:
      "Software Developer specializing in backend development, RESTful APIs, and Machine Learning. Based in Bhubaneswar, Odisha, India.",
    images: [
      {
        url: "https://www.anuppradhan.in/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Anup Pradhan - Software Developer",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AnupPradhan0",
    creator: "@AnupPradhan0",
    title: "Anup Pradhan | Software Developer",
    description:
      "Software Developer with backend focus, building RESTful APIs and full-stack applications. Learning Machine Learning.",
    images: ["https://www.anuppradhan.in/images/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.anuppradhan.in",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  referrer: "strict-origin-when-cross-origin",
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="application-name" content="Anup Pradhan - Developer" />
        <meta name="apple-mobile-web-app-title" content="Anup Dev" />
        <link rel="icon" href="/images/logo.jpg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://www.anuppradhan.in" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
