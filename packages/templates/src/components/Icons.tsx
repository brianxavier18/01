/** Ícone genérico de chat/telefone (não usa marca de terceiros). */
export const ChatPhoneIcon: React.FC<{ size: number; color: string; background: string }> = ({
  size,
  color,
  background,
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path
      d="M32 4C16.5 4 4 15.6 4 30c0 7.4 3.3 14 8.6 18.8L10 60l12.3-6.2C25.4 55.2 28.6 56 32 56c15.5 0 28-11.6 28-26S47.5 4 32 4z"
      fill={color}
    />
    <path
      d="M24.5 18.5c-.8-1.8-1.6-1.8-2.4-1.9h-2c-.7 0-1.8.3-2.8 1.3s-3.6 3.5-3.6 8.6 3.7 10 4.2 10.7c.5.7 7.2 11.5 17.8 15.6 8.8 3.5 10.6 2.8 12.5 2.6 1.9-.2 6.2-2.5 7-5s.9-4.6.6-5c-.2-.4-.9-.7-1.9-1.2s-6.2-3-7.1-3.4c-1-.3-1.6-.5-2.3.5-.7 1-2.7 3.4-3.3 4.1-.6.7-1.2.8-2.2.3-1-.5-4.4-1.6-8.3-5.1-3.1-2.7-5.1-6.1-5.7-7.1-.6-1-.1-1.6.4-2.1.5-.4 1-1.2 1.5-1.8.5-.6.7-1 1-1.7.3-.7.2-1.3-.1-1.8-.2-.5-2.2-5.5-3.1-7.5z"
      fill={background}
      transform="translate(32 32) scale(0.62) translate(-32 -34)"
    />
  </svg>
);

export const PinIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
      fill={color}
    />
  </svg>
);

export const AtIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.4" cy="6.6" r="1.2" fill={color} stroke="none" />
  </svg>
);
