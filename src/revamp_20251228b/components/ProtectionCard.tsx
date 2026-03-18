import { Text } from "./Text";

type ProtectionCardProps = {
  phrase: string;
};

export function ProtectionCard({ phrase }: ProtectionCardProps) {
  return <Text className="revamp-protectionPhrase">{phrase}</Text>;
}
