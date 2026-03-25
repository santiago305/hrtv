    import React from "react";

interface AdPlaceholderProps {
  size: "banner" | "square" | "leaderboard" | "skyscraper" | "rectangle";
  className?: string;
}

const sizeMap: Record<AdPlaceholderProps["size"], string> = {
  banner: "w-full h-[90px]",
  square: "w-[300px] h-[250px]",
  leaderboard: "w-full h-[90px] sm:h-[100px]",
  skyscraper: "w-full max-w-[160px] h-[600px]",
  rectangle: "w-full max-w-[336px] h-[280px]",
};

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ size, className = "" }) => {
  return (
    <div
      className={`flex items-center justify-center border border-dashed border-border bg-surface ${sizeMap[size]} ${className}`}
    >
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        Publicidad
      </span>
    </div>
  );
};