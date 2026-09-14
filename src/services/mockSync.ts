export type SyncStage = 'idle' | 'local' | 'syncing' | 'synced' | 'verification';

export interface SyncState {
  stage: SyncStage;
  progress: number;
  message: string;
}

export async function runSyncAnimation(
  onUpdate: (state: SyncState) => void,
  count: number = 1
): Promise<void> {
  const plural = count > 1 ? `${count} reports` : '1 report';

  onUpdate({ stage: 'local', progress: 10, message: `Reading ${plural} from local storage...` });
  await delay(600);

  onUpdate({ stage: 'syncing', progress: 35, message: `Uploading ${plural} to cloud server...` });
  await delay(800);

  onUpdate({ stage: 'syncing', progress: 65, message: 'Encrypting and transmitting data...' });
  await delay(600);

  onUpdate({ stage: 'synced', progress: 85, message: `${plural} synchronized successfully.` });
  await delay(500);

  onUpdate({ stage: 'verification', progress: 100, message: 'Entering verification queue...' });
  await delay(400);

  onUpdate({ stage: 'idle', progress: 100, message: 'Sync complete.' });
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
