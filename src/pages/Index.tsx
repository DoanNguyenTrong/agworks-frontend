import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { MAP_ROLE } from "@/lib/utils/role";
import { ArrowRight, Grape } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in, redirect to their dashboard
    if (currentUser) {
      switch (currentUser.role) {
        case MAP_ROLE.ADMIN:
          navigate("/admin/dashboard");
          break;
        case MAP_ROLE.CUSTOIMER:
          navigate("/customer/dashboard");
          break;
        case MAP_ROLE.SITE_MANAGER:
          navigate("/manager/dashboard");
          break;
        case MAP_ROLE.WORKER:
          navigate("/worker/dashboard");
          break;
        default:
          break;
      }
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-agworks-green to-agworks-darkGreen text-white">
        <div className="container mx-auto py-12 px-4 md:py-24">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white p-3 rounded-full">
              <Grape className="h-10 w-10 text-agworks-green" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            Vineyard Labor Management Simplified
          </h1>
          <p className="text-xl md:text-2xl text-center mb-8 max-w-3xl mx-auto">
            AgWorks provides a complete solution for tracking, managing, and
            optimizing your vineyard workforce
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-agworks-green hover:bg-gray-100"
              asChild
            >
              <a href="/login">Log In</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-agworks-green hover:bg-white/10"
              asChild
            >
              <a href="/register">Create Account</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comprehensive Labor Management
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Task Tracking</h3>
              <p className="text-muted-foreground">
                Complete visibility of worker tasks with photo evidence and
                real-time progress tracking
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Payroll Management</h3>
              <p className="text-muted-foreground">
                Automated payroll calculations based on piece-rate or hourly
                wages with exportable reports
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Data-Driven Insights
              </h3>
              <p className="text-muted-foreground">
                Productivity analytics and historical data for effective
                workforce planning and cost analysis
              </p>
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">For Vineyard Owners</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary mt-1 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Complete visibility of vineyard operations</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary mt-1 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Reduced administrative burden</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary mt-1 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Labor cost optimization</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary mt-1 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Compliance with labor regulations</span>
                </li>
              </ul>
              <Button className="mt-6" asChild>
                <a href="/register">
                  Register as Vineyard Owner
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">For Field Workers</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary mt-1 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Easy job discovery and application</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary mt-1 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Transparent payment calculations</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary mt-1 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Simple task tracking with your smartphone</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary mt-1 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Secure record of all work completed</span>
                </li>
              </ul>
              <Button className="mt-6" asChild>
                <a href="/register">
                  Register as Field Worker
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to optimize your vineyard operations?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join vineyard owners across the country who are streamlining their
            labor management with AgWorks
          </p>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-gray-100"
            asChild
          >
            <a href="/register">Get Started Today</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-agworks-darkGreen text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Grape className="h-6 w-6 mr-2" />
              <span className="text-xl font-bold">AgWorks</span>
            </div>
            <div className="text-sm">
              &copy; {new Date().getFullYear()} AgWorks. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
