import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLogin } from "./useLogin";
import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "cn";

interface LoginFormProps {
  onSuccess?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const {
    step,
    identifier,
    setIdentifier,
    otp,
    otpStatus,
    loading,
    errorMessage,
    successMessage,
    countdown,
    canResend,
    otpInputsRef,
    handleRequestOtp,
    handleOtpChange,
    handleOtpKeyDown,
    handleVerifyOtp,
    handleResendOtp,
    handleEditIdentifier,
    fillTestCredentials,
    handleGoogleLogin,
    resetOtpToIdle,
    testBypass,
  } = useLogin({ onSuccess });

  // Classy light yellow button styling with white text
  const classyYellowBtnClasses =
    "w-full h-11 rounded-xl bg-[#E8B931] hover:bg-[#D8A721] active:bg-[#C59619] text-white font-semibold text-base shadow-sm hover:shadow transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header - Dynamically updates just like the video demo */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground transition-all">
          {step === "IDENTIFIER" && "Welcome to Sofiy AI HR"}
          {step === "OTP" && otpStatus === "success" && (
            <span className="text-white animate-badge-pop inline-block">
              Verified successfully
            </span>
          )}
          {step === "OTP" && otpStatus === "failure" && (
            <span className="text-rose-400 animate-otp-shake inline-block">
              Verification failed
            </span>
          )}
          {step === "OTP" && (otpStatus === "idle" || otpStatus === "verifying") && (
            "Let's verify your code"
          )}
          {step === "SUCCESS" && "Welcome back!"}
        </h2>

        <p className="text-sm text-muted-foreground transition-all">
          {step === "IDENTIFIER" &&
            "Enter your mobile number or email to receive a secure login code."}
          {step === "OTP" && otpStatus === "success" && (
            <span className="text-zinc-300">
              Your credentials have been verified.
            </span>
          )}
          {step === "OTP" && otpStatus === "failure" && (
            <span className="text-zinc-300">
              Incorrect code. Click the red icon or below to retry.
            </span>
          )}
          {step === "OTP" && (otpStatus === "idle" || otpStatus === "verifying") && (
            <span>
              We've sent a 6-digit code to{" "}
              <strong className="text-foreground font-medium">
                {identifier}
              </strong>
              . It'll auto-verify once entered.
            </span>
          )}
          {step === "SUCCESS" && "You have successfully signed in."}
        </p>
      </div>

      {/* Status Alerts */}
      {errorMessage && otpStatus === "idle" && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-lg animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && otpStatus === "idle" && (
        <div className="flex items-center gap-2 p-3 text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* STEP 1: Phone or Email Form */}
      {step === "IDENTIFIER" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRequestOtp();
          }}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="identifier"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between"
            >
              <span>Mobile Number or Email</span>
            </label>

            <div className="relative">
              <Input
                id="identifier"
                type="text"
                placeholder="e.g. 9876543210 or sofiy@testmail.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={loading}
                autoFocus
                className="h-11 rounded-xl px-4 text-base focus-visible:ring-[#E8B931]/30 focus-visible:border-[#E8B931]"
              />
            </div>
          </div>

          {/* Test Bypass Quick Fill Pills */}
          <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 p-3 rounded-xl space-y-2">
            <div className="text-xs font-medium text-amber-900 dark:text-amber-200">
              ⚡ Test Bypass Credentials (Click to fill):
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillTestCredentials("mobile")}
                className="h-7 text-xs bg-white dark:bg-zinc-800 border-amber-200 dark:border-amber-800/60 hover:border-amber-400 px-2.5 rounded-md text-amber-900 dark:text-amber-200 font-mono transition-colors cursor-pointer"
              >
                📱 {testBypass.mobile}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillTestCredentials("email")}
                className="h-7 text-xs bg-white dark:bg-zinc-800 border-amber-200 dark:border-amber-800/60 hover:border-amber-400 px-2.5 rounded-md text-amber-900 dark:text-amber-200 font-mono transition-colors cursor-pointer"
              >
                ✉️ {testBypass.email}
              </Button>
            </div>
          </div>

          {/* Classy Light Yellow Submit Button */}
          <Button
            type="submit"
            disabled={loading || !identifier.trim()}
            className={classyYellowBtnClasses}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Sending Code...
              </span>
            ) : (
              "Continue"
            )}
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#07090e] px-3 text-muted-foreground font-medium rounded-md">
                or continue with
              </span>
            </div>
          </div>

          {/* Continue with Google Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-11 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-medium flex items-center justify-center gap-3 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>
        </form>
      )}

      {/* STEP 2: 6-Digit OTP Form - Collapse into Centered Square Animation (Exact Match to Video) */}
      {step === "OTP" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerifyOtp();
          }}
          className="space-y-6"
        >
          {/* Change Identifier link */}
          <div className="flex items-center justify-between text-xs bg-muted/40 p-2.5 rounded-lg border border-border">
            <span className="truncate text-muted-foreground">
              Code sent to:{" "}
              <strong className="text-foreground">{identifier}</strong>
            </span>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={handleEditIdentifier}
              className="h-auto p-0 text-xs text-[#E8B931] hover:underline font-semibold flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" /> Change
            </Button>
          </div>

          {/* Morphing OTP Container: 6 boxes when typing -> collapses into 1 centered square on success/failure */}
          <div className="relative min-h-[72px] flex items-center justify-center my-3">
            {/* STATE 1: 6 Individual Input Boxes with Golden/Amber Active Border (As shown in video) */}
            {(otpStatus === "idle" || otpStatus === "verifying") && (
              <div className="flex justify-center items-center gap-2 sm:gap-2.5 transition-all duration-300">
                {otp.map((digit, index) => {
                  const isFilled = Boolean(digit);
                  return (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputsRef.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      disabled={loading || otpStatus === "verifying"}
                      className={cn(
                        "w-11 sm:w-12 h-14 text-center text-xl sm:text-2xl font-bold rounded-2xl border bg-zinc-900/90 text-white outline-none transition-all duration-200",
                        isFilled
                          ? "border-[#E8B931] shadow-[0_0_14px_rgba(232,185,49,0.3)] ring-1 ring-[#E8B931]/40"
                          : "border-white/10 hover:border-white/20",
                        "focus:border-[#E8B931] focus:shadow-[0_0_18px_rgba(232,185,49,0.4)] focus:ring-1 focus:ring-[#E8B931]"
                      )}
                    />
                  );
                })}
              </div>
            )}

            {/* STATE 2: Success Collapsed Centered Green Square with Animated White Checkmark (Exact Match to Video 00:00-00:01) */}
            {otpStatus === "success" && (
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.6),0_0_12px_rgba(16,185,129,0.4)] animate-badge-pop transition-all">
                <svg
                  className="w-8 h-8 text-white drop-shadow-md"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" className="animate-check-draw" />
                </svg>
              </div>
            )}

            {/* STATE 3: Failure Collapsed Centered Red Square with Shake Animation & X (Exact Match to Video) */}
            {otpStatus === "failure" && (
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={resetOtpToIdle}
                      role="button"
                      tabIndex={0}
                      aria-label="Click to retry"
                      className="w-16 h-16 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-[0_0_35px_rgba(244,63,94,0.6),0_0_12px_rgba(244,63,94,0.4)] animate-otp-shake cursor-pointer group transition-all"
                    >
                      <svg
                        className="w-8 h-8 text-white drop-shadow-md animate-badge-pop"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Click to retry
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {/* Subtext - Matching Video: "Didn't receive the code? Resend" */}
          <div className="text-center text-xs text-muted-foreground pt-1">
            {otpStatus === "success" ? (
              <p className="text-xs text-emerald-400 font-medium animate-pulse">
                Redirecting to your dashboard...
              </p>
            ) : otpStatus === "failure" ? (
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={resetOtpToIdle}
                className="h-auto p-0 text-xs text-rose-400 hover:underline font-semibold cursor-pointer"
              >
                Click the red icon or here to retry
              </Button>
            ) : !canResend ? (
              <span>Didn't receive the code? Resend in {countdown}s</span>
            ) : (
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={handleResendOtp}
                disabled={loading || otpStatus !== "idle"}
                className="h-auto p-0 text-xs text-[#E8B931] hover:underline font-semibold cursor-pointer"
              >
                Didn't receive the code? <span className="underline font-bold">Resend</span>
              </Button>
            )}
          </div>

          {/* Manual Verify Button (shown when idle for accessibility) */}
          {otpStatus === "idle" && (
            <Button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className={classyYellowBtnClasses}
            >
              Verify & Login
            </Button>
          )}

          {/* Back button */}
          <Button
            type="button"
            variant="ghost"
            onClick={handleEditIdentifier}
            disabled={otpStatus !== "idle"}
            className="w-full text-muted-foreground hover:text-foreground text-sm cursor-pointer"
          >
            Use a different phone or email
          </Button>
        </form>
      )}

      {/* STEP 3: Success State */}
      {step === "SUCCESS" && (
        <div className="text-center space-y-5 py-4">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.4)] border border-emerald-500/40 animate-badge-pop">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">
              Authentication Complete
            </h3>
            <p className="text-sm text-muted-foreground">
              You are now authenticated as {identifier}
            </p>
          </div>
          <Button
            type="button"
            onClick={handleEditIdentifier}
            className={classyYellowBtnClasses}
          >
            Sign Out / Switch Account
          </Button>
        </div>
      )}
    </div>
  );
};
export default LoginForm;
