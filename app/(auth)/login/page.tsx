'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSendOTP, useVerifyOTP } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');

  const sendOTP = useSendOTP();
  const verifyOTP = useVerifyOTP();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mobile.length < 10) {
      toast.error('Please enter a valid mobile number');
      return;
    }

    try {
      await sendOTP.mutateAsync({ mobile, role: 'fan' });
      toast.success('OTP sent successfully');
      setStep('otp');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 4) {
      toast.error('Please enter a valid 4-digit OTP');
      return;
    }

    try {
      await verifyOTP.mutateAsync({ mobile, otp, role: 'fan' });
      toast.success('Login successful!');
      router.push('/feed');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome to Zexy</CardTitle>
          <CardDescription className="text-center">
            {step === 'phone' ? 'Enter your mobile number to continue' : 'Enter the OTP sent to your phone'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={sendOTP.isPending}
                  className="text-lg"
                />
              </div>
              <Button type="submit" className="w-full" disabled={sendOTP.isPending}>
                {sendOTP.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  disabled={verifyOTP.isPending}
                  className="text-lg text-center tracking-widest"
                  maxLength={4}
                />
                <p className="text-sm text-muted-foreground text-center">
                  OTP sent to {mobile}
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={verifyOTP.isPending}>
                {verifyOTP.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setStep('phone')}
                disabled={verifyOTP.isPending}
              >
                Change Number
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
