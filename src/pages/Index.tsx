import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Shield, Users, CheckCircle, Clock, MapPin, DollarSign } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Multi-Modal Transport",
      description: "Choose between truck delivery and train freight for optimal logistics"
    },
    {
      icon: <Clock className="h-8 w-8 text-accent" />,
      title: "Real-Time Tracking",
      description: "Monitor your shipments with live updates and precise delivery estimates"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-success" />,
      title: "Transparent Pricing",
      description: "Get instant quotes with no hidden fees - pay only for what you ship"
    },
    {
      icon: <Shield className="h-8 w-8 text-warning" />,
      title: "Secure & Reliable",
      description: "Professional drivers and secure handling for your peace of mind"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="mx-auto bg-primary p-4 rounded-full w-fit">
                <Truck className="h-12 w-12 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Welcome to <span className="text-primary">CargoStream</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your comprehensive delivery booking platform. Connect customers, manage logistics, 
                and track shipments with our modern, efficient solution.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/register">Get Started Today</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose CargoStream?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Streamline your logistics with our comprehensive platform designed for modern delivery needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Built for Every User</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three dedicated portals designed for different roles in the logistics ecosystem
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Customer Portal</CardTitle>
                <CardDescription>For businesses and individuals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Create and manage bookings
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Real-time shipment tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Instant fare calculations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Delivery history & analytics
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link to="/register">Sign Up as Customer</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-primary/20">
              <CardHeader className="text-center">
                <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit">
                  <Shield className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-2xl">Admin Panel</CardTitle>
                <CardDescription>For platform administrators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Comprehensive dashboard & KPIs
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    User & booking management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Driver assignments & scheduling
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Pricing configuration & reports
                  </li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login">Admin Access</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto bg-accent/10 p-4 rounded-full w-fit">
                  <Truck className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">Dispatcher Portal</CardTitle>
                <CardDescription>For drivers and dispatchers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    View assigned deliveries
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Update delivery status
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    GPS navigation integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Customer communication tools
                  </li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login">Dispatcher Login</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready to Transform Your Logistics?
            </h2>
            <p className="text-xl text-primary-foreground/80">
              Join thousands of businesses already using CargoStream for their delivery needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/register">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link to="/login">Existing User? Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-primary p-2 rounded-lg">
                  <Truck className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">CargoStream</span>
              </div>
              <p className="text-muted-foreground">
                Modern delivery booking platform for efficient logistics management.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/register" className="hover:text-primary">Customer Portal</Link></li>
                <li><Link to="/login" className="hover:text-primary">Admin Panel</Link></li>
                <li><Link to="/login" className="hover:text-primary">Dispatcher Access</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary">Help Center</Link></li>
                <li><Link to="#" className="hover:text-primary">Contact Support</Link></li>
                <li><Link to="#" className="hover:text-primary">API Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary">About Us</Link></li>
                <li><Link to="#" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 mt-8 text-center text-muted-foreground">
            <p>&copy; 2024 CargoStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
