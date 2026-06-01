import { BfStatTile } from "@/components/botafarm/bf-stat-tile";

type StatCardProps = {
  label: string;
  value: string;
  helpText?: string;
};

export function StatCard({ label, value, helpText }: StatCardProps) {
  return (
    <BfStatTile label={label} value={value} trend={helpText} accent="neutral" compact />
  );
}
