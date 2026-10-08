import "./phone-back.css";

/** Apple's original Store photograph; CSS crops only the foreground rear. */
export default function PhoneBack() {
  return <div className="phone-back" aria-hidden="true"><img src="/device/iphone-18-pro-burgundy-rear-source.jpg" alt="" width="1880" height="2224" fetchPriority="high" decoding="async" /></div>;
}
