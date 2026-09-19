import { useState, useEffect, useRef } from "react";
import { FiMail, FiPhone } from "react-icons/fi";

export const COUNTRY_CODES = [
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+880", country: "BD", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+1", country: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+92", country: "PK", flag: "🇵🇰", name: "Pakistan" },
  { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "+971", country: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+974", country: "QA", flag: "🇶🇦", name: "Qatar" },
  { code: "+965", country: "KW", flag: "🇰🇼", name: "Kuwait" },
  { code: "+968", country: "OM", flag: "🇴🇲", name: "Oman" },
  { code: "+973", country: "BH", flag: "🇧🇭", name: "Bahrain" },
  { code: "+60", country: "MY", flag: "🇲🇾", name: "Malaysia" },
  { code: "+65", country: "SG", flag: "🇸🇬", name: "Singapore" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+31", country: "NL", flag: "🇳🇱", name: "Netherlands" },
  { code: "+46", country: "SE", flag: "🇸🇪", name: "Sweden" },
  { code: "+47", country: "NO", flag: "🇳🇴", name: "Norway" },
  { code: "+41", country: "CH", flag: "🇨🇭", name: "Switzerland" },
  { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "+27", country: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "+20", country: "EG", flag: "🇪🇬", name: "Egypt" },
  { code: "+90", country: "TR", flag: "🇹🇷", name: "Turkey" },
  { code: "+62", country: "ID", flag: "🇮🇩", name: "Indonesia" },
  { code: "+63", country: "PH", flag: "🇵🇭", name: "Philippines" },
  { code: "+84", country: "VN", flag: "🇻🇳", name: "Vietnam" },
  { code: "+66", country: "TH", flag: "🇹🇭", name: "Thailand" },
];

/**
 * PhoneOrEmailInput component provides a seamless dual-mode input
 * for entering either an email address or a phone number with country code selection.
 */
const PhoneOrEmailInput = ({
  name = "phone_or_email",
  value = "",
  onChange,
  label = "Email or Phone",
  placeholderEmail = "example@email.com",
  placeholderPhone = "123 456 7890",
  required = true,
  className = "",
  id = "phone_or_email",
}) => {
  // Determine mode and split pre-filled value if provided
  const parseInitialValue = (val) => {
    if (!val) return { mode: "email", code: "+1", number: "" };
    if (val.includes("@")) {
      return { mode: "email", code: "+1", number: val };
    }
    // Check if starts with +
    if (val.startsWith("+")) {
      const matched = COUNTRY_CODES.find((c) => val.startsWith(c.code));
      if (matched) {
        return {
          mode: "phone",
          code: matched.code,
          number: val.slice(matched.code.length),
        };
      }
    }
    // Fallback if numeric without @
    return { mode: "phone", code: "+1", number: val };
  };

  const initial = parseInitialValue(value);
  const [inputType, setInputType] = useState(initial.mode); // "email" | "phone"
  const [countryCode, setCountryCode] = useState(initial.code); // default US "+1"
  const [textInput, setTextInput] = useState(initial.number);

  const lastValueRef = useRef(value);

  // Synchronize when external value prop changes
  useEffect(() => {
    if (value !== undefined && value !== null && value !== lastValueRef.current) {
      const parsed = parseInitialValue(value);
      setInputType(parsed.mode);
      setCountryCode(parsed.code);
      setTextInput(parsed.number);
      lastValueRef.current = value;
    }
  }, [value]);

  // Compute actual formatted value to submit
  const getFormattedValue = (type = inputType, code = countryCode, text = textInput) => {
    const trimmed = text.trim();
    if (!trimmed) return "";
    if (type === "email") return trimmed;
    // Format phone with country code
    const cleanNumber = trimmed.replace(/^[+\s]+/, "");
    return `${code}${cleanNumber}`;
  };

  const handleTypeToggle = (newType) => {
    setInputType(newType);
    setTextInput("");
    const formatted = getFormattedValue(newType, countryCode, "");
    lastValueRef.current = formatted;
    if (onChange) onChange(formatted);
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setTextInput(val);
    const formatted = getFormattedValue(inputType, countryCode, val);
    lastValueRef.current = formatted;
    if (onChange) onChange(formatted);
  };

  const handleCountryChange = (e) => {
    const newCode = e.target.value;
    setCountryCode(newCode);
    const formatted = getFormattedValue(inputType, newCode, textInput);
    lastValueRef.current = formatted;
    if (onChange) onChange(formatted);
  };

  const formattedOutput = getFormattedValue();

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleTypeToggle("email")}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition ${
              inputType === "email"
                ? "bg-white text-blue-600 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <FiMail className="text-xs" />
            Email
          </button>
          <button
            type="button"
            onClick={() => handleTypeToggle("phone")}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition ${
              inputType === "phone"
                ? "bg-white text-blue-600 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <FiPhone className="text-xs" />
            Phone
          </button>
        </div>
      </div>

      {/* Hidden input to pass value in form submit / FormData */}
      <input type="hidden" name={name} value={formattedOutput} />

      {/* Input container */}
      <div className="relative flex items-center">
        {inputType === "email" ? (
          <>
            <FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
            <input
              id={id}
              type="email"
              value={textInput}
              onChange={handleTextChange}
              placeholder={placeholderEmail}
              required={required}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </>
        ) : (
          <div className="flex w-full items-center rounded-lg border border-slate-200 bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition">
            {/* Country Code Dropdown */}
            <div className="flex items-center border-r border-slate-200 bg-slate-50 px-2 py-1.5 rounded-l-lg">
              <select
                value={countryCode}
                onChange={handleCountryChange}
                aria-label="Select Country Code"
                className="cursor-pointer bg-transparent text-xs font-medium text-slate-700 outline-none"
              >
                {COUNTRY_CODES.map((c, idx) => (
                  <option key={`${c.country}-${c.code}-${idx}`} value={c.code}>
                    {c.flag} {c.code} ({c.country})
                  </option>
                ))}
              </select>
            </div>

            {/* Phone Number Input */}
            <input
              id={id}
              type="tel"
              value={textInput}
              onChange={handleTextChange}
              placeholder={placeholderPhone}
              required={required}
              className="w-full bg-transparent py-2.5 px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneOrEmailInput;
