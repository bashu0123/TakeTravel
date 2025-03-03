"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner"
import { IoChevronBackOutline } from "react-icons/io5";
import axios from "axios";

const LoginPage = () => {
  const [firstName, setfirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname();

  


  const handleLogin = async () => {
    setLoading(true);
    try {

      if (!loginEmail || !loginPassword) {
        
        toast.error("Please provide email and password", {
          style: {
            border: "1px solid #713200",
            padding: "16px",
          },
        });
        return;
      }
      const response = await axios.post(
        "http://localhost:8000/users/login",
        { email: loginEmail, password: loginPassword }
      );
      
      toast.success("Login successful. Please wait ...", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
        },
      });

      toast.success("Login successful");

      if (typeof window === "undefined") return;
      localStorage.setItem("take-travel-token", response.data.token);
      localStorage.setItem("take-travel-userId", response.data.data._id);
      setLoginEmail("");
      setLoginPassword("");
      if(response.data.data.role === 'guide'){
        router.push('/guide-dash')
      }
      else if(response.data.data.role === 'admin'){
        router.push('/admin/dashboard')
      }
      else{
        router.push('/')
      }
    
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
        },
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // const handleSignup = async () => {
  //   setLoading(true);
  //   try {
  //     if (!firstName || !email || !password || !confirmPassword || !lastName) {
        
  //     toast.error("Please provide all the fields", {
  //       style: {
  //         border: "1px solid #713200",
  //         padding: "16px",
  //       },
  //     });
  //       return;
  //     }

  //     if (password === confirmPassword) {
        
  //       const response = await axios.post(
  //         "http://localhost:8000/users/signup",
  //         { name:firstName + ' '+ middleName+ ' ' + lastName, email, password,passwordConfirm:confirmPassword,role:'user' }
  //       );
  //       console.log(response);
        
  //     toast.success("Account registered. Please check your email to verify your account.", {
  //       style: {
  //         border: "1px solid #713200",
  //         padding: "16px",
  //       },
  //     });

  //       setfirstName("");
  //       setMiddleName("");
  //       setLastName("");
  //       setEmail("");
  //       setPassword("");
  //       setConfirmPassword("");
  //       return;
  //     }
      
  //     toast.error("Password does not match", {
  //       style: {
  //         border: "1px solid #713200",
  //         padding: "16px",
  //       },
  //     });
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (err: any) {
  //     //(err);
  //     toast.error(err.response?.data?.message || "Signup failed", {
  //       style: {
  //         border: "1px solid #713200",
  //         padding: "16px",
  //       },
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // if (loading) {
  //   return null;
  // }
  const handleSignup = async () => {
    setLoading(true);
    try {
      // Validate Required Fields
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        toast.error("Please provide all fields", {
          style: { border: "1px solid #713200", padding: "16px" },
        });
        return;
      }
  
      // Validate Email Format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address", {
          style: { border: "1px solid #713200", padding: "16px" },
        });
        return;
      }
  
      // Validate Password Length
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long", {
          style: { border: "1px solid #713200", padding: "16px" },
        });
        return;
      }
  
      // Validate Password Match
      if (password !== confirmPassword) {
        toast.error("Passwords do not match", {
          style: { border: "1px solid #713200", padding: "16px" },
        });
        return;
      }
  
      // Construct Full Name (Handle optional middle name)
      const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");

      if (password === confirmPassword) {
        
        const response = await axios.post(
          "http://localhost:8000/users/signup",
          { name:firstName + ' '+ middleName+ ' ' + lastName, email, password,role:'user' }
        );
        console.log(response);
      toast.success("Account registered. Please login to continue.", {
        style: { border: "1px solid #713200", padding: "16px" },
      });
  
      // Reset Form Fields
      setfirstName("");
      setMiddleName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed", {
        style: { border: "1px solid #713200", padding: "16px" },
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="hidden md:block w-full lg:w-2/5 relative overflow-hidden min-h-[300px] lg:min-h-screen bg-[url('/icon/logo.png')] bg-center bg-contain bg-no-repeat max-h-screen">
        <div className="absolute bg-[#EA580C]/10 w-full p-6 lg:p-12 h-full flex flex-col justify-between">

          <div
          onClick={()=>router.push('/')}
          className="flex items-center gap-[20px] cursor-pointer">
          <IoChevronBackOutline /> Return to Home
          </div>
          <div className="text-white">
            <p className="text-gray-800 text-sm lg:text-base">
              © 2025 All Rights Reserved
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-3/5 p-4 lg:p-8 flex flex-col flex-grow max-h-screen overflow-y-auto">
        <div className="max-w-md mx-auto w-full flex-grow flex flex-col justify-center items-center">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#EA580C] mb-2">
            Welcome to Take Travel
          </h1>
          <p className="text-gray-500 mb-8">
            Please login/signup to continue to your account.
          </p>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#ededed] text-[#EA580C]">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card className="border-0 shadow-none">
                <CardContent className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Email"
                      className="border-2 rounded-lg p-3"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Password"
                      className="border-2 rounded-lg p-3"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center gap-[10px]">
                      <Checkbox id="remember" />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Keep me logged in
                      </label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    onClick={handleLogin}
                    className="w-full bg-[#EA580C] text-white hover:bg-[#EA580C]/90 p-6 rounded-lg"
                  >
                    {loading ? 'Loading' : 'Sign In'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border-0 shadow-none">
                <CardContent className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">First Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="First Name"
                      className="border-2 rounded-lg p-3"
                      value={firstName}
                      onChange={(e) => setfirstName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Middle Name">Middle Name</Label>
                    <Input
                      id="signup-middleName"
                      type="text"
                      placeholder="Middle Name"
                      className="border-2 rounded-lg p-3"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Last Name">Last Name</Label>
                    <Input
                      id="signup-lastName"
                      type="text"
                      placeholder="Name"
                      className="border-2 rounded-lg p-3"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Email"
                      className="border-2 rounded-lg p-3"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Password"
                      className="border-2 rounded-lg p-3"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">
                      Confirm Password
                    </Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Confirm Password"
                      className="border-2 rounded-lg p-3"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={terms}
                      onCheckedChange={() => setTerms(!terms)}
                      required
                    />
                    <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      I agree to the{" "}
                      <a
                        target="_blank"
                        href=""
                        className="text-[#EA580C] font-bold"
                      >
                        terms and conditions.
                      </a>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    onClick={handleSignup} disabled={loading}
                    className="w-full bg-[#EA580C] text-white hover:bg-[#EA580C]/90 p-6 rounded-lg"
                  >
                   {loading ? 'Creating Account...' : 'Create an Account'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
