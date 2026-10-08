const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const BACKUP_FILENAME = 'dinerforged-backup.json';

// Initialize Google Token Client for OAuth 2.0 Popup Flow
export function initGoogleTokenClient(clientId: string, callback: (token: string) => void) {
  if (!(window as any).google?.accounts?.oauth2) {
    throw new Error('Google Identity Services script not loaded.');
  }

  return (window as any).google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: SCOPES,
    callback: (response: any) => {
      if (response && response.access_token) {
        callback(response.access_token);
      }
    },
  });
}

// Upload/Backup App State to Google Drive
export async function uploadBackupToDrive(appStateData: object, accessToken: string) {
  const metadata = {
    name: BACKUP_FILENAME,
    mimeType: 'application/json',
  };

  // Check if file already exists to overwrite or create new
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${BACKUP_FILENAME}' and trashed=false`,
    {
      headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
    }
  );
  const searchData = await searchRes.json();
  const existingFileId = searchData.files?.[0]?.id;

  const fileContent = JSON.stringify(appStateData, null, 2);
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([fileContent], { type: 'application/json' }));

  const endpoint = existingFileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart`
    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

  const method = existingFileId ? 'PATCH' : 'POST';

  const response = await fetch(endpoint, {
    method,
    headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
    body: form,
  });

  if (!response.ok) {
    throw new Error('Failed to upload backup to Google Drive.');
  }

  return response.json();
}

// Download/Restore App State from Google Drive
export async function downloadBackupFromDrive(accessToken: string): Promise<any | null> {
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${BACKUP_FILENAME}' and trashed=false`,
    {
      headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
    }
  );
  const searchData = await searchRes.json();

  if (!searchData.files || searchData.files.length === 0) {
    return null;
  }

  const fileId = searchData.files[0].id;
  const fileRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
  });

  if (!fileRes.ok) {
    throw new Error('Failed to download backup from Google Drive.');
  }

  return fileRes.json();
}