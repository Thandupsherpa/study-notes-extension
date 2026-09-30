import { ExternalLink } from 'lucide-react';
import { DigiicampusSessionStatus } from '../../types';

interface StatusBannerProps {
  status: DigiicampusSessionStatus | null;
  useMockData: boolean;
}

export function StatusBanner({ status, useMockData }: StatusBannerProps) {
  const isConnected = useMockData || (status?.isConnected ?? false);

  return (
    <div className={`status-bar ${isConnected ? 'connected' : 'disconnected'}`}>
      <div className="status-dot-text">
        <span className="status-dot" />
        <span>
          {isConnected
            ? useMockData
              ? "Connected (Dev Mode)"
              : status?.studentName
                ? `Connected (${status.studentName})`
                : "Connected to Digiicampus"
            : "Digiicampus not detected"}
        </span>
      </div>

      {!isConnected && (
        <a
          href="https://msu.digiicampus.com"
          target="_blank"
          rel="noreferrer"
          className="open-portal-link"
        >
          <span>Open Digiicampus</span>
          <ExternalLink size={10} />
        </a>
      )}
    </div>
  );
}
