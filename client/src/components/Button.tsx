import React from "react";
import {
  ArrowLeft,
  ChevronRight,
  PlusCircle,
  Send,
  Trash2,
  LucideIcon
} from "lucide-react";

const logoMap: Record<string, LucideIcon> = {
  "ArrowLeft": ArrowLeft,
  "ChevronRight": ChevronRight,
  "PlusCircle": PlusCircle,
  "Send": Send,
  "Trash2": Trash2,
};

interface ButtonProps {
  type: "button" | "submit";
  text: string;
  textColor?: string;
  logo?: string;
  color: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  type,
  text,
  textColor = "text-white",
  logo,
  color,
  onClick,
  disabled,
  className,
}) => {
  const Icon = logo ? logoMap[logo] : null;

  return (
    <button
      type={type}
      className={`px-4 py-2 ${textColor} bg-${color}-500 rounded-md flex items-center ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {text}
    </button>
  );
};

export default Button;