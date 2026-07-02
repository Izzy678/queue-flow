import {
  BarChart3,
  Bell,
  Building2,
  Clock,
  MessageSquare,
  QrCode,
  type LucideIcon,
} from "lucide-react";

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Solutions", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#footer" },
] as const;

export const trustedByLogos = [
  { name: "Meridian Health", initials: "MH" },
  { name: "Northline Bank", initials: "NB" },
  { name: "CityGov Services", initials: "CG" },
  { name: "RetailOne", initials: "R1" },
  { name: "Apex Telecom", initials: "AT" },
  { name: "Summit Clinics", initials: "SC" },
] as const;

export const features: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: QrCode,
    title: "Digital ticket issuance",
    description:
      "Customers join queues via QR code, kiosk, or mobile link — no physical tickets, no friction.",
  },
  {
    icon: Clock,
    title: "Real-time queue tracking",
    description:
      "Live position updates and estimated wait times keep customers informed every step of the way.",
  },
  {
    icon: Bell,
    title: "SMS & email notifications",
    description:
      "Automated alerts when it's almost their turn, so customers can wait remotely with confidence.",
  },
  {
    icon: Building2,
    title: "Multi-branch management",
    description:
      "Oversee queues across every location from a single dashboard with branch-level controls.",
  },
  {
    icon: BarChart3,
    title: "Analytics dashboard",
    description:
      "Track wait times, throughput, peak hours, and staff performance with actionable insights.",
  },
  {
    icon: MessageSquare,
    title: "Customer feedback collection",
    description:
      "Capture satisfaction scores post-visit to measure service quality and identify improvements.",
  },
];

export const howItWorksSteps = [
  {
    step: "01",
    title: "Join Queue",
    description:
      "Customers scan a QR code or tap a link to join the queue from anywhere — in person or remotely.",
  },
  {
    step: "02",
    title: "Wait Remotely",
    description:
      "They receive live position updates and estimated wait times on their phone while they go about their day.",
  },
  {
    step: "03",
    title: "Receive Notification",
    description:
      "An SMS or push notification alerts them when they're next, so they arrive just in time.",
  },
  {
    step: "04",
    title: "Get Served",
    description:
      "Staff calls the next ticket, serves the customer promptly, and collects optional feedback.",
  },
] as const;

export const benefits = [
  {
    metric: "47%",
    label: "Reduced congestion",
    description:
      "Eliminate crowded waiting areas by letting customers wait wherever they choose.",
  },
  {
    metric: "3.2x",
    label: "Better satisfaction",
    description:
      "Customers rate their experience higher when they have visibility and control over wait times.",
  },
  {
    metric: "28%",
    label: "Faster service delivery",
    description:
      "Streamlined queue flow and smart routing help staff serve more customers per hour.",
  },
  {
    metric: "100%",
    label: "Actionable analytics",
    description:
      "Every interaction is tracked — turn queue data into staffing and operational decisions.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "QueueFlow transformed our patient experience. Wait times dropped by half and our satisfaction scores have never been higher.",
    author: "Sarah Chen",
    role: "Operations Director",
    company: "Meridian Health",
    initials: "SC",
  },
  {
    quote:
      "We deployed across 12 branches in a week. The analytics alone paid for the platform within the first month.",
    author: "James Okonkwo",
    role: "VP of Customer Experience",
    company: "Northline Bank",
    initials: "JO",
  },
  {
    quote:
      "Our customers love the SMS notifications. No more crowded lobbies — people arrive exactly when they need to.",
    author: "Elena Vasquez",
    role: "Branch Manager",
    company: "CityGov Services",
    initials: "EV",
  },
] as const;

export const pricingTiers = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for single-location businesses getting started.",
    features: [
      "1 branch location",
      "Up to 500 tickets/month",
      "SMS notifications",
      "Basic analytics",
      "Email support",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$149",
    period: "/month",
    description: "For growing teams managing multiple locations.",
    features: [
      "Up to 10 branch locations",
      "Unlimited tickets",
      "SMS & email notifications",
      "Advanced analytics",
      "Customer feedback",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large organizations.",
    features: [
      "Unlimited branches",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantees",
      "On-premise option",
      "Custom analytics",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
] as const;

export const faqItems = [
  {
    question: "How quickly can we get started?",
    answer:
      "Most teams are live within a day. Sign up, configure your queues, print a QR code, and you're ready to serve customers digitally.",
  },
  {
    question: "Do customers need to download an app?",
    answer:
      "No. Customers join queues via a simple web link or QR code scan — no app download required. It works on any smartphone browser.",
  },
  {
    question: "Can we manage multiple branch locations?",
    answer:
      "Yes. QueueFlow supports multi-branch management from a single dashboard. Each location gets its own queues, staff, and analytics while you maintain centralized oversight.",
  },
  {
    question: "What kind of analytics do you provide?",
    answer:
      "Track average wait times, peak hours, tickets served per day, staff performance, customer satisfaction scores, and branch comparisons — all exportable.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. All plans include a 14-day free trial with full access to features. No credit card required to start.",
  },
  {
    question: "How do SMS notifications work?",
    answer:
      "When a customer joins a queue, they can opt in to SMS alerts. They'll receive updates on their position and a notification when it's almost their turn.",
  },
] as const;

export const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Integrations", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#footer" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
  ],
} as const;

export const dashboardStats = {
  activeQueues: 4,
  avgWaitTime: 8,
  currentTicket: "A-042",
  customersServed: 847,
} as const;

export const heroStats = [
  { value: 2.4, suffix: "M+", label: "Customers served" },
  { value: 47, suffix: "%", label: "Avg. wait reduction" },
  { value: 1200, suffix: "+", label: "Businesses trust us" },
] as const;
