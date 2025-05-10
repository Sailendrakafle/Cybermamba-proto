'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SecurityTip {
  id: number;
  title: string;
  description: string;
  category: string;
}

const securityTips: SecurityTip[] = [
  {
    id: 1,
    title: "Update Your Software Regularly",
    description: "Keep your operating system, browsers, and apps updated to protect against the latest security vulnerabilities.",
    category: "general"
  },
  {
    id: 2,
    title: "Use Strong, Unique Passwords",
    description: "Create complex passwords with a mix of letters, numbers, and symbols. Never reuse passwords across different sites.",
    category: "password"
  },
  {
    id: 3,
    title: "Enable Two-Factor Authentication",
    description: "Add an extra layer of security to your accounts by requiring a second form of verification beyond just your password.",
    category: "account"
  },
  {
    id: 4,
    title: "Be Careful What You Click",
    description: "Don't click on suspicious links in emails or messages, even if they appear to come from someone you know.",
    category: "general"
  },
  {
    id: 5,
    title: "Secure Your Home Network",
    description: "Use WPA3 encryption for your WiFi and change default router passwords to protect your connected devices.",
    category: "network"
  }
];

export function SecurityTips() {
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);
  
  useEffect(() => {
    // Rotate through security tips every 10 seconds
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % securityTips.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const currentTip = securityTips[currentTipIndex];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Tip</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <h3>{currentTip.title}</h3>
          <p>{currentTip.description}</p>
        </div>
        <div>
          <span>Tip {currentTipIndex + 1}/{securityTips.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}
