import { Link, useNavigate } from "react-router";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import { useForgetPasswordMutation } from "../../Redux/feature/auth";
import PhoneOrEmailInput from "../../components/common/PhoneOrEmailInput";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const identifier = form.get("phone_or_email") || form.get("email");
    const isEmail = identifier.includes("@");

    try {
        await forgetPassword({
            phone_or_email: identifier,
            type: isEmail ? "email" : "phone"
        }).unwrap();
        
        localStorage.setItem("email", identifier);
        toast.success(`OTP sent to your ${isEmail ? "email" : "phone"} successfully!`);
        navigate("/verify-code");
    } catch (error) {
        toast.error(error?.data?.error || "Failed to send OTP");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl items-center justify-center">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <Link
            to="/login"
            className="mb-8 inline-flex items-center gap-1 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-500 transition hover:bg-blue-100"
          >
            <FiArrowLeft className="text-sm" />
            Back
          </Link>

          <header className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold leading-none tracking-tight">
              <span className="text-blue-500">Jensa</span>{" "}
              <span className="text-slate-800">Group</span>
            </h1>

            <h2 className="mt-5 text-3xl font-bold text-slate-800 sm:text-4xl">
              Forgot your password?
            </h2>

            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-slate-500 sm:text-base">
              Don&apos;t worry, happens to all of us. Enter your email or phone number below to recover your password
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <PhoneOrEmailInput
              name="phone_or_email"
              label="Email or Phone"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-blue-500 px-5 py-3 text-lg font-semibold text-white shadow-sm transition hover:bg-blue-600 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword;