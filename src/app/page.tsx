import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Activity,
  MessageSquare,
  ChartBar,
  Heart,
  Shield,
  Brain,
} from "lucide-react";

const Feature = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center p-6 space-y-4 text-center rounded-lg border border-gray-100 hover:border-primary/20 transition-colors">
    <div className="p-3 rounded-full bg-primary/10">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Landing = () => {
  const features = [
    {
      icon: Activity,
      title: "Symptom Tracking",
      description: "Monitor your symptoms daily with our intelligent tracking system",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get personalized health insights powered by advanced AI",
    },
    {
      icon: ChartBar,
      title: "Health Analytics",
      description: "Visualize your health trends with detailed analytics",
    },
    {
      icon: MessageSquare,
      title: "24/7 Health Assistant",
      description: "Chat with our AI health assistant anytime, anywhere",
    },
    {
      icon: Heart,
      title: "Lifestyle Management",
      description: "Personalized recommendations for a healthier lifestyle",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your health data is protected with enterprise-grade security",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Personal Health Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the future of healthcare with AI-powered insights and personalized health management.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Comprehensive Health Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their health more effectively.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
