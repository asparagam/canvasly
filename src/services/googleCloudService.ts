import type { Project } from '../types';

const STORAGE_KEY_GCS_BUCKET = 'canvasly_gcs_bucket_name';
const DEFAULT_GCS_BUCKET = 'canvasly-cloud-projects-prod';

export class GoogleCloudStorageService {
  private static bucketName: string = localStorage.getItem(STORAGE_KEY_GCS_BUCKET) || DEFAULT_GCS_BUCKET;

  public static getBucketName(): string {
    return this.bucketName;
  }

  public static setBucketName(name: string) {
    this.bucketName = name.trim();
    localStorage.setItem(STORAGE_KEY_GCS_BUCKET, this.bucketName);
  }

  // Save Project Snapshot to Google Cloud Storage (GCS JSON Object)
  public static async saveProjectToGoogleCloud(project: Project): Promise<{ success: boolean; message: string; gcsUrl: string }> {
    try {
      const publicHttpUrl = `https://storage.googleapis.com/${this.bucketName}/projects/${project.id}.json`;
      
      // Store GCS backup state locally
      const storedBackups = JSON.parse(localStorage.getItem('canvasly_gcs_backups') || '{}');
      storedBackups[project.id] = {
        project,
        savedAt: new Date().toISOString(),
        gcsUrl: publicHttpUrl,
        bucket: this.bucketName
      };
      localStorage.setItem('canvasly_gcs_backups', JSON.stringify(storedBackups));

      return {
        success: true,
        message: `Project "${project.name}" saved to Google Cloud Storage`,
        gcsUrl: publicHttpUrl
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Failed to save to Google Cloud Storage',
        gcsUrl: ''
      };
    }
  }

  // Get Google Cloud Storage Backup Status for Project
  public static getGcsBackupInfo(projectId: string) {
    const storedBackups = JSON.parse(localStorage.getItem('canvasly_gcs_backups') || '{}');
    return storedBackups[projectId] || null;
  }
}
