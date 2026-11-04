import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "./useLogin";
import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export const LoginForm: React.FC = () => {
  const {
    step,
    identifier,
    setIdentifier,
    otp,
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
    testBypass,
  } = useLogin();

  // Classy light yellow button styling with white text
  const classyYellowBtnClasses =
    "w-full h-11 rounded-xl bg-[#E8B931] hover:bg-[#D8A721] active:bg-[#C59619] text-white font-semibold text-base shadow-sm hover:shadow transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {step === "IDENTIFIER" && "Welcome to Sofiy AI Tutor"}
          {step === "OTP" && "Verify your identity"}
          {step === "SUCCESS" && "Welcome back!"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {step === "IDENTIFIER" &&
            "Enter your mobile number or email to receive a secure login code."}
          {step === "OTP" && (
            <span>
              Enter the 6-digit code sent to{" "}
              <strong className="text-foreground font-medium">
                {identifier}
              </strong>
            </span>
          )}
          {step === "SUCCESS" && "You have successfully signed in."}
        </p>
      </div>

      {/* Status Alerts */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-lg animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
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
              <button
                type="button"
                onClick={() => fillTestCredentials("mobile")}
                className="text-xs bg-white dark:bg-zinc-800 border border-amber-200 dark:border-amber-800/60 hover:border-amber-400 px-2.5 py-1 rounded-md text-amber-900 dark:text-amber-200 font-mono transition-colors"
              >
                📱 {testBypass.mobile}
              </button>
              <button
                type="button"
                onClick={() => fillTestCredentials("email")}
                className="text-xs bg-white dark:bg-zinc-800 border border-amber-200 dark:border-amber-800/60 hover:border-amber-400 px-2.5 py-1 rounded-md text-amber-900 dark:text-amber-200 font-mono transition-colors"
              >
                ✉️ {testBypass.email}
              </button>
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
              <span className="bg-card px-3 text-muted-foreground font-medium">
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

      {/* STEP 2: 6-Digit OTP Form */}
      {step === "OTP" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerifyOtp();
          }}
          className="space-y-6"
        >
          {/* Edit Identifier Option */}
          <div className="flex items-center justify-between text-xs bg-muted/50 p-2.5 rounded-lg border border-border">
            <span className="truncate text-muted-foreground">
              Code sent to:{" "}
              <strong className="text-foreground">{identifier}</strong>
            </span>
            <button
              type="button"
              onClick={handleEditIdentifier}
              className="text-[#E8B931] hover:underline font-semibold flex items-center gap-1 shrink-0 ml-2"
            >
              <ArrowLeft className="w-3 h-3" /> Change
            </button>
          </div>

          {/* 6 Digit Input Boxes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block text-center">
              Enter 6-Digit Verification Code
            </label>
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
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
                  disabled={loading}
                  className="w-11 sm:w-12 h-13 sm:h-14 text-center text-xl font-bold rounded-xl border border-input bg-card text-foreground focus:border-[#E8B931] focus:ring-2 focus:ring-[#E8B931]/30 outline-none transition-all shadow-xs"
                />
              ))}
            </div>
          </div>

          {/* Resend Timer / Action */}
          <div className="text-center text-xs text-muted-foreground">
            {!canResend ? (
              <span>Resend code in {countdown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-[#E8B931] hover:underline font-semibold cursor-pointer"
              >
                Didn't receive code? Resend OTP
              </button>
            )}
          </div>

          {/* Classy Light Yellow Verify Button */}
          <Button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className={classyYellowBtnClasses}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
              </span>
            ) : (
              "Verify & Login"
            )}
          </Button>

          {/* Back button */}
          <Button
            type="button"
            variant="ghost"
            onClick={handleEditIdentifier}
            className="w-full text-muted-foreground hover:text-foreground text-sm"
          >
            Use a different phone or email
          </Button>
        </form>
      )}

      {/* STEP 3: Success State */}
      {step === "SUCCESS" && (
        <div className="text-center space-y-5 py-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
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
