"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, RefreshCw, Shield, ShieldCheck, ShieldX, Key, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState([12]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOpeningAnimation, setShowOpeningAnimation] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showGenerationEffect, setShowGenerationEffect] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Hide opening animation after 2 seconds
    const timer = setTimeout(() => {
      setShowOpeningAnimation(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const generatePassword = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setShowGenerationEffect(true);
    
    // Simulate generation progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 20;
      });
    }, 100);

    // Clear previous password with animation
    setPassword("");
    setPasswordStrength(0);
    
    try {
      const response = await fetch('/api/generate-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          length: passwordLength[0],
          includeUppercase,
          includeLowercase,
          includeNumbers,
          includeSymbols,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate password');
      }

      const data = await response.json();
      
      // Complete progress
      setGenerationProgress(100);
      
      // Animate password appearance
      setTimeout(() => {
        setPassword(data.password);
        calculatePasswordStrength(data.password);
        setShowGenerationEffect(false);
        setIsGenerating(false);
        setGenerationProgress(0);
        
        // Success animation
        toast({
          title: "Password generated successfully!",
          description: `Created a ${data.password.length}-character password`,
        });
      }, 500);
      
    } catch (error) {
      // Fallback to client-side generation if backend fails
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      setTimeout(() => {
        const generatedPassword = generatePasswordClient();
        setPassword(generatedPassword);
        calculatePasswordStrength(generatedPassword);
        setShowGenerationEffect(false);
        setIsGenerating(false);
        setGenerationProgress(0);
        
        toast({
          title: "Backend unavailable",
          description: "Using client-side password generation",
          variant: "destructive",
        });
      }, 500);
    }
  };

  const generatePasswordClient = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let charset = "";
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset === "") {
      toast({
        title: "No character types selected",
        description: "Please select at least one character type",
        variant: "destructive",
      });
      return "";
    }

    let generatedPassword = "";
    for (let i = 0; i < passwordLength[0]; i++) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return generatedPassword;
  };

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    
    // Length contributes to strength
    strength += Math.min(pwd.length / 4, 25);
    
    // Character variety
    if (/[a-z]/.test(pwd)) strength += 15;
    if (/[A-Z]/.test(pwd)) strength += 15;
    if (/[0-9]/.test(pwd)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 20;
    
    // Bonus for length over 12
    if (pwd.length > 12) strength += 10;
    
    setPasswordStrength(Math.min(strength, 100));
  };

  const copyToClipboard = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      setIsCopied(true);
      
      // Reset copy state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      
      toast({
        title: "Password copied!",
        description: "Password has been copied to clipboard",
      });
      
      // Create floating copy animation
      createCopyAnimation();
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy password to clipboard",
        variant: "destructive",
      });
    }
  };

  const createCopyAnimation = () => {
    // Create temporary floating elements
    const button = document.querySelector('[data-copy-button]');
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.className = 'fixed w-2 h-2 bg-green-500 rounded-full pointer-events-none z-50';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      
      document.body.appendChild(particle);
      
      const angle = (i * 60) * Math.PI / 180;
      const distance = 50;
      const endX = centerX + Math.cos(angle) * distance;
      const endY = centerY + Math.sin(angle) * distance;
      
      particle.animate([
        { 
          transform: 'translate(0, 0) scale(1)', 
          opacity: 1 
        },
        { 
          transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`, 
          opacity: 0 
        }
      ], {
        duration: 600,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }).addEventListener('finish', () => {
        particle.remove();
      });
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500";
    if (passwordStrength < 60) return "bg-yellow-500";
    if (passwordStrength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Fair";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  const getStrengthIcon = () => {
    if (passwordStrength < 30) return <ShieldX className="w-4 h-4 text-red-500" />;
    if (passwordStrength < 60) return <Shield className="w-4 h-4 text-yellow-500" />;
    if (passwordStrength < 80) return <Shield className="w-4 h-4 text-blue-500" />;
    return <ShieldCheck className="w-4 h-4 text-green-500" />;
  };

  return (
    <AnimatePresence mode="wait">
      {showOpeningAnimation ? (
        <motion.div
          key="opening"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            filter: "blur(10px)"
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50"
        >
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400 dark:bg-blue-300 rounded-full opacity-30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Main animation container */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              exit={{ 
                scale: 0,
                rotate: -360,
                opacity: 0
              }}
              transition={{ 
                duration: 1.5, 
                ease: "easeInOut",
                exit: { duration: 0.8 }
              }}
              className="relative z-10"
            >
              {/* Animated rings */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 0.3, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-32 h-32 border-4 border-blue-300 dark:border-blue-500 rounded-full absolute -top-4 -left-4" />
                <div className="w-40 h-40 border-2 border-purple-300 dark:border-purple-500 rounded-full absolute -top-8 -left-8" />
                <div className="w-48 h-48 border border-indigo-300 dark:border-indigo-500 rounded-full absolute -top-12 -left-12" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-col items-center relative z-20"
              >
                {/* Animated lock icon */}
                <motion.div
                  initial={{ scale: 0, rotateY: 0 }}
                  animate={{ scale: 1, rotateY: 360 }}
                  exit={{ 
                    scale: 0,
                    rotateY: -360,
                    opacity: 0
                  }}
                  transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                  className="mb-6"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Lock className="w-24 h-24 text-blue-600 dark:text-blue-400 drop-shadow-lg" />
                  </motion.div>
                </motion.div>

                {/* Animated title */}
                <motion.h1
                  initial={{ y: 50, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ 
                    y: -50, 
                    opacity: 0, 
                    scale: 0.8 
                  }}
                  transition={{ delay: 1, duration: 0.8, type: "spring", stiffness: 100 }}
                  className="text-4xl font-bold text-gray-800 dark:text-white text-center mb-2"
                >
                  Password Generator
                </motion.h1>

                {/* Animated subtitle */}
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ delay: 1.3, duration: 0.6 }}
                  className="text-gray-600 dark:text-gray-300 text-center"
                >
                  Secure • Fast • Reliable
                </motion.p>

                {/* Loading progress bar */}
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="mt-6 h-1 bg-blue-200 dark:bg-blue-700 rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    exit={{ width: "0%" }}
                    transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ 
            opacity: 0,
            y: -50,
            scale: 0.95
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 p-4 relative overflow-hidden"
        >
          {/* Page transition overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 pointer-events-none"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-300 dark:bg-purple-500 rounded-full opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -50, 0],
                  x: [0, Math.random() * 40 - 20, 0],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="container mx-auto max-w-2xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="pt-8 pb-16"
            >
              {/* Rest of the main content remains the same */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                  className="inline-block p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-xl mb-4 border border-purple-200 dark:border-purple-700"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Key className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                </motion.div>
                
                <motion.h1
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                  className="text-4xl font-bold text-gray-800 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  Password Generator
                </motion.h1>
                
                <motion.p
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-gray-600 dark:text-gray-300"
                >
                  Generate strong, secure passwords with customizable options
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30, rotateX: 15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.5, duration: 0.7, type: "spring" }}
                whileHover={{ y: -5 }}
                className="transform-gpu"
              >
                <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                  <CardHeader className="space-y-4">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                        Generated Password
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Your secure password will appear here
                      </CardDescription>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Password Display */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="space-y-2 relative"
                    >
                      <Label htmlFor="password" className="text-sm font-medium">Generated Password</Label>
                      <div className="flex gap-2">
                        <motion.div
                          className="flex-1 relative"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Input
                            id="password"
                            value={password}
                            readOnly
                            placeholder="Click generate to create a password"
                            className="font-mono text-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                          />
                          
                          {/* Generation Effect Overlay */}
                          <AnimatePresence>
                            {showGenerationEffect && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-md border border-blue-300/50 dark:border-purple-500/50 flex items-center justify-center"
                              >
                                <div className="text-center space-y-2">
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-8 h-8 mx-auto"
                                  >
                                    <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                  </motion.div>
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                    className="w-32 h-1 bg-blue-200 dark:bg-blue-700 rounded-full overflow-hidden mx-auto"
                                  >
                                    <motion.div
                                      initial={{ width: "0%" }}
                                      animate={{ width: `${generationProgress}%` }}
                                      transition={{ duration: 0.3 }}
                                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                    />
                                  </motion.div>
                                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                    Generating secure password...
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          {/* Character typing animation */}
                          <AnimatePresence>
                            {password && !showGenerationEffect && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 pointer-events-none flex items-center justify-center"
                              >
                                <div className="flex space-x-1">
                                  {password.split('').map((char, index) => (
                                    <motion.span
                                      key={index}
                                      initial={{ 
                                        opacity: 0, 
                                        y: 20, 
                                        rotateX: 90,
                                        scale: 0.8
                                      }}
                                      animate={{ 
                                        opacity: 1, 
                                        y: 0, 
                                        rotateX: 0,
                                        scale: 1
                                      }}
                                      transition={{ 
                                        delay: index * 0.03, 
                                        duration: 0.3, 
                                        type: "spring",
                                        stiffness: 200
                                      }}
                                      className="font-mono text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                                    >
                                      {char}
                                    </motion.span>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={copyToClipboard}
                            disabled={!password || showGenerationEffect}
                            className="border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors relative overflow-hidden"
                            data-copy-button
                          >
                            <AnimatePresence mode="wait">
                              {isCopied ? (
                                <motion.div
                                  key="copied"
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 180 }}
                                  transition={{ duration: 0.3, type: "spring" }}
                                  className="flex items-center justify-center w-full h-full"
                                >
                                  <motion.div
                                    animate={{
                                      scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                      duration: 0.6,
                                      repeat: 1,
                                      ease: "easeInOut",
                                    }}
                                  >
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                  </motion.div>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="copy"
                                  initial={{ scale: 0, rotate: 180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: -180 }}
                                  transition={{ duration: 0.3, type: "spring" }}
                                  className="flex items-center justify-center w-full h-full"
                                >
                                  <Copy className="w-4 h-4" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                            
                            {/* Success ripple effect */}
                            <AnimatePresence>
                              {isCopied && (
                                <motion.div
                                  className="absolute inset-0 bg-green-500/20 rounded-md"
                                  initial={{ scale: 0, opacity: 0.8 }}
                                  animate={{ scale: 1.5, opacity: 0 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                              )}
                            </AnimatePresence>
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Password Strength */}
                    {password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="space-y-3"
                      >
                        <Label className="flex items-center gap-2 text-sm font-medium">
                          <motion.div
                            key={passwordStrength}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.5, type: "spring" }}
                          >
                            {getStrengthIcon()}
                          </motion.div>
                          <motion.span
                            key={`strength-label-${passwordStrength}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            Password Strength: {getStrengthLabel()}
                          </motion.span>
                        </Label>
                        
                        {/* Animated Progress Bar */}
                        <div className="relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                          >
                            <motion.div
                              key={`strength-progress-${passwordStrength}`}
                              initial={{ width: "0%" }}
                              animate={{ width: `${passwordStrength}%` }}
                              transition={{ 
                                duration: 1, 
                                ease: "easeOut",
                                type: "spring",
                                stiffness: 100
                              }}
                              className={`h-full rounded-full relative overflow-hidden ${getStrengthColor()}`}
                            >
                              {/* Shimmer effect */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ 
                                  duration: 1.5, 
                                  repeat: Infinity, 
                                  ease: "linear",
                                  repeatDelay: 0.5
                                }}
                                style={{ width: "50%" }}
                              />
                            </motion.div>
                          </motion.div>
                          
                          {/* Strength indicators */}
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <motion.span
                              animate={{ 
                                color: passwordStrength < 30 ? "#ef4444" : "#6b7280"
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              Weak
                            </motion.span>
                            <motion.span
                              animate={{ 
                                color: passwordStrength >= 80 ? "#22c55e" : "#6b7280"
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              Strong
                            </motion.span>
                          </div>
                        </div>
                        
                        {/* Strength Details */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="grid grid-cols-2 gap-2"
                        >
                          {[
                            { label: "Length", value: password.length, target: Math.min(password.length / 4 * 25, 25) },
                            { label: "Variety", value: Math.floor((passwordStrength - Math.min(password.length / 4, 25)) / 65 * 100), target: 65 },
                          ].map((item, index) => (
                            <motion.div
                              key={item.label}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                            >
                              <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                              <motion.span
                                key={`${item.label}-${item.value}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3, type: "spring" }}
                                className="text-xs font-medium text-gray-800 dark:text-gray-200"
                              >
                                {item.value}%
                              </motion.span>
                            </motion.div>
                          ))}
                        </motion.div>
                        
                        {/* Animated strength particles */}
                        <div className="relative h-8">
                          <AnimatePresence>
                            {passwordStrength > 70 && (
                              <motion.div
                                key="strong-particles"
                                className="absolute inset-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                {[...Array(5)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-green-500 rounded-full"
                                    style={{
                                      left: `${20 + i * 15}%`,
                                      top: "50%",
                                    }}
                                    animate={{
                                      y: [0, -10, 0],
                                      opacity: [0, 1, 0],
                                      scale: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      delay: i * 0.3,
                                      ease: "easeInOut",
                                    }}
                                  />
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                      className="origin-left"
                    >
                      <Separator />
                    </motion.div>

                    {/* Password Options */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Password Options</h3>
                      
                      {/* Length Slider */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Password Length: {passwordLength[0]}</Label>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <Slider
                            value={passwordLength}
                            onValueChange={setPasswordLength}
                            max={32}
                            min={4}
                            step={1}
                            className="w-full"
                          />
                        </motion.div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>4</span>
                          <span>32</span>
                        </div>
                      </div>

                      {/* Character Types */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Character Types</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: "uppercase", label: "Uppercase (A-Z)", checked: includeUppercase, setChecked: setIncludeUppercase },
                            { id: "lowercase", label: "Lowercase (a-z)", checked: includeLowercase, setChecked: setIncludeLowercase },
                            { id: "numbers", label: "Numbers (0-9)", checked: includeNumbers, setChecked: setIncludeNumbers },
                            { id: "symbols", label: "Symbols (!@#$%)", checked: includeSymbols, setChecked: setIncludeSymbols },
                          ].map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                              whileHover={{ 
                                scale: 1.02, 
                                x: 5,
                                backgroundColor: "rgba(59, 130, 246, 0.05)"
                              }}
                              whileFocus={{ 
                                scale: 1.02, 
                                x: 5,
                                backgroundColor: "rgba(59, 130, 246, 0.1)"
                              }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  item.setChecked(!item.checked);
                                }
                              }}
                            >
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Checkbox
                                  id={item.id}
                                  checked={item.checked}
                                  onCheckedChange={item.setChecked}
                                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                />
                              </motion.div>
                              <Label 
                                htmlFor={item.id} 
                                className="text-sm cursor-pointer select-none"
                              >
                                {item.label}
                              </Label>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* Generate Button */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.4, duration: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={generatePassword}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                        size="lg"
                      >
                        <AnimatePresence mode="wait">
                          {isGenerating ? (
                            <motion.div
                              key="generating"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center justify-center w-full"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="flex items-center"
                              >
                                <RefreshCw className="w-5 h-5 mr-2" />
                              </motion.div>
                              <span>Generating...</span>
                              
                              {/* Animated dots */}
                              <motion.div className="flex space-x-1 ml-2">
                                {[...Array(3)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-1 h-1 bg-white rounded-full"
                                    animate={{
                                      scale: [1, 1.5, 1],
                                      opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                      duration: 1.4,
                                      repeat: Infinity,
                                      delay: i * 0.2,
                                    }}
                                  />
                                ))}
                              </motion.div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="generate"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              whileHover={{ scale: 1.05 }}
                              className="flex items-center justify-center w-full"
                            >
                              <motion.div
                                animate={{
                                  rotate: [0, 15, -15, 0],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              >
                                <RefreshCw className="w-5 h-5 mr-2" />
                              </motion.div>
                              Generate Password
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* Button ripple effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"
                          initial={{ x: "-100%" }}
                          animate={{ x: isGenerating ? "100%" : "-100%" }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          style={{ opacity: 0.3 }}
                        />
                      </Button>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.6, duration: 0.6 }}
                      className="flex gap-2 flex-wrap justify-center"
                    >
                      {[
                        { label: "Strong Password", length: 16, symbols: true, color: "from-green-500 to-emerald-500" },
                        { label: "Simple Password", length: 8, symbols: false, color: "from-blue-500 to-cyan-500" },
                        { label: "Very Strong", length: 20, symbols: true, color: "from-purple-500 to-pink-500" },
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ 
                            scale: 1, 
                            rotate: 0,
                            boxShadow: ["0 4px 6px -1px rgba(0, 0, 0, 0.1)", "0 10px 15px -3px rgba(0, 0, 0, 0.1)", "0 4px 6px -1px rgba(0, 0, 0, 0.1)"]
                          }}
                          transition={{ 
                            delay: 1.8 + index * 0.2, 
                            type: "spring", 
                            stiffness: 200,
                            boxShadow: {
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }}
                          whileHover={{ 
                            scale: 1.08, 
                            y: -3,
                            rotate: 1,
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                          }}
                          whileFocus={{ 
                            scale: 1.05, 
                            y: -2,
                            rotate: 0
                          }}
                          whileTap={{ 
                            scale: 0.92, 
                            rotate: -1 
                          }}
                        >
                          <Badge 
                            variant="secondary" 
                            className={`cursor-pointer px-4 py-2 text-sm font-medium bg-gradient-to-r ${item.color} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500 relative overflow-hidden`}
                            onClick={() => {
                              setPasswordLength([item.length]);
                              setIncludeUppercase(true);
                              setIncludeLowercase(true);
                              setIncludeNumbers(true);
                              setIncludeSymbols(item.symbols);
                            }}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setPasswordLength([item.length]);
                                setIncludeUppercase(true);
                                setIncludeLowercase(true);
                                setIncludeNumbers(true);
                                setIncludeSymbols(item.symbols);
                              }
                            }}
                          >
                            {/* Shimmer effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              initial={{ x: "-100%" }}
                              animate={{ x: "100%" }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3,
                                ease: "linear"
                              }}
                              style={{ mixBlendMode: "overlay" }}
                            />
                            <motion.div
                              className="flex items-center gap-1"
                              whileHover={{ gap: "0.375rem" }}
                              transition={{ duration: 0.3 }}
                            >
                              {item.label}
                              <motion.div
                                animate={{ 
                                  scale: [1, 1.1, 1],
                                  opacity: [0.8, 1, 0.8]
                                }}
                                transition={{ 
                                  duration: 2, 
                                  repeat: Infinity, 
                                  ease: "easeInOut" 
                                }}
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            </motion.div>
                          </Badge>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}