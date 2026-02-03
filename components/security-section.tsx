"use client"

import { Card } from "@/components/ui/card"
import { Shield, Lock, UserCheck, Eye, AlertTriangle } from "lucide-react"

export function SecuritySection() {
  const features = [
    {
      icon: Shield,
      title: "Verified Authentication System",
      description: "Secure platform accessible only to SJA Jeju students",
      color: "text-[#6B8E7F]",
      bgColor: "bg-[#6B8E7F]/15"
    },
    {
      icon: Lock,
      title: "100% Anonymity Guaranteed",
      description: "Share your concerns completely anonymously if you choose",
      color: "text-[#B88B7F]",
      bgColor: "bg-[#B88B7F]/15"
    },
    {
      icon: UserCheck,
      title: "Participation Settings",
      description: "Customized communication spaces by grade and gender",
      color: "text-[#D4A574]",
      bgColor: "bg-[#D4A574]/15"
    },
    {
      icon: Eye,
      title: "Public/Private Options",
      description: "Choose whether to share publicly or keep admin-only",
      color: "text-[#9B8E7F]",
      bgColor: "bg-[#9B8E7F]/15"
    },
    {
      icon: AlertTriangle,
      title: "Inappropriate Language Detection",
      description: "AI automatically detects and warns about inappropriate content",
      color: "text-[#B88B7F]",
      bgColor: "bg-[#B88B7F]/15"
    }
  ]

  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">Security & Privacy</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          A Safe and Trustworthy Space
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We provide comprehensive security and privacy protection<br />
          so students can comfortably share concerns and receive support
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.slice(0, 3).map((feature, index) => (
          <Card 
            key={index} 
            className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30"
          >
            <div className={`p-4 ${feature.bgColor} rounded-2xl w-fit mb-4`}>
              <feature.icon className={`h-8 w-8 ${feature.color}`} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {feature.title}
            </h3>
            <p className="text-muted-foreground">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
        {features.slice(3).map((feature, index) => (
          <Card 
            key={index} 
            className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30"
          >
            <div className={`p-4 ${feature.bgColor} rounded-2xl w-fit mb-4`}>
              <feature.icon className={`h-8 w-8 ${feature.color}`} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {feature.title}
            </h3>
            <p className="text-muted-foreground">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-10 p-6 bg-gradient-to-r from-accent/30 to-secondary/50 rounded-2xl border-2 border-primary/20 max-w-4xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-full flex-shrink-0">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-foreground mb-2">
              Connection with Professional Counselors
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              Issues that are difficult for student administrators to resolve are immediately connected with the school's professional counseling staff. 
              We take your concerns seriously and strive to provide the best possible support.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

