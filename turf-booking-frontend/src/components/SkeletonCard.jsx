export default function SkeletonCard({ height = 120 }) {
  return (
    <div
      className="skeleton"
      style={{
        height,
        width: "100%",
        marginBottom: "16px",
      }}
    />
  );
}
