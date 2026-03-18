type DebugLineProps = {
  dataMode: string;
  contractVersion: string;
};

export function DebugLine({ dataMode, contractVersion }: DebugLineProps) {
  return (
    <p className="revamp-muted">
      DataMode: {dataMode}, Contract: {contractVersion}
    </p>
  );
}
