import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./ChatPriceSlider.css";

interface ChatPriceSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const ChatPriceSlider: React.FC<ChatPriceSliderProps> = ({ value, onChange }) => {
  return (
    <div className="chat-price-slider">
      <div className="price-display">
        <span className="price-value">{value.toFixed(3)} SOL</span>
      </div>
      <Slider
        min={0.01}
        max={1}
        step={0.001}
        value={value}
        onChange={(newValue) => onChange(newValue as number)}
        trackStyle={{ backgroundColor: "#76ff9c", height: 6 }}
        handleStyle={{
          borderColor: "black",
          backgroundColor: "black",
          height: 16,
          width: 16,
          marginTop: -6,
          boxShadow: "0 0 0 2px #76ff9c"
        }}
        railStyle={{ backgroundColor: "rgba(118, 255, 156, 0.2)", height: 6 }}
      />
      <div className="slider-labels">
        <span>0.01 SOL</span>
        <span>1 SOL</span>
      </div>
    </div>
  );
};

export default ChatPriceSlider;
