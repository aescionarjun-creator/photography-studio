export default function Logomark({ size = 34 }) {
  return (
    <img
      src="/images/subash-logo.png"
      alt="SUBASH Studio Logo"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "contain",
      }}
    />
  );
}