import { useRouteContext } from '@fastify/react/client';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Zap, ShieldCheck, Users, TrendingUp, Edit3, CheckCircle, UserCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';

export function getMeta () {
  return {
    title: 'Welcome to @fastify/react!'
  }
}

export default function Index() {
  const { snapshot, state } = useRouteContext();
  const { user } = useAuth();

  // Initialize state on server and client - this might be specific to @fastify/react
  // and might not be needed if we manage global state differently later.
  useEffect(() => {
    if (snapshot && !snapshot.initialized) {
      // Assuming 'state' is mutable and part of useRouteContext's return for server-settable state
      // This pattern is a bit unusual for typical React state management.
      // For a full redesign, we might centralize such initial message state differently.
      // state.message = 'Task Management App'; 
      // state.initialized = true;
    }
  }, [snapshot, state]);

  const appName = "TaskForge"; // Consistent app name
  const tagline = "Elevate Your Productivity. Effortlessly.";

  const features = [
    {
      icon: Zap,
      title: "Blazing Fast Interface",
      description: "Experience unparalleled speed and responsiveness. Never wait for your tasks to load.",
    },
    {
      icon: ShieldCheck,
      title: "Fortress-Level Security",
      description: "Your data is protected with cutting-edge encryption and security protocols.",
    },
    {
      icon: Users,
      title: "Seamless Collaboration (Coming Soon)",
      description: "Work together with your team, assign tasks, and track progress in real-time.",
    },
    {
      icon: TrendingUp,
      title: "Insightful Analytics",
      description: "Gain valuable insights into your productivity patterns and optimize your workflow.",
    },
    {
      icon: Edit3,
      title: "Intuitive Task Creation",
      description: "Quickly add, organize, and prioritize tasks with our user-friendly editor.",
    },
    {
      icon: CheckCircle,
      title: "Goal-Oriented Tracking",
      description: "Set milestones, track your progress, and celebrate your achievements.",
    },
  ];

  return (
      <div className="space-y-16 md:space-y-24 py-12 md:py-20">
        {/* Hero Section */}
        <section className="text-center">
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6 
                       bg-gradient-to-r from-brand-accent-blue via-brand-accent-cyan to-brand-accent-orange 
                       text-transparent bg-clip-text animate-gradient-x"
          >
            {appName}
          </h1>
          <p className="text-xl md:text-2xl text-brand-dark-text-secondary mb-10 max-w-2xl mx-auto">
            {tagline}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {user ? (
              <Button href="/tasks" size="lg" variant="primary" rightIcon={<TrendingUp size={20}/>}>
                Go to My Tasks
              </Button>
            ) : (
              <>
                <Button href="/signup" size="lg" variant="primary" rightIcon={<UserCircle size={20}/>}>
                  Get Started Free
                </Button>
                <Button href="/login" size="lg" variant="outline">
                  Log In
                </Button>
              </>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 md:mb-16 text-brand-light-text-primary dark:text-brand-dark-text-primary">
            Everything You Need, Nothing You Don't.
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="flex flex-col hover:border-brand-accent-blue/70 transition-all duration-subtle ease-apple transform hover:-translate-y-1 group"
              >
                <CardHeader className="items-center text-center pt-8">
                  <feature.icon className="w-12 h-12 text-brand-accent-blue mb-4 group-hover:scale-110 transition-transform duration-subtle ease-apple" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-sm flex-grow">
                  <p className="text-brand-light-text-secondary dark:text-brand-dark-text-secondary">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action (Example) */}
        {!user && (
          <section className="text-center bg-brand-dark-surface rounded-xl p-8 md:p-12 shadow-subtle-lg border border-brand-dark-border">
            <h2 className="text-3xl font-semibold text-brand-dark-text-primary mb-4">
              Ready to Conquer Your Tasks?
            </h2>
            <p className="text-brand-dark-text-secondary mb-8 max-w-xl mx-auto">
              Join {appName} today and transform the way you manage your work and life. 
              It's free to get started!
            </p>
            <Button href="/signup" size="lg" variant="primary" className="bg-gradient-to-r from-brand-accent-orange to-brand-accent-blue hover:from-brand-accent-orange/90 hover:to-brand-accent-blue/90 dark:bg-gradient-none dark:bg-brand-accent-blue-darkBg dark:hover:bg-brand-accent-blue-darkBg/90">
              Sign Up Now & Boost Productivity
            </Button>
          </section>
        )}
      </div>
  );
}

